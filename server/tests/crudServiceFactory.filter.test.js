import test from "node:test";
import assert from "node:assert/strict";

import prisma from "../src/db/prisma.js";
import createCrudService from "../src/shared/crud/crud.serviceFactory.js";

test("createCrudService getAll dung buildListWhere voi filterFields", async () => {
  const delegateName = "__crudServiceFactoryFilterDelegate__";
  const originalDelegate = prisma[delegateName];
  const originalTransaction = prisma.$transaction;
  const calls = { count: null, findMany: null };

  prisma[delegateName] = {
    count: (args) => {
      calls.count = args;
      return 2;
    },
    findMany: (args) => {
      calls.findMany = args;
      return [{ MaPhieu: 1 }];
    },
  };
  prisma.$transaction = async (operations) => operations;

  try {
    const service = createCrudService({
      delegateName,
      idField: "MaPhieu",
      createFields: ["NoiDung"],
      searchFields: ["NoiDung"],
      filterFields: {
        MaXe: { type: "number" },
        DonGia: { type: "decimal" },
        NgayTaoFrom: { type: "dateFrom", targetField: "NgayTao" },
        NgayTaoTo: { type: "dateTo", targetField: "NgayTao" },
      },
      listKey: "items",
      notFoundMessage: "not found",
    });

    const result = await service.getAll({
      page: "2",
      limit: "5",
      search: "abc",
      MaXe: "7",
      DonGia: "125000.5",
      NgayTaoFrom: "2026-03-01",
      NgayTaoTo: "2026-03-31",
    });

    assert.deepEqual(calls.count, {
      where: {
        AND: [
          { OR: [{ NoiDung: { contains: "abc" } }] },
          { MaXe: 7 },
          { DonGia: 125000.5 },
          {
            NgayTao: {
              gte: new Date("2026-03-01"),
              lte: new Date("2026-03-31T23:59:59.999Z"),
            },
          },
        ],
      },
    });

    assert.deepEqual(calls.findMany, {
      where: {
        AND: [
          { OR: [{ NoiDung: { contains: "abc" } }] },
          { MaXe: 7 },
          { DonGia: 125000.5 },
          {
            NgayTao: {
              gte: new Date("2026-03-01"),
              lte: new Date("2026-03-31T23:59:59.999Z"),
            },
          },
        ],
      },
      skip: 5,
      take: 5,
      orderBy: { MaPhieu: "desc" },
    });

    assert.deepEqual(result, {
      items: [{ MaPhieu: 1 }],
      pagination: {
        page: 2,
        limit: 5,
        totalItems: 2,
        totalPages: 1,
      },
    });
  } finally {
    prisma.$transaction = originalTransaction;

    if (originalDelegate === undefined) {
      delete prisma[delegateName];
    } else {
      prisma[delegateName] = originalDelegate;
    }
  }
});

test("createCrudService getAll throw error voi filterFields type khong supported", async () => {
  const delegateName = "__crudServiceFactoryUnsupportedTypeDelegate__";
  const originalDelegate = prisma[delegateName];
  const originalTransaction = prisma.$transaction;

  prisma[delegateName] = {
    count: () => 0,
    findMany: () => [],
  };
  prisma.$transaction = async (operations) => operations;

  try {
    const service = createCrudService({
      delegateName,
      idField: "MaPhieu",
      createFields: ["NoiDung"],
      filterFields: {
        MaXe: { type: "unsupportedType" },
      },
      listKey: "items",
      notFoundMessage: "not found",
    });

    await assert.rejects(() => service.getAll({ MaXe: "7" }), /unsupported filter type/i);
  } finally {
    prisma.$transaction = originalTransaction;

    if (originalDelegate === undefined) {
      delete prisma[delegateName];
    } else {
      prisma[delegateName] = originalDelegate;
    }
  }
});

test("createCrudService getAll giu backward compatibility voi searchFields", async () => {
  const delegateName = "__crudServiceFactorySearchOnlyDelegate__";
  const originalDelegate = prisma[delegateName];
  const originalTransaction = prisma.$transaction;
  const calls = { count: null, findMany: null };

  prisma[delegateName] = {
    count: (args) => {
      calls.count = args;
      return 0;
    },
    findMany: (args) => {
      calls.findMany = args;
      return [];
    },
  };
  prisma.$transaction = async (operations) => operations;

  try {
    const service = createCrudService({
      delegateName,
      idField: "MaPhieu",
      createFields: ["NoiDung"],
      searchFields: ["NoiDung"],
      listKey: "items",
      notFoundMessage: "not found",
    });

    await service.getAll({ search: "abc", MaXe: "7" });

    assert.deepEqual(calls.count, {
      where: {
        OR: [{ NoiDung: { contains: "abc" } }],
      },
    });

    assert.deepEqual(calls.findMany.where, {
      OR: [{ NoiDung: { contains: "abc" } }],
    });
  } finally {
    prisma.$transaction = originalTransaction;

    if (originalDelegate === undefined) {
      delete prisma[delegateName];
    } else {
      prisma[delegateName] = originalDelegate;
    }
  }
});
