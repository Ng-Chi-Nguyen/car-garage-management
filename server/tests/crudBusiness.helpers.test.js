import test from "node:test";
import assert from "node:assert/strict";

import { ensurePaymentWithinDebt, syncVehicleDebt } from "../src/shared/crud/crudBusiness.helpers.js";

const createTx = (state) => ({
  pHIEU_SUA_CHUA: {
    aggregate: async () => ({ _sum: { TongTien: state.repairTotal } }),
  },
  pHIEU_THU_TIEN: {
    aggregate: async ({ where }) => {
      const total = state.payments
        .filter((payment) => payment.MaXe === where.MaXe && payment.TrangThai === where.TrangThai)
        .reduce((sum, payment) => sum + payment.SoTienThu, 0);

      return { _sum: { SoTienThu: total } };
    },
  },
  xE: {
    update: async ({ data }) => {
      state.updatedDebt = data.TienNoHienTai;
    },
  },
});

test("ensurePaymentWithinDebt excludes ChoXacNhan and Huy from available debt", async () => {
  const state = {
    repairTotal: 500000,
    payments: [
      { MaXe: 1, TrangThai: "DaThu", SoTienThu: 100000 },
      { MaXe: 1, TrangThai: "ChoXacNhan", SoTienThu: 200000 },
      { MaXe: 1, TrangThai: "Huy", SoTienThu: 150000 },
    ],
  };

  await assert.rejects(
    ensurePaymentWithinDebt(createTx(state), 1, 450001),
    /Số tiền thu không được vượt quá số tiền nợ hiện tại./,
  );

  await assert.doesNotReject(
    ensurePaymentWithinDebt(createTx(state), 1, 400000),
  );
});

test("syncVehicleDebt ignores ChoXacNhan and Huy receipts", async () => {
  const state = {
    repairTotal: 500000,
    payments: [
      { MaXe: 1, TrangThai: "DaThu", SoTienThu: 100000 },
      { MaXe: 1, TrangThai: "ChoXacNhan", SoTienThu: 200000 },
      { MaXe: 1, TrangThai: "Huy", SoTienThu: 150000 },
    ],
    updatedDebt: null,
  };

  await syncVehicleDebt(createTx(state), 1);

  assert.equal(state.updatedDebt, 400000);
});
