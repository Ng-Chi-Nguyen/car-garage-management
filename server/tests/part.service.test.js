import test from "node:test";
import assert from "node:assert/strict";

import prisma from "../src/db/prisma.js";
import partService, { PART_INCLUDE_SUPPLIER } from "../src/services/management/part.service.js";

test("partService getPartList include thong tin nha cung cap", async () => {
  const originalTransaction = prisma.$transaction;
  const originalCount = prisma.vAT_TU.count;
  const originalFindMany = prisma.vAT_TU.findMany;
  const calls = {
    count: null,
    findMany: null,
  };

  prisma.vAT_TU.count = async (args) => {
    calls.count = args;
    return 1;
  };
  prisma.vAT_TU.findMany = async (args) => {
    calls.findMany = args;
    return [
      {
        MaVatTu: 12,
        TenVatTu: "Loc gio dieu hoa",
        MaNCC: 6,
        NhaCungCap: {
          MaNCC: 6,
          TenNCC: "Cong ty A",
        },
      },
    ];
  };
  prisma.$transaction = async (operations) => Promise.all(operations);

  try {
    const result = await partService.getPartList({});

    assert.deepEqual(calls.count, { where: {} });
    assert.deepEqual(calls.findMany.include, PART_INCLUDE_SUPPLIER);
    assert.equal(result.parts[0].NhaCungCap.TenNCC, "Cong ty A");
  } finally {
    prisma.$transaction = originalTransaction;
    prisma.vAT_TU.count = originalCount;
    prisma.vAT_TU.findMany = originalFindMany;
  }
});

test("partService getPartById include thong tin nha cung cap", async () => {
  const originalFindUnique = prisma.vAT_TU.findUnique;
  let receivedArgs = null;

  prisma.vAT_TU.findUnique = async (args) => {
    receivedArgs = args;
    return {
      MaVatTu: 12,
      TenVatTu: "Loc gio dieu hoa",
      MaNCC: 6,
      NhaCungCap: {
        MaNCC: 6,
        TenNCC: "Cong ty A",
      },
    };
  };

  try {
    const result = await partService.getPartById(12);

    assert.deepEqual(receivedArgs.include, PART_INCLUDE_SUPPLIER);
    assert.equal(result.NhaCungCap.TenNCC, "Cong ty A");
  } finally {
    prisma.vAT_TU.findUnique = originalFindUnique;
  }
});
