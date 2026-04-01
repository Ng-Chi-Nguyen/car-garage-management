import prisma from "../../db/prisma.js";
import {
  adjustPartStock,
  calculateImportLineTotal,
  syncStockReceiptTotal,
} from "../../shared/crud/crudBusiness.helpers.js";
import {
  ensureAllRecordsFound,
  ensureRecordExists,
  sumQuantityByField,
  toUniqueNumberList,
  TRANSACTION_OPTIONS,
} from "./workflow.helpers.js";

const buildStockReceiptCreateData = (stockReceipt) => {
  return {
    MaNCC: Number(stockReceipt.MaNCC),
    NgayNhap: stockReceipt.NgayNhap,
    TongTien: 0,
  };
};

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
    stockReceipt,
    stockReceiptDetails,
    inventoryValueAfter: stockReceiptDetails.reduce((total, detail) => {
      return total + Number(detail.ThanhTien ?? 0);
    }, 0),
  };
};

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
  db = prisma,
  businessHelpers = {
    adjustPartStock,
    syncStockReceiptTotal,
  },
} = {}) => {
  return {
    createStockReceiptAtomic: async (payload) => {
      return db.$transaction(async (tx) => {
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

        return buildStockReceiptMutationResponse(createdStockReceipt, createdStockReceiptDetails);
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
