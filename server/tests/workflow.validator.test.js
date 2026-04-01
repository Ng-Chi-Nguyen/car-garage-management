import test from "node:test";
import assert from "node:assert/strict";

import paymentReceiptWorkflowSchema from "../src/validator/workflows/paymentReceiptWorkflow.validator.js";
import repairOrderWorkflowSchema from "../src/validator/workflows/repairOrderWorkflow.validator.js";
import stockReceiptWorkflowSchema from "../src/validator/workflows/stockReceiptWorkflow.validator.js";

test("repair order workflow validator chap nhan payload long nhau hop le", () => {
  const { error, value } = repairOrderWorkflowSchema.create.body.validate({
    repairOrder: {
      MaXe: 1,
      MaNV: 2,
      NgaySC: "2026-03-25",
      TrangThai: "DangSua",
      NoiDungLoi: "May khong no",
      GhiChu: "Kiem tra nhanh",
    },
    details: [
      {
        MaVatTu: 3,
        MaTienCong: 4,
        SoLuong: 2,
        DonGiaVatTu: 150000,
        DonGiaTienCong: 50000,
      },
    ],
  });

  assert.equal(error, undefined);
  assert.ok(value.repairOrder.NgaySC instanceof Date);
  assert.equal(value.details[0].SoLuong, 2);
});

test("repair order workflow validator tu choi TongTien tu client", () => {
  const { error } = repairOrderWorkflowSchema.create.body.validate({
    repairOrder: {
      MaXe: 1,
      MaNV: 2,
      NgaySC: "2026-03-25",
      TrangThai: "DangSua",
      NoiDungLoi: "May khong no",
      GhiChu: "Kiem tra nhanh",
      TongTien: 999999,
    },
    details: [
      {
        MaVatTu: 3,
        MaTienCong: 4,
        SoLuong: 2,
        DonGiaVatTu: 150000,
        DonGiaTienCong: 50000,
      },
    ],
  });

  assert.ok(error);
  assert.match(error.message, /TongTien/);
});

test("stock receipt workflow validator bat buoc it nhat mot detail", () => {
  const { error } = stockReceiptWorkflowSchema.create.body.validate({
    stockReceipt: {
      MaNCC: 1,
      NgayNhap: "2026-03-25",
    },
    details: [],
  });

  assert.ok(error);
  assert.match(error.message, /details/);
});

test("payment receipt workflow validator yeu cau payload trong paymentReceipt", () => {
  const { error } = paymentReceiptWorkflowSchema.create.body.validate({
    MaXe: 1,
    SoTienThu: 100000,
  });

  assert.ok(error);
  assert.match(error.message, /paymentReceipt/);
});
