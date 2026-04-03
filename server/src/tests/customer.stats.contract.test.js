import test from "node:test";
import assert from "node:assert/strict";

const loadCreateCustomerService = async () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
  const module = await import("../services/management/customer.service.js");
  return module.createCustomerService;
};

test("getCustomerStats returns the customer stats contract", async () => {
  const createCustomerService = await loadCreateCustomerService();
  const now = new Date("2026-03-15T00:00:00.000Z");
  const calls = {};

  const service = createCustomerService({
    nowProvider: () => now,
    customerDelegate: {
      count: async ({ where }) => {
        calls.customerCountWhere = where;
        return 3;
      },
      findMany: async ({ where, select }) => {
        calls.customerFindManyWhere = where;
        calls.customerFindManySelect = select;

        return [
          {
            Xe: [
              {
                PhieuSuaChua: [
                  { TongTien: 40000000 },
                  { TongTien: 20000000 },
                ],
              },
            ],
          },
          {
            Xe: [
              {
                PhieuSuaChua: [
                  { TongTien: 15000000 },
                ],
              },
            ],
          },
          {
            Xe: [],
          },
        ];
      },
    },
    prismaClient: {
      xE: {
        aggregate: async ({ where }) => {
          calls.outstandingDebtWhere = where;
          return { _sum: { TienNoHienTai: 12500000 } };
        },
      },
      pHIEU_SUA_CHUA: {
        count: async ({ where }) => {
          calls.repairOrderCountWhere = where;
          return 9;
        },
      },
    },
  });

  const stats = await service.getCustomerStats();

  assert.deepEqual(stats, {
    totalCustomers: 3,
    vipCustomers: 1,
    totalOutstandingDebt: 12500000,
    monthlyRepairOrders: 9,
  });
  assert.equal(calls.customerCountWhere.ChucVu, "KhachHang");
  assert.equal(calls.customerCountWhere.TrangThai.not, "DaXoa");
  assert.equal(calls.outstandingDebtWhere.TienNoHienTai.gt, 0);
  assert.equal(calls.repairOrderCountWhere.NgaySC.gte.toISOString(), "2026-02-28T17:00:00.000Z");
  assert.equal(calls.repairOrderCountWhere.NgaySC.lt.toISOString(), "2026-03-31T17:00:00.000Z");
});
