import {
  adjustPartStock,
  calculateImportLineTotal,
  syncStockReceiptTotal,
} from "../../shared/crud/crudBusiness.helpers.js";

const TRANSACTION_OPTIONS = { isolationLevel: "Serializable" };

const toUniqueNumberList = (values = []) => Array.from(new Set(values.map((value) => Number(value))));

const ensureRecordExists = (record, message) => {
  if (!record) {
    throw new Error(message);
  }

  return record;
};

const ensureAllRecordsFound = (records, ids, message) => {
  if (records.length !== ids.length) {
    throw new Error(message);
  }

  return records;
};

const sumQuantityByField = (items = [], idField, quantityField) => {
  return items.reduce((result, item) => {
    const id = Number(item[idField]);
    const quantity = Number(item[quantityField]);

    result.set(id, (result.get(id) ?? 0) + quantity);
    return result;
  }, new Map());
};

const buildStockReceiptCreateData = (stockReceipt) => {
  return {
    MaNCC: Number(stockReceipt.MaNCC),
    NgayNhap: stockReceipt.NgayNhap,
    TongTien: 0,
  };
};

const normalizeReceipt = (stockReceipt) => ({
  id: Number(stockReceipt.MaPhieuNhap),
  supplierId: Number(stockReceipt.MaNCC),
  importedAt: stockReceipt.NgayNhap,
  totalAmount: Number(stockReceipt.TongTien ?? 0),
});

const normalizeReceiptItem = (detail) => ({
  receiptDetailId: Number(detail.MaCTPN),
  partId: Number(detail.MaVatTu),
  quantity: Number(detail.SoLuong),
  unitPrice: Number(detail.DonGiaNhap),
  lineTotal: Number(detail.ThanhTien ?? 0),
  stockAfter: Number(detail.stockAfter ?? 0),
  inventoryValueAfter: Number(detail.inventoryValueAfter ?? detail.ThanhTien ?? 0),
});

// Chuan hoa detail va tinh ThanhTien ngay tai service de payload luu kho nhat quan,
// khong phu thuoc so tien client tu tinh.
const buildStockReceiptDetailCreateData = (maPhieuNhap, details) => {
  return details.map((detail) => ({
    MaPhieuNhap: Number(maPhieuNhap),
    MaVatTu: Number(detail.MaVatTu),
    SoLuong: Number(detail.SoLuong),
    DonGiaNhap: Number(detail.DonGiaNhap),
    ThanhTien: calculateImportLineTotal(detail.SoLuong, detail.DonGiaNhap),
  }));
};

const buildStockReceiptMutationResponse = (stockReceipt, stockReceiptDetails) => {
  return {
    receipt: normalizeReceipt(stockReceipt),
    items: stockReceiptDetails.map(normalizeReceiptItem),
    totals: {
      receiptQuantity: stockReceiptDetails.reduce((total, detail) => {
        return total + Number(detail.quantity ?? detail.SoLuong ?? 0);
      }, 0),
      receiptAmount: stockReceiptDetails.reduce((total, detail) => {
        return total + Number(detail.inventoryValueAfter ?? detail.ThanhTien ?? 0);
      }, 0),
    },
  };
};

const resolveDb = async (db) => db ?? (await import("../../db/prisma.js")).default;

// Pre-check nha cung cap va vat tu ton tai truoc khi tao phieu nhap.
const validateStockReceiptReferences = async (tx, stockReceipt, details) => {
  ensureRecordExists(
    await tx.nHA_CUNG_CAP.findUnique({
      where: {
        MaNCC: Number(stockReceipt.MaNCC),
      },
      select: {
        MaNCC: true,
      },
    }),
    "Không tìm thấy nhà cung cấp.",
  );

  const partIds = toUniqueNumberList(details.map((detail) => detail.MaVatTu));
  const parts = await tx.vAT_TU.findMany({
    where: {
      MaVatTu: {
        in: partIds,
      },
    },
    select: {
      MaVatTu: true,
    },
  });

  ensureAllRecordsFound(parts, partIds, "Không tìm thấy vật tư.");
};

const createStockReceiptWorkflowService = ({
  db,
  businessHelpers = {
    adjustPartStock,
    syncStockReceiptTotal,
  },
} = {}) => {
  const resolveClient = async () => resolveDb(db);

  return {
    createStockReceiptAtomic: async (payload) => {
      const client = await resolveClient();
      return client.$transaction(async (tx) => {
        // B1: validate tham chieu nghiep vu truoc khi co bat ky DB write nao.
        await validateStockReceiptReferences(tx, payload.stockReceipt, payload.details);

        // B2: tao phieu nhap header de lay MaPhieuNhap cho cac dong chi tiet.
        const stockReceipt = await tx.pHIEU_NHAP_KHO.create({
          data: buildStockReceiptCreateData(payload.stockReceipt),
        });
        const detailData = buildStockReceiptDetailCreateData(stockReceipt.MaPhieuNhap, payload.details);

        // B3: tao batch detail trong cung transaction.
        await tx.cT_PHIEU_NHAP.createMany({
          data: detailData,
        });

        // B4: cong ton kho sau khi detail da duoc tao thanh cong.
        for (const [maVatTu, quantity] of sumQuantityByField(detailData, "MaVatTu", "SoLuong").entries()) {
          await businessHelpers.adjustPartStock(tx, maVatTu, quantity);
        }

        // B5: tinh lai TongTien tu detail da luu de tranh lech tong.
        await businessHelpers.syncStockReceiptTotal(tx, stockReceipt.MaPhieuNhap);

        const createdStockReceipt = await tx.pHIEU_NHAP_KHO.findUnique({
          where: {
            MaPhieuNhap: stockReceipt.MaPhieuNhap,
          },
        });
        const createdStockReceiptDetails = await tx.cT_PHIEU_NHAP.findMany({
          where: {
            MaPhieuNhap: stockReceipt.MaPhieuNhap,
          },
        });

        const stockReceiptItems = [];
        for (const detail of createdStockReceiptDetails) {
          const part = await tx.vAT_TU.findUnique({
            where: {
              MaVatTu: Number(detail.MaVatTu),
            },
            select: {
              SoLuongTon: true,
            },
          });

          stockReceiptItems.push({
            ...detail,
            stockAfter: Number(part?.SoLuongTon ?? 0),
            inventoryValueAfter: Number(detail.ThanhTien ?? 0),
          });
        }

        return buildStockReceiptMutationResponse(createdStockReceipt, stockReceiptItems);
      }, TRANSACTION_OPTIONS);
    },
  };
};

const stockReceiptWorkflowService = createStockReceiptWorkflowService();

export { createStockReceiptWorkflowService };
export default {
  create: stockReceiptWorkflowService.createStockReceiptAtomic,
  createStockReceiptAtomic: stockReceiptWorkflowService.createStockReceiptAtomic,
};
