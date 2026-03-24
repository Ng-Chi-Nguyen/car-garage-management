import test from "node:test";
import assert from "node:assert/strict";

const loadCreateCustomerService = async () => {
  const module = await import("../src/services/management/customer.service.js");
  return module.createCustomerService;
};

const createCustomerDelegate = (initialCustomer = null, options = {}) => {
  let customer = initialCustomer ? { ...initialCustomer } : null;
  let createdId = initialCustomer?.MaKH ?? 1;
  let shouldFailAvatarUpdate = options.failAvatarUpdate ?? false;

  return {
    async create({ data }) {
      customer = {
        MaKH: ++createdId,
        NgayTao: new Date("2026-03-24T00:00:00.000Z"),
        NgayCapNhat: new Date("2026-03-24T00:00:00.000Z"),
        Avatar: null,
        ...data,
      };

      return { ...customer };
    },
    async update({ where, data }) {
      if (!customer || customer.MaKH !== Number(where.MaKH)) {
        const error = new Error("Không tìm thấy khách hàng.");
        error.code = "P2025";
        throw error;
      }

      if (shouldFailAvatarUpdate && data.Avatar) {
        shouldFailAvatarUpdate = false;
        throw new Error("DB update failed");
      }

      customer = {
        ...customer,
        ...data,
        NgayCapNhat: new Date("2026-03-24T00:10:00.000Z"),
      };

      return { ...customer };
    },
    async delete({ where }) {
      if (!customer || customer.MaKH !== Number(where.MaKH)) {
        const error = new Error("Không tìm thấy khách hàng.");
        error.code = "P2025";
        throw error;
      }

      const deleted = { ...customer };
      customer = null;
      return deleted;
    },
    async findUnique({ where }) {
      if (!customer) {
        return null;
      }

      if (where.MaKH !== undefined) {
        return customer.MaKH === Number(where.MaKH) ? { ...customer } : null;
      }

      if (where.Email !== undefined) {
        return customer.Email === where.Email ? { ...customer } : null;
      }

      if (where.DienThoai !== undefined) {
        return customer.DienThoai === where.DienThoai ? { ...customer } : null;
      }

      return null;
    },
    async count() {
      return customer ? 1 : 0;
    },
    async findMany() {
      return customer ? [{ ...customer }] : [];
    },
    getCurrentCustomer() {
      return customer ? { ...customer } : null;
    },
  };
};

const createDependencies = (customerDelegate, overrides = {}) => {
  const uploaded = [];
  const removed = [];

  return {
    customerDelegate,
    vehicleDelegate: {
      count: async () => 0,
    },
    uploadPublicImage: async (payload) => {
      uploaded.push(payload);
      return `https://cdn.example.com/${payload.bucket}/${payload.path}`;
    },
    removeObject: async (payload) => {
      removed.push(payload);
    },
    processAvatarImage: async (file) => ({
      buffer: file.buffer,
      contentType: "image/webp",
    }),
    getUploadedCalls: () => uploaded,
    getRemovedCalls: () => removed,
    ...overrides,
  };
};

test("customer create upload avatar và lưu URL Supabase", async () => {
  const createCustomerService = await loadCreateCustomerService();
  const customerDelegate = createCustomerDelegate();
  const dependencies = createDependencies(customerDelegate);
  const customerService = createCustomerService(dependencies);

  const result = await customerService.createCustomer(
    {
      Email: "customer@example.com",
      TenChuXe: "Nguyen Van A",
      DienThoai: "0901234567",
      DiaChi: "TP HCM",
    },
    {
      buffer: Buffer.from("avatar"),
      mimetype: "image/png",
    },
  );

  assert.equal(result.Avatar, "https://cdn.example.com/avatars/customers/2/avatar.webp");
  assert.equal(dependencies.getUploadedCalls()[0].bucket, "avatars");
  assert.equal(dependencies.getUploadedCalls()[0].path, "customers/2/avatar.webp");
});

test("customer create rollback record và xóa object nếu update Avatar thất bại", async () => {
  const createCustomerService = await loadCreateCustomerService();
  const customerDelegate = createCustomerDelegate(null, { failAvatarUpdate: true });
  const dependencies = createDependencies(customerDelegate);
  const customerService = createCustomerService(dependencies);

  await assert.rejects(
    () =>
      customerService.createCustomer(
        {
          Email: "customer@example.com",
          TenChuXe: "Nguyen Van A",
          DienThoai: "0901234567",
          DiaChi: "TP HCM",
        },
        {
          buffer: Buffer.from("avatar"),
          mimetype: "image/png",
        },
      ),
  );

  assert.equal(customerDelegate.getCurrentCustomer(), null);
  assert.deepEqual(dependencies.getRemovedCalls()[0], {
    bucket: "avatars",
    path: "customers/2/avatar.webp",
  });
});

test("customer delete xóa file avatar theo URL đã lưu", async () => {
  const createCustomerService = await loadCreateCustomerService();
  const customerDelegate = createCustomerDelegate({
    MaKH: 9,
    Email: "customer@example.com",
    TenChuXe: "Nguyen Van A",
    DienThoai: "0901234567",
    DiaChi: "TP HCM",
    ChucVu: "KhachHang",
    TrangThai: "HoatDong",
    Avatar: "https://rudzqbtdrduwbtftiqmv.supabase.co/storage/v1/object/public/legacy-avatars/customers/9/avatar.webp",
  });
  const dependencies = createDependencies(customerDelegate);
  const customerService = createCustomerService(dependencies);

  await customerService.deleteCustomer(9);

  assert.deepEqual(dependencies.getRemovedCalls()[0], {
    bucket: "legacy-avatars",
    path: "customers/9/avatar.webp",
  });
});

test("customer delete không xóa file khi còn xe liên quan", async () => {
  const createCustomerService = await loadCreateCustomerService();
  const customerDelegate = createCustomerDelegate({
    MaKH: 10,
    Email: "customer@example.com",
    TenChuXe: "Nguyen Van A",
    DienThoai: "0901234567",
    DiaChi: "TP HCM",
    ChucVu: "KhachHang",
    TrangThai: "HoatDong",
    Avatar: "https://rudzqbtdrduwbtftiqmv.supabase.co/storage/v1/object/public/avatars/customers/10/avatar.webp",
  });
  const dependencies = createDependencies(customerDelegate, {
    vehicleDelegate: {
      count: async () => 1,
    },
  });
  const customerService = createCustomerService(dependencies);

  await assert.rejects(() => customerService.deleteCustomer(10), (error) => error.status === 409);
  assert.equal(dependencies.getRemovedCalls().length, 0);
});
