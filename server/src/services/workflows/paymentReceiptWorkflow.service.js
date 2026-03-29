import prisma from "../../db/prisma.js";
import {
  ensurePaymentWithinDebt,
  syncVehicleDebt,
} from "../../shared/crud/crudBusiness.helpers.js";
import { ensureRecordExists, TRANSACTION_OPTIONS } from "./workflow.helpers.js";

const buildPaymentReceiptCreateData = (paymentReceipt) => {
  return {
    MaXe: Number(paymentReceipt.MaXe),
    MaNV:
      paymentReceipt.MaNV === null || paymentReceipt.MaNV === undefined
        ? null
        : Number(paymentReceipt.MaNV),
    NgayThu: paymentReceipt.NgayThu,
    SoTienThu: Number(paymentReceipt.SoTienThu),
    PhuongThucThu: paymentReceipt.PhuongThucThu ?? null,
    TrangThai: paymentReceipt.TrangThai ?? "ChoXacNhan",
    GhiChu: paymentReceipt.GhiChu ?? null,
  };
};

const createPaymentReceiptWorkflowService = ({
  db = prisma,
  businessHelpers = {
    ensurePaymentWithinDebt,
    syncVehicleDebt,
  },
} = {}) => {
  return {
    createPaymentReceiptAtomic: async (payload) => {
      return db.$transaction(async (tx) => {
        // Workflow nay don gian hon 2 workflow con lai, nhung van tach rieng de dam bao
        // phieu thu va cap nhat cong no luon cung thanh cong hoac cung rollback.
        const paymentReceiptData = payload.paymentReceipt;

        // B1: xac thuc xe ton tai trong transaction hien tai.
        ensureRecordExists(
          await tx.xE.findUnique({
            where: {
              MaXe: Number(paymentReceiptData.MaXe),
            },
            select: {
              MaXe: true,
            },
          }),
          "Không tìm thấy xe.",
        );

        // B2: chan truoc truong hop thu vuot cong no truoc khi tao phieu thu.
        await businessHelpers.ensurePaymentWithinDebt(
          tx,
          paymentReceiptData.MaXe,
          paymentReceiptData.SoTienThu,
        );

        // B3: tao phieu thu tien.
        const paymentReceipt = await tx.pHIEU_THU_TIEN.create({
          data: buildPaymentReceiptCreateData(paymentReceiptData),
        });

        // B4: dong bo cong no ngay trong cung transaction voi phieu thu vua tao.
        await businessHelpers.syncVehicleDebt(tx, paymentReceipt.MaXe);

        return {
          paymentReceipt,
        };
      }, TRANSACTION_OPTIONS);
    },
  };
};

const paymentReceiptWorkflowService = createPaymentReceiptWorkflowService();

export { createPaymentReceiptWorkflowService };
export default {
  create: paymentReceiptWorkflowService.createPaymentReceiptAtomic,
  createPaymentReceiptAtomic: paymentReceiptWorkflowService.createPaymentReceiptAtomic,
};
