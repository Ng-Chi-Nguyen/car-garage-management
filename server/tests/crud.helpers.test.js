import test from "node:test";
import assert from "node:assert/strict";

import {
  buildFilterCondition,
  buildListWhere,
  buildSearchCondition,
  buildWriteData,
  buildPagination,
} from "../src/shared/crud/crud.helpers.js";

test("buildSearchCondition trả về OR contains cho các field cấu hình", () => {
  const result = buildSearchCondition("  toyota  ", ["TenHieuXe", "GhiChu"]);

  assert.deepEqual(result, {
    OR: [
      { TenHieuXe: { contains: "toyota" } },
      { GhiChu: { contains: "toyota" } },
    ],
  });
});

test("buildSearchCondition bỏ qua search rỗng hoặc không có field", () => {
  assert.deepEqual(buildSearchCondition("   ", ["TenHieuXe"]), {});
  assert.deepEqual(buildSearchCondition("abc", []), {});
});

test("buildSearchCondition map enum search sang in filter", () => {
  const result = buildSearchCondition("dang sua", [
    {
      field: "TrangThai",
      type: "enum",
      values: ["TiepNhan", "DangSua", "HoanTat"],
      aliases: {
        "dang sua": ["DangSua"],
      },
    },
  ]);

  assert.deepEqual(result, {
    OR: [{ TrangThai: { in: ["DangSua"] } }],
  });
});

test("buildSearchCondition map enum search tieng Viet sang in filter", () => {
  const result = buildSearchCondition("đang sửa", [
    {
      field: "TrangThai",
      type: "enum",
      values: ["TiepNhan", "DangSua", "HoanTat"],
      aliases: {
        "dang sua": ["DangSua"],
      },
    },
  ]);

  assert.deepEqual(result, {
    OR: [{ TrangThai: { in: ["DangSua"] } }],
  });
});

test("buildListWhere kết hợp search với enum filter và number filter", () => {
  const result = buildListWhere({
    search: "rung",
    filters: { TrangThai: ["DangSua", "TiepNhan"], MaXe: "1" },
    searchFields: ["NoiDungLoi", "GhiChu"],
    filterFields: {
      TrangThai: {
        type: "enum",
        values: ["TiepNhan", "DangSua", "HoanTat"],
        multi: true,
      },
      MaXe: { type: "number" },
    },
  });

  assert.deepEqual(result, {
    AND: [
      {
        OR: [
          { NoiDungLoi: { contains: "rung" } },
          { GhiChu: { contains: "rung" } },
        ],
      },
      { TrangThai: { in: ["DangSua", "TiepNhan"] } },
      { MaXe: 1 },
    ],
  });
});

test("buildFilterCondition bo qua enum filter khong hop le", () => {
  const result = buildFilterCondition(
    { TrangThai: "KhongHopLe" },
    {
      TrangThai: {
        type: "enum",
        values: ["TiepNhan", "DangSua", "HoanTat"],
        multi: true,
      },
    },
  );

  assert.deepEqual(result, {});
});

test("buildFilterCondition bo qua number filter khong hop le", () => {
  const result = buildFilterCondition({ MaXe: "abc" }, { MaXe: { type: "number" } });

  assert.deepEqual(result, {});
});

test("buildFilterCondition support decimal exact match", () => {
  const result = buildFilterCondition({ DonGia: "250000.5" }, { DonGia: { type: "decimal" } });

  assert.deepEqual(result, {
    AND: [{ DonGia: 250000.5 }],
  });
});

test("buildFilterCondition bo qua string filter chi co whitespace", () => {
  const result = buildFilterCondition({ TenChuXe: "   " }, { TenChuXe: { type: "string" } });

  assert.deepEqual(result, {});
});

test("buildFilterCondition gop dateFrom dateTo ve target field", () => {
  const result = buildFilterCondition(
    {
      NgayTaoFrom: "2026-03-01",
      NgayTaoTo: "2026-03-31",
    },
    {
      NgayTaoFrom: { type: "dateFrom", targetField: "NgayTao" },
      NgayTaoTo: { type: "dateTo", targetField: "NgayTao" },
    },
  );

  assert.deepEqual(result, {
    AND: [
      {
        NgayTao: {
          gte: new Date("2026-03-01"),
          lte: new Date("2026-03-31T23:59:59.999Z"),
        },
      },
    ],
  });
});

test("buildFilterCondition bo qua decimal va date khong hop le", () => {
  const result = buildFilterCondition(
    {
      DonGia: "abc",
      NgayTaoFrom: "not-a-date",
      NgayTaoTo: "",
    },
    {
      DonGia: { type: "decimal" },
      NgayTaoFrom: { type: "dateFrom", targetField: "NgayTao" },
      NgayTaoTo: { type: "dateTo", targetField: "NgayTao" },
    },
  );

  assert.deepEqual(result, {});
});

test("buildFilterCondition throw error voi filter type khong supported", () => {
  assert.throws(
    () => buildFilterCondition({ MaKH: "1" }, { MaKH: { type: "unsupportedType" } }),
    /unsupported filter type/i,
  );
});

test("buildWriteData chỉ lấy field cho phép và bỏ undefined", () => {
  const result = buildWriteData(
    {
      TenNCC: "NCC A",
      Email: null,
      GhiChu: undefined,
      ignored: "x",
    },
    ["TenNCC", "Email", "GhiChu"],
  );

  assert.deepEqual(result, {
    TenNCC: "NCC A",
    Email: null,
  });
});

test("buildPagination chuẩn hóa page limit và skip", () => {
  const result = buildPagination({ page: 3, limit: 20 });

  assert.deepEqual(result, {
    page: 3,
    limit: 20,
    skip: 40,
  });
});

test("buildPagination fallback default khi input khong hop le", () => {
  const result = buildPagination({ page: "abc", limit: 0 });

  assert.deepEqual(result, {
    page: 1,
    limit: 10,
    skip: 0,
  });
});
