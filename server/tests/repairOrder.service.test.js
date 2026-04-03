import test from "node:test";
import assert from "node:assert/strict";

import repairOrderSchema from "../src/validator/management/repairOrder.validator.js";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

const loadCreateRepairOrderService = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../src/services/management/repairOrder.service.js");
  return module.createRepairOrderService;
};

const cloneValue = (value) => structuredClone(value);

const createRepairOrderDbStub = (initialRepairOrders = []) => {
  const state = {
    repairOrders: cloneValue(initialRepairOrders),
    createCalls: [],
    updateCalls: [],
    syncCalls: [],
    transactionOptions: [],
  };

  const tx = {
    pHIEU_SUA_CHUA: {
      create: async ({ data }) => {
        state.createCalls.push(cloneValue(data));
        const nextId =
          state.repairOrders.reduce(
            (maxId, item) => Math.max(maxId, Number(item.MaPhieuSC ?? 0)),
            0,
          ) + 1;
        const created = {
          MaPhieuSC: nextId,
          ...cloneValue(data),
        };

        state.repairOrders.push(created);
        return cloneValue(created);
      },
      findUnique: async ({ where }) => {
        const found = state.repairOrders.find(
          (item) => Number(item.MaPhieuSC) === Number(where.MaPhieuSC),
        );

        return cloneValue(found ?? null);
      },
      update: async ({ where, data }) => {
        state.updateCalls.push(cloneValue(data));
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
      delete: async ({ where }) => {
        const index = state.repairOrders.findIndex(
          (item) => Number(item.MaPhieuSC) === Number(where.MaPhieuSC),
        );

        if (index < 0) {
          throw new Error("repair order not found in stub");
        }

        const [deleted] = state.repairOrders.splice(index, 1);
        return cloneValue(deleted);
      },
    },
  };

  return {
    state,
    db: {
      $transaction: async (callback, options) => {
        state.transactionOptions.push(options);
        return callback(tx);
      },
    },
  };
};

test("repair order service create tu dong set NgayKetThuc cho TrangThai ket thuc", async () => {
  const createRepairOrderService = await loadCreateRepairOrderService();
  const now = new Date("2026-03-29T10:00:00.000Z");
  const fixture = createRepairOrderDbStub();

  const service = createRepairOrderService({
    db: fixture.db,
    now: () => now,
    businessHelpers: {
      syncVehicleDebt: async (_tx, maXe) => {
        fixture.state.syncCalls.push(Number(maXe));
      },
    },
  });

  const cancelledOrder = await service.createRepairOrder({
    MaXe: 10,
    MaNV: 3,
    NgaySC: new Date("2026-03-28"),
    TrangThai: "Huy",
    NoiDungLoi: "Khach doi lich",
    GhiChu: "Huy tai quay",
    TongTien: 0,
  });
  const completedOrder = await service.createRepairOrder({
    MaXe: 11,
    MaNV: 4,
    NgaySC: new Date("2026-03-28"),
    TrangThai: "HoanTat",
    NoiDungLoi: "Da sua xong",
    GhiChu: "Ban giao xe",
    TongTien: 100000,
  });

  assert.equal(cancelledOrder.NgayKetThuc.toISOString(), now.toISOString());
  assert.equal(completedOrder.NgayKetThuc.toISOString(), now.toISOString());
  assert.equal(fixture.state.createCalls[0].NgayKetThuc.toISOString(), now.toISOString());
  assert.equal(fixture.state.createCalls[1].NgayKetThuc.toISOString(), now.toISOString());
});

test("repair order service update set NgayKetThuc khi chuyen sang TrangThai ket thuc", async () => {
  const createRepairOrderService = await loadCreateRepairOrderService();
  const now = new Date("2026-03-29T11:00:00.000Z");
  const fixture = createRepairOrderDbStub([
    {
      MaPhieuSC: 1,
      MaXe: 10,
      MaNV: 2,
      NgaySC: new Date("2026-03-25"),
      TrangThai: "DangSua",
      NoiDungLoi: "May nong",
      GhiChu: null,
      TongTien: 200000,
      NgayKetThuc: null,
    },
  ]);

  const service = createRepairOrderService({
    db: fixture.db,
    now: () => now,
    businessHelpers: {
      syncVehicleDebt: async () => {},
    },
  });

  const updated = await service.updateRepairOrder(1, {
    TrangThai: "Huy",
  });

  assert.equal(updated.TrangThai, "Huy");
  assert.equal(updated.NgayKetThuc.toISOString(), now.toISOString());
  assert.equal(fixture.state.updateCalls[0].NgayKetThuc.toISOString(), now.toISOString());
});

test("repair order service update khong overwrite NgayKetThuc khi phieu da ket thuc va chi sua field khac", async () => {
  const createRepairOrderService = await loadCreateRepairOrderService();
  const now = new Date("2026-03-29T12:00:00.000Z");
  const endedAt = new Date("2026-03-28T09:00:00.000Z");
  const fixture = createRepairOrderDbStub([
    {
      MaPhieuSC: 2,
      MaXe: 20,
      MaNV: 5,
      NgaySC: new Date("2026-03-20"),
      TrangThai: "HoanTat",
      NoiDungLoi: "Da sua xong",
      GhiChu: "Ban dau",
      TongTien: 250000,
      NgayKetThuc: endedAt,
    },
  ]);

  const service = createRepairOrderService({
    db: fixture.db,
    now: () => now,
    businessHelpers: {
      syncVehicleDebt: async () => {},
    },
  });

  const updated = await service.updateRepairOrder(2, {
    GhiChu: "Cap nhat ghi chu",
  });

  assert.equal(updated.GhiChu, "Cap nhat ghi chu");
  assert.equal(updated.NgayKetThuc.toISOString(), endedAt.toISOString());
  assert.equal(Object.hasOwn(fixture.state.updateCalls[0], "NgayKetThuc"), false);
});

test("repair order service update clear NgayKetThuc khi chuyen ve TrangThai chua ket thuc", async () => {
  const createRepairOrderService = await loadCreateRepairOrderService();
  const fixture = createRepairOrderDbStub([
    {
      MaPhieuSC: 3,
      MaXe: 30,
      MaNV: 6,
      NgaySC: new Date("2026-03-15"),
      TrangThai: "Huy",
      NoiDungLoi: "Khach doi lich",
      GhiChu: "Da huy",
      TongTien: 0,
      NgayKetThuc: new Date("2026-03-16T08:30:00.000Z"),
    },
    {
      MaPhieuSC: 4,
      MaXe: 31,
      MaNV: 7,
      NgaySC: new Date("2026-03-15"),
      TrangThai: "HoanTat",
      NoiDungLoi: "Da sua",
      GhiChu: "Da xong",
      TongTien: 300000,
      NgayKetThuc: new Date("2026-03-16T09:30:00.000Z"),
    },
  ]);

  const service = createRepairOrderService({
    db: fixture.db,
    now: () => new Date("2026-03-29T12:30:00.000Z"),
    businessHelpers: {
      syncVehicleDebt: async () => {},
    },
  });

  const reopenedToDangSua = await service.updateRepairOrder(3, {
    TrangThai: "DangSua",
  });
  const reopenedToTiepNhan = await service.updateRepairOrder(4, {
    TrangThai: "TiepNhan",
  });

  assert.equal(reopenedToDangSua.NgayKetThuc, null);
  assert.equal(reopenedToTiepNhan.NgayKetThuc, null);
  assert.equal(fixture.state.updateCalls[0].NgayKetThuc, null);
  assert.equal(fixture.state.updateCalls[1].NgayKetThuc, null);
});

test("repair order update qua validator khong reset TongTien khi payload khong gui TongTien", async () => {
  const createRepairOrderService = await loadCreateRepairOrderService();
  const fixture = createRepairOrderDbStub([
    {
      MaPhieuSC: 5,
      MaXe: 32,
      MaNV: 8,
      NgaySC: new Date("2026-03-15"),
      TrangThai: "DangSua",
      NoiDungLoi: "Keu la",
      GhiChu: "Cu",
      TongTien: 450000,
      NgayKetThuc: null,
    },
  ]);

  const service = createRepairOrderService({
    db: fixture.db,
    now: () => new Date("2026-03-29T13:00:00.000Z"),
    businessHelpers: {
      syncVehicleDebt: async () => {},
    },
  });

  const { error, value: validatedPayload } = repairOrderSchema.update.body.validate({
    GhiChu: "Moi",
  });

  assert.equal(error, undefined);

  const updated = await service.updateRepairOrder(5, validatedPayload);

  assert.equal(updated.GhiChu, "Moi");
  assert.equal(updated.TongTien, 450000);
  assert.equal(Object.hasOwn(fixture.state.updateCalls[0], "TongTien"), false);
});

test("repair order list search duoc xe va khach hang", async () => {
  const createRepairOrderService = await loadCreateRepairOrderService();
  let receivedWhere = null;

  const service = createRepairOrderService({
    db: {
      pHIEU_SUA_CHUA: {
        count: async ({ where }) => {
          receivedWhere ??= where;
          return 1;
        },
        findMany: async ({ where }) => {
          receivedWhere ??= where;
          return [];
        },
      },
    },
  });

  await service.getRepairOrderList({
    search: "0909000001",
  });

  assert.deepEqual(receivedWhere, {
    OR: [
      {
        NoiDungLoi: {
          contains: "0909000001",
        },
      },
      {
        GhiChu: {
          contains: "0909000001",
        },
      },
      {
        Xe: {
          BienSo: {
            contains: "0909000001",
          },
        },
      },
      {
        Xe: {
          MauXe: {
            contains: "0909000001",
          },
        },
      },
      {
        Xe: {
          HieuXe: {
            TenHieuXe: {
              contains: "0909000001",
            },
          },
        },
      },
      {
        Xe: {
          KhachHang: {
            TenChuXe: {
              contains: "0909000001",
            },
          },
        },
      },
      {
        Xe: {
          KhachHang: {
            DienThoai: {
              contains: "0909000001",
            },
          },
        },
      },
    ],
  });
});
