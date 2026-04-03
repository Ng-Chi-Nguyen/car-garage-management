import prisma from "../../db/prisma.js";
import { buildServiceError } from "../../shared/crud/crud.helpers.js";
import {
  adjustPartStock,
  calculateRepairLineTotal,
  syncRepairOrderTotal,
} from "../../shared/crud/crudBusiness.helpers.js";
import {
  ensureAllRecordsFound,
  ensureRecordExists,
  sumQuantityByField,
  toUniqueNumberList,
  TRANSACTION_OPTIONS,
} from "./workflow.helpers.js";

const REPAIR_ORDER_WORKFLOW_SELECT = {
  MaPhieuSC: true,
  MaXe: true,
  MaNV: true,
  NgaySC: true,
  TrangThai: true,
  NoiDungLoi: true,
  GhiChu: true,
  TongTien: true,
  NgayTao: true,
  NgayCapNhat: true,
};

const buildRepairOrderCreateData = (repairOrder) => {
  return {
    MaXe: Number(repairOrder.MaXe),
    MaNV: repairOrder.MaNV === null || repairOrder.MaNV === undefined ? null : Number(repairOrder.MaNV),
    NgaySC: repairOrder.NgaySC,
    TrangThai: repairOrder.TrangThai ?? "TiepNhan",
    NoiDungLoi: repairOrder.NoiDungLoi ?? null,
    GhiChu: repairOrder.GhiChu ?? null,
    TongTien: 0,
  };
};

// Chuan hoa toan bo detail truoc khi ghi DB de service tinh san ThanhTien snapshot
// va khong phu thuoc vao du lieu tinh toan tu client.
const buildRepairOrderDetailCreateData = (maPhieuSC, details) => {
  return details.map((detail) => ({
    MaPhieuSC: Number(maPhieuSC),
    MaVatTu: Number(detail.MaVatTu),
    MaTienCong: Number(detail.MaTienCong),
    SoLuong: Number(detail.SoLuong),
    DonGiaVatTu: Number(detail.DonGiaVatTu),
    DonGiaTienCong: Number(detail.DonGiaTienCong),
    ThanhTien: calculateRepairLineTotal(detail.SoLuong, detail.DonGiaVatTu, detail.DonGiaTienCong),
  }));
};

// Pre-check trong cung transaction: xac thuc xe, vat tu, tien cong ton tai va kiem tra
// tong so luong vat tu theo ca phieu truoc khi bat dau ghi header/detail.
const validateRepairOrderReferences = async (tx, repairOrder, details) => {
  ensureRecordExists(
    await tx.xE.findUnique({
      where: {
        MaXe: Number(repairOrder.MaXe),
      },
      select: {
        MaXe: true,
      },
    }),
    "Không tìm thấy xe.",
  );

  const partIds = toUniqueNumberList(details.map((detail) => detail.MaVatTu));
  const laborFeeIds = toUniqueNumberList(details.map((detail) => detail.MaTienCong));
  const [parts, laborFees] = await Promise.all([
    tx.vAT_TU.findMany({
      where: {
        MaVatTu: {
          in: partIds,
        },
      },
      select: {
        MaVatTu: true,
        SoLuongTon: true,
      },
    }),
    tx.tIEN_CONG.findMany({
      where: {
        MaTienCong: {
          in: laborFeeIds,
        },
      },
      select: {
        MaTienCong: true,
      },
    }),
  ]);

  ensureAllRecordsFound(parts, partIds, "Không tìm thấy vật tư.");
  ensureAllRecordsFound(laborFees, laborFeeIds, "Không tìm thấy tiền công.");

  const stockByPartId = new Map(parts.map((part) => [Number(part.MaVatTu), Number(part.SoLuongTon)]));
  const quantityByPartId = sumQuantityByField(details, "MaVatTu", "SoLuong");

  for (const [maVatTu, requiredQuantity] of quantityByPartId.entries()) {
    if (requiredQuantity > (stockByPartId.get(maVatTu) ?? 0)) {
      throw buildServiceError(400, "Số lượng tồn kho không đủ.");
    }
  }
};

const createRepairOrderWorkflowService = ({
  db = prisma,
  businessHelpers = {
    adjustPartStock,
    syncRepairOrderTotal,
  },
} = {}) => {
  return {
    createRepairOrderAtomic: async (payload) => {
      return db.$transaction(async (tx) => {
        // B1: chan som loi nghiep vu de tranh tao header roi moi phat hien thieu kho.
        await validateRepairOrderReferences(tx, payload.repairOrder, payload.details);

        // B2: tao phieu chinh truoc de lay MaPhieuSC lam foreign key cho detail.
        const repairOrder = await tx.pHIEU_SUA_CHUA.create({
          data: buildRepairOrderCreateData(payload.repairOrder),
        });
        const detailData = buildRepairOrderDetailCreateData(repairOrder.MaPhieuSC, payload.details);

        // B3: ghi toan bo chi tiet trong cung transaction voi header.
        await tx.cT_PHIEU_SUA_CHUA.createMany({
          data: detailData,
        });

        // B4: tru ton kho theo tong so luong vat tu gom theo MaVatTu.
        for (const [maVatTu, quantity] of sumQuantityByField(detailData, "MaVatTu", "SoLuong").entries()) {
          await businessHelpers.adjustPartStock(tx, maVatTu, -quantity);
        }

        // B5: dong bo TongTien sau cung de dam bao tong tien luon khop voi detail da luu.
        await businessHelpers.syncRepairOrderTotal(tx, repairOrder.MaPhieuSC);

        // Doc lai du lieu ngay trong transaction de tra ve ket qua da commit du kien.
        return {
          repairOrder: await tx.pHIEU_SUA_CHUA.findUnique({
            where: {
              MaPhieuSC: repairOrder.MaPhieuSC,
            },
            select: REPAIR_ORDER_WORKFLOW_SELECT,
          }),
          repairOrderDetails: await tx.cT_PHIEU_SUA_CHUA.findMany({
            where: {
              MaPhieuSC: repairOrder.MaPhieuSC,
            },
          }),
        };
      }, TRANSACTION_OPTIONS);
    },
  };
};

const repairOrderWorkflowService = createRepairOrderWorkflowService();

export { createRepairOrderWorkflowService };
export default {
  create: repairOrderWorkflowService.createRepairOrderAtomic,
  createRepairOrderAtomic: repairOrderWorkflowService.createRepairOrderAtomic,
};
