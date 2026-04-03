import test from "node:test";
import assert from "node:assert/strict";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

const loadCreateRepairOrderDetailService = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/services/management/repairOrderDetail.service.js");
  return module.default;
};

const loadPrisma = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/db/prisma.js");
  return module.default;
};

const cloneValue = (value) => structuredClone(value);

const createRepairOrderDetailDbStub = (initialRepairOrders = [], initialDetails = []) => {
  const state = {
    repairOrders: cloneValue(initialRepairOrders),
    repairOrderDetails: cloneValue(initialDetails),
    aggregateCalls: [],
    updateCalls: [],
    syncCalls: [],
  };

  const tx = {
    vAT_TU: {
      updateMany: async () => ({ count: 1 }),
      findUnique: async () => null,
    },
    cT_PHIEU_SUA_CHUA: {
      findUnique: async ({ where }) => {
        const found = state.repairOrderDetails.find(
          (item) => Number(item.MaCTSC) === Number(where.MaCTSC),
        );

        return cloneValue(found ?? null);
      },
      update: async ({ where, data }) => {
        state.updateCalls.push(cloneValue({ where, data }));
        const index = state.repairOrderDetails.findIndex(
          (item) => Number(item.MaCTSC) === Number(where.MaCTSC),
        );

        if (index < 0) {
          throw new Error("repair detail not found in stub");
        }

        const updated = {
          ...state.repairOrderDetails[index],
          ...cloneValue(data),
        };
        state.repairOrderDetails[index] = updated;

        return cloneValue(updated);
      },
      aggregate: async ({ where }) => {
        state.aggregateCalls.push(cloneValue(where));
        const total = state.repairOrderDetails
          .filter((item) => Number(item.MaPhieuSC) === Number(where.MaPhieuSC))
          .reduce((sum, item) => sum + Number(item.ThanhTien ?? 0), 0);

        return { _sum: { ThanhTien: total } };
      },
      delete: async () => {
        throw new Error("not used");
      },
    },
    pHIEU_SUA_CHUA: {
      findUnique: async ({ where }) => {
        const found = state.repairOrders.find(
          (item) => Number(item.MaPhieuSC) === Number(where.MaPhieuSC),
        );

        return cloneValue(found ?? null);
      },
      update: async ({ where, data }) => {
        state.updateCalls.push(cloneValue({ where, data }));
        const index = state.repairOrders.findIndex(
          (item) => Number(item.MaPhieuSC) === Number(where.MaPhieuSC),
        );

        if (index < 0) {
          throw new Error("repair order not found in stub");
        }

        const updated = {
          ...state.repairOrders[index],
          ...cloneValue(data),
        };
        state.repairOrders[index] = updated;

        return cloneValue(updated);
      },
      aggregate: async () => ({ _sum: { TongTien: 0 } }),
    },
    pHIEU_THU_TIEN: {
      aggregate: async () => ({ _sum: { SoTienThu: 0 } }),
    },
    xE: {
      update: async () => ({}),
    },
  };

  return {
    state,
    tx,
    db: {
      $transaction: async (callback) => callback(tx),
    },
  };
};

test("repair order detail update sync parent total for both old and new repair orders", async () => {
  const repairOrderDetailService = await loadCreateRepairOrderDetailService();
  const prisma = await loadPrisma();
  const fixture = createRepairOrderDetailDbStub(
    [
      { MaPhieuSC: 1, TongTien: 100000 },
      { MaPhieuSC: 2, TongTien: 50000 },
    ],
    [
      {
        MaCTSC: 11,
        MaPhieuSC: 1,
        MaVatTu: 10,
        MaTienCong: 20,
        SoLuong: 1,
        DonGiaVatTu: 50000,
        DonGiaTienCong: 20000,
        ThanhTien: 70000,
      },
    ],
  );

  const originalTransaction = prisma.$transaction;
  prisma.$transaction = async (callback) => callback(fixture.tx);

  try {
    const updated = await repairOrderDetailService.updateRepairOrderDetail(11, {
      MaPhieuSC: 2,
      SoLuong: 2,
      DonGiaVatTu: 60000,
      DonGiaTienCong: 30000,
    });

    assert.equal(updated.repairOrderDetail.MaPhieuSC, 2);
    assert.equal(updated.repairOrder.TongTien, 150000);
    assert.deepEqual(fixture.state.aggregateCalls, [{ MaPhieuSC: 1 }, { MaPhieuSC: 2 }]);
    assert.deepEqual(
      fixture.state.updateCalls.map((call) => call.where.MaPhieuSC ?? call.where.MaCTSC),
      [11, 1, 2],
    );
  } finally {
    prisma.$transaction = originalTransaction;
  }
});
