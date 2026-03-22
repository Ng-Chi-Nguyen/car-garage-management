import test from "node:test";
import assert from "node:assert/strict";
import Joi from "joi";

import createCrudValidator from "../src/shared/crud/crud.validatorFactory.js";
import { buildListQuerySchemaFromFilters } from "../src/shared/crud/crudFilterSchema.helpers.js";

test("buildListQuerySchemaFromFilters support string enum number decimal date range", () => {
  const schema = buildListQuerySchemaFromFilters({
    MaKH: { type: "number" },
    TenChuXe: { type: "string" },
    TrangThai: { type: "enum", values: ["HoatDong", "Ngung"], multi: true },
    DonGia: { type: "decimal" },
    NgayTaoFrom: { type: "dateFrom", targetField: "NgayTao" },
    NgayTaoTo: { type: "dateTo", targetField: "NgayTao" },
  });

  const { error, value } = schema.validate({
    page: "2",
    limit: "20",
    search: "honda",
    MaKH: "15",
    TenChuXe: "  Nguyen Van A  ",
    TrangThai: ["HoatDong", "Ngung"],
    DonGia: "250000.5",
    NgayTaoFrom: "2026-03-01",
    NgayTaoTo: "2026-03-31",
  });

  assert.equal(error, undefined);
  assert.equal(value.page, 2);
  assert.equal(value.limit, 20);
  assert.equal(value.search, "honda");
  assert.equal(value.MaKH, 15);
  assert.equal(value.TenChuXe, "Nguyen Van A");
  assert.deepEqual(value.TrangThai, ["HoatDong", "Ngung"]);
  assert.equal(value.DonGia, 250000.5);
  assert.ok(value.NgayTaoFrom instanceof Date);
  assert.ok(value.NgayTaoTo instanceof Date);
});

test("buildListQuerySchemaFromFilters support enum single va reject unknown query", () => {
  const schema = buildListQuerySchemaFromFilters({
    TrangThai: { type: "enum", values: ["HoatDong", "Ngung"], multi: true },
  });

  const singleEnum = schema.validate({ TrangThai: "HoatDong" });
  assert.equal(singleEnum.error, undefined);
  assert.equal(singleEnum.value.TrangThai, "HoatDong");

  const invalidQuery = schema.validate({ KhongTonTai: "x" });
  assert.notEqual(invalidQuery.error, undefined);
});

test("buildListQuerySchemaFromFilters enum chap nhan alias khi co descriptor.aliases", () => {
  const schema = buildListQuerySchemaFromFilters({
    TrangThai: {
      type: "enum",
      values: ["TiepNhan", "DangSua", "HoanTat"],
      aliases: {
        "dang sua": ["DangSua"],
      },
      multi: true,
    },
  });

  const singleAlias = schema.validate({ TrangThai: "dang sua" });
  assert.equal(singleAlias.error, undefined);
  assert.equal(singleAlias.value.TrangThai, "dang sua");

  const arrayAlias = schema.validate({ TrangThai: ["dang sua", "HoanTat"] });
  assert.equal(arrayAlias.error, undefined);
  assert.deepEqual(arrayAlias.value.TrangThai, ["dang sua", "HoanTat"]);

  const normalizedAlias = schema.validate({ TrangThai: "Đang sửa" });
  assert.equal(normalizedAlias.error, undefined);
  assert.equal(normalizedAlias.value.TrangThai, "Đang sửa");

  const normalizedAliasWithSpecialChar = schema.validate({ TrangThai: "dang-sua" });
  assert.equal(normalizedAliasWithSpecialChar.error, undefined);
  assert.equal(normalizedAliasWithSpecialChar.value.TrangThai, "dang-sua");
});

test("createCrudValidator giữ default list schema và hỗ trợ filterFields config", () => {
  const baseValidator = createCrudValidator({
    createBodySchema: Joi.object({ name: Joi.string().required() }).unknown(false),
    updateBodySchema: Joi.object({ name: Joi.string() }).min(1).unknown(false),
  });

  const baseQuery = baseValidator.getAll.query.validate({ page: "3", limit: "5", search: "abc" });
  assert.equal(baseQuery.error, undefined);
  assert.equal(baseQuery.value.page, 3);
  assert.equal(baseQuery.value.limit, 5);
  assert.equal(baseQuery.value.search, "abc");

  const extendedValidator = createCrudValidator({
    createBodySchema: Joi.object({ name: Joi.string().required() }).unknown(false),
    updateBodySchema: Joi.object({ name: Joi.string() }).min(1).unknown(false),
    filterFields: {
      MaKH: { type: "number" },
      TrangThai: { type: "enum", values: ["HoatDong", "Ngung"], multi: true },
    },
  });

  const extendedQuery = extendedValidator.getAll.query.validate({ MaKH: "9", TrangThai: ["HoatDong"] });
  assert.equal(extendedQuery.error, undefined);
  assert.equal(extendedQuery.value.MaKH, 9);
  assert.deepEqual(extendedQuery.value.TrangThai, ["HoatDong"]);
});

test("buildListQuerySchemaFromFilters throw error voi filter type khong supported", () => {
  assert.throws(
    () => buildListQuerySchemaFromFilters({ MaKH: { type: "unsupportedType" } }),
    /unsupported filter type/i,
  );
});
