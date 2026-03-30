import test from "node:test";
import assert from "node:assert/strict";

import repairOrderSchema from "../src/validator/management/repairOrder.validator.js";

test("repair order validator chap nhan TrangThai Huy", () => {
  const { error, value } = repairOrderSchema.create.body.validate({
    MaXe: 1,
    MaNV: 2,
    NgaySC: "2026-03-29",
    TrangThai: "Huy",
    NoiDungLoi: "May rung",
    GhiChu: "Khach yeu cau huy",
    TongTien: 0,
  });

  assert.equal(error, undefined);
  assert.equal(value.TrangThai, "Huy");
});

test("repair order validator tu choi NgayKetThuc tu payload public", () => {
  const { error } = repairOrderSchema.create.body.validate({
    MaXe: 1,
    MaNV: 2,
    NgaySC: "2026-03-29",
    TrangThai: "TiepNhan",
    NoiDungLoi: "May rung",
    GhiChu: "Thu nghiem",
    TongTien: 0,
    NgayKetThuc: "2026-03-29T10:00:00.000Z",
  });

  assert.ok(error);
  assert.match(error.message, /NgayKetThuc/);
});

test("repair order validator update khong inject TongTien mac dinh khi client khong gui", () => {
  const { error, value } = repairOrderSchema.update.body.validate({
    GhiChu: "Cap nhat ghi chu",
  });

  assert.equal(error, undefined);
  assert.equal(Object.hasOwn(value, "TongTien"), false);
});
