import test from "node:test";
import assert from "node:assert/strict";

const loadCreateAuthService = async () => {
  const module = await import("../src/services/auth/auth.service.js");
  return module.createAuthService;
};

const createCustomerDelegate = (initialCustomer = null) => {
  let customer = initialCustomer ? { ...initialCustomer } : null;

  return {
    async findUnique({ where }) {
      if (!customer) {
        return null;
      }

      if (where.MaKH !== undefined) {
        return customer.MaKH === where.MaKH ? { ...customer } : null;
      }

      if (where.Email !== undefined) {
        return customer.Email === where.Email ? { ...customer } : null;
      }

      if (where.DienThoai !== undefined) {
        return customer.DienThoai === where.DienThoai ? { ...customer } : null;
      }

      return null;
    },
    async findFirst({ where }) {
      if (!customer) {
        return null;
      }

      return customer.TokenDatLaiMatKhau === where.TokenDatLaiMatKhau &&
        customer.TokenDatLaiMatKhauDaDungLuc === where.TokenDatLaiMatKhauDaDungLuc
        ? { ...customer }
        : null;
    },
    async create({ data }) {
      customer = {
        MaKH: 1,
        ChucVu: "KhachHang",
        TrangThai: "HoatDong",
        Avatar: null,
        ...data,
      };

      return { ...customer };
    },
    async update({ data }) {
      customer = {
        ...customer,
        ...data,
      };

      return { ...customer };
    },
    getCurrentCustomer() {
      return customer ? { ...customer } : null;
    },
  };
};

const createDependencies = (customerDelegate, overrides = {}) => {
  const sentEmails = [];

  return {
    customerDelegate,
    hashPassword: async (value) => `hashed::${value}`,
    comparePassword: async (rawValue, hashedValue) => hashedValue === `hashed::${rawValue}`,
    signAccessToken: ({ MaKH, ChucVu }) => `token::${MaKH}::${ChucVu}`,
    createResetToken: () => ({
      rawToken: "raw-reset-token",
      hashedToken: "hashed-reset-token",
      expiresAt: new Date("2026-03-24T00:00:00.000Z"),
    }),
    hashResetToken: (value) => `hashed::${value}`,
    sendResetPasswordEmail: async (payload) => {
      sentEmails.push(payload);
    },
    getSentEmails: () => sentEmails,
    resetPasswordUrl: "http://localhost:5173/reset-password",
    now: () => new Date("2026-03-23T00:00:00.000Z"),
    ...overrides,
  };
};

test("register tạo khách hàng mới với mật khẩu đã hash và không lộ dữ liệu nhạy cảm", async () => {
  const createAuthService = await loadCreateAuthService();
  const customerDelegate = createCustomerDelegate();
  const dependencies = createDependencies(customerDelegate);
  const authService = createAuthService(dependencies);

  const result = await authService.register({
    Email: "KhachHang@Example.com",
    MatKhau: "Password123!",
    TenChuXe: "Nguyen Van A",
    DienThoai: "0901234567",
    DiaChi: "TP HCM",
  });

  const savedCustomer = customerDelegate.getCurrentCustomer();

  assert.equal(savedCustomer.Email, "khachhang@example.com");
  assert.equal(savedCustomer.MatKhau, "hashed::Password123!");
  assert.equal(result.customer.MatKhau, undefined);
  assert.equal(result.customer.TokenDatLaiMatKhau, undefined);
});

test("register từ chối email đã tồn tại", async () => {
  const createAuthService = await loadCreateAuthService();
  const customerDelegate = createCustomerDelegate({
    MaKH: 9,
    Email: "khachhang@example.com",
    MatKhau: "hashed::Password123!",
    TenChuXe: "Cu",
    DienThoai: "0900000000",
    DiaChi: "HCM",
    ChucVu: "KhachHang",
    TrangThai: "HoatDong",
  });
  const authService = createAuthService(createDependencies(customerDelegate));

  await assert.rejects(
    () =>
      authService.register({
        Email: "khachhang@example.com",
        MatKhau: "Password123!",
        TenChuXe: "Moi",
        DienThoai: "0901234567",
        DiaChi: "TP HCM",
      }),
    (error) => error.status === 409,
  );
});

test("register từ chối số điện thoại đã tồn tại", async () => {
  const createAuthService = await loadCreateAuthService();
  const customerDelegate = createCustomerDelegate({
    MaKH: 10,
    Email: "old@example.com",
    MatKhau: "hashed::Password123!",
    TenChuXe: "Cu",
    DienThoai: "0901234567",
    DiaChi: "HCM",
    ChucVu: "KhachHang",
    TrangThai: "HoatDong",
  });
  const authService = createAuthService(createDependencies(customerDelegate));

  await assert.rejects(
    () =>
      authService.register({
        Email: "new@example.com",
        MatKhau: "Password123!",
        TenChuXe: "Moi",
        DienThoai: "0901234567",
        DiaChi: "TP HCM",
      }),
    (error) => error.status === 409,
  );
});

test("login trả access token và user đã sanitize", async () => {
  const createAuthService = await loadCreateAuthService();
  const customerDelegate = createCustomerDelegate({
    MaKH: 5,
    Email: "khachhang@example.com",
    MatKhau: "hashed::Password123!",
    TenChuXe: "Nguyen Van A",
    DienThoai: "0901234567",
    DiaChi: "TP HCM",
    ChucVu: "KhachHang",
    TrangThai: "HoatDong",
    TokenDatLaiMatKhau: "hashed-reset-token",
  });
  const authService = createAuthService(createDependencies(customerDelegate));

  const result = await authService.login({
    Email: "khachhang@example.com",
    MatKhau: "Password123!",
  });

  assert.equal(result.accessToken, "token::5::KhachHang");
  assert.equal(result.user.MaKH, 5);
  assert.equal(result.user.MatKhau, undefined);
  assert.equal(result.user.ResetPasswordToken, undefined);
});

test("login từ chối tài khoản chưa có mật khẩu thay vì throw 500", async () => {
  const createAuthService = await loadCreateAuthService();
  const customerDelegate = createCustomerDelegate({
    MaKH: 6,
    Email: "khachhang@example.com",
    MatKhau: null,
    TenChuXe: "Nguyen Van A",
    DienThoai: "0901234567",
    DiaChi: "TP HCM",
    ChucVu: "KhachHang",
    TrangThai: "HoatDong",
  });
  const authService = createAuthService(createDependencies(customerDelegate));

  await assert.rejects(
    () =>
      authService.login({
        Email: "khachhang@example.com",
        MatKhau: "Password123!",
      }),
    (error) => error.status === 400 && /Email hoặc mật khẩu không đúng/i.test(error.message),
  );
});

test("forgotPassword tạo reset token đã hash và gửi email", async () => {
  const createAuthService = await loadCreateAuthService();
  const customerDelegate = createCustomerDelegate({
    MaKH: 7,
    Email: "khachhang@example.com",
    MatKhau: "hashed::Password123!",
    TenChuXe: "Nguyen Van A",
    DienThoai: "0901234567",
    DiaChi: "TP HCM",
    ChucVu: "KhachHang",
    TrangThai: "HoatDong",
    TokenDatLaiMatKhau: null,
    TokenDatLaiMatKhauHetHanLuc: null,
    TokenDatLaiMatKhauDaDungLuc: null,
  });
  const dependencies = createDependencies(customerDelegate);
  const authService = createAuthService(dependencies);

  const result = await authService.forgotPassword({ Email: "khachhang@example.com" });
  const savedCustomer = customerDelegate.getCurrentCustomer();

  assert.equal(result.message.includes("Nếu email tồn tại"), true);
  assert.equal(savedCustomer.TokenDatLaiMatKhau, "hashed-reset-token");
  assert.equal(dependencies.getSentEmails().length, 1);
  assert.match(dependencies.getSentEmails()[0].resetUrl, /raw-reset-token/);
});

test("forgotPassword fallback về reset URL local khi thiếu RESET_PASSWORD_URL", async () => {
  const createAuthService = await loadCreateAuthService();
  const originalAppPortClient = process.env.APP_PORT_CLIENT;
  delete process.env.RESET_PASSWORD_URL;
  process.env.APP_PORT_CLIENT = "5173";

  const customerDelegate = createCustomerDelegate({
    MaKH: 8,
    Email: "khachhang@example.com",
    MatKhau: "hashed::Password123!",
    TenChuXe: "Nguyen Van A",
    DienThoai: "0901234567",
    DiaChi: "TP HCM",
    ChucVu: "KhachHang",
    TrangThai: "HoatDong",
    TokenDatLaiMatKhau: null,
    TokenDatLaiMatKhauHetHanLuc: null,
    TokenDatLaiMatKhauDaDungLuc: null,
  });
  const dependencies = createDependencies(customerDelegate, { resetPasswordUrl: undefined });
  const authService = createAuthService(dependencies);

  await authService.forgotPassword({ Email: "khachhang@example.com" });

  assert.equal(
    dependencies.getSentEmails()[0].resetUrl,
    "http://localhost:5173/reset-password?token=raw-reset-token",
  );

  process.env.APP_PORT_CLIENT = originalAppPortClient;
});

test("forgotPassword đọc RESET_PASSWORD_URL tại runtime thay vì đóng băng khi khởi tạo service", async () => {
  const createAuthService = await loadCreateAuthService();
  const originalResetPasswordUrl = process.env.RESET_PASSWORD_URL;
  process.env.RESET_PASSWORD_URL = "http://localhost:3000/reset-password";

  const customerDelegate = createCustomerDelegate({
    MaKH: 18,
    Email: "khachhang@example.com",
    MatKhau: "hashed::Password123!",
    TenChuXe: "Nguyen Van A",
    DienThoai: "0901234567",
    DiaChi: "TP HCM",
    ChucVu: "KhachHang",
    TrangThai: "HoatDong",
    TokenDatLaiMatKhau: null,
    TokenDatLaiMatKhauHetHanLuc: null,
    TokenDatLaiMatKhauDaDungLuc: null,
  });
  const dependencies = createDependencies(customerDelegate, { resetPasswordUrl: undefined });
  const authService = createAuthService(dependencies);

  process.env.RESET_PASSWORD_URL = "http://localhost:9999/reset-password";

  await authService.forgotPassword({ Email: "khachhang@example.com" });

  assert.equal(
    dependencies.getSentEmails()[0].resetUrl,
    "http://localhost:9999/reset-password?token=raw-reset-token",
  );

  process.env.RESET_PASSWORD_URL = originalResetPasswordUrl;
});

test("resetPassword cập nhật mật khẩu mới và vô hiệu hóa reset token", async () => {
  const createAuthService = await loadCreateAuthService();
  const customerDelegate = createCustomerDelegate({
    MaKH: 11,
    Email: "khachhang@example.com",
    MatKhau: "hashed::Password123!",
    TenChuXe: "Nguyen Van A",
    DienThoai: "0901234567",
    DiaChi: "TP HCM",
    ChucVu: "KhachHang",
    TrangThai: "HoatDong",
    TokenDatLaiMatKhau: "hashed::raw-reset-token",
    TokenDatLaiMatKhauHetHanLuc: new Date("2026-03-25T00:00:00.000Z"),
    TokenDatLaiMatKhauDaDungLuc: null,
  });
  const authService = createAuthService(createDependencies(customerDelegate));

  const result = await authService.resetPassword({
    Token: "raw-reset-token",
    MatKhauMoi: "Password456!",
  });
  const savedCustomer = customerDelegate.getCurrentCustomer();

  assert.equal(result.message.includes("Đặt lại mật khẩu thành công"), true);
  assert.equal(savedCustomer.MatKhau, "hashed::Password456!");
  assert.equal(savedCustomer.TokenDatLaiMatKhau, null);
  assert.ok(savedCustomer.TokenDatLaiMatKhauDaDungLuc instanceof Date);
});

test("resetPassword trả lỗi token không hợp lệ khi không tìm thấy customer theo token", async () => {
  const createAuthService = await loadCreateAuthService();
  const customerDelegate = createCustomerDelegate(null);
  const authService = createAuthService(createDependencies(customerDelegate));

  await assert.rejects(
    () =>
      authService.resetPassword({
        Token: "invalid-token",
        MatKhauMoi: "Password456!",
      }),
    (error) => error.status === 400 && /Token đặt lại mật khẩu không hợp lệ/i.test(error.message),
  );
});

test("changePassword từ chối mật khẩu hiện tại sai", async () => {
  const createAuthService = await loadCreateAuthService();
  const customerDelegate = createCustomerDelegate({
    MaKH: 12,
    Email: "khachhang@example.com",
    MatKhau: "hashed::Password123!",
    TenChuXe: "Nguyen Van A",
    DienThoai: "0901234567",
    DiaChi: "TP HCM",
    ChucVu: "KhachHang",
    TrangThai: "HoatDong",
    TokenDatLaiMatKhau: "hashed::old-reset-token",
    TokenDatLaiMatKhauHetHanLuc: new Date("2026-03-25T00:00:00.000Z"),
    TokenDatLaiMatKhauDaDungLuc: null,
  });
  const authService = createAuthService(createDependencies(customerDelegate));

  await assert.rejects(
    () =>
      authService.changePassword(12, {
        MatKhauHienTai: "SaiMatKhau",
        MatKhauMoi: "Password456!",
      }),
    (error) => error.status === 400,
  );
});

test("changePassword cập nhật mật khẩu và xóa reset token đang chờ", async () => {
  const createAuthService = await loadCreateAuthService();
  const customerDelegate = createCustomerDelegate({
    MaKH: 13,
    Email: "khachhang@example.com",
    MatKhau: "hashed::Password123!",
    TenChuXe: "Nguyen Van A",
    DienThoai: "0901234567",
    DiaChi: "TP HCM",
    ChucVu: "KhachHang",
    TrangThai: "HoatDong",
    TokenDatLaiMatKhau: "hashed::old-reset-token",
    TokenDatLaiMatKhauHetHanLuc: new Date("2026-03-25T00:00:00.000Z"),
    TokenDatLaiMatKhauDaDungLuc: null,
  });
  const authService = createAuthService(createDependencies(customerDelegate));

  const result = await authService.changePassword(13, {
    MatKhauHienTai: "Password123!",
    MatKhauMoi: "Password456!",
  });
  const savedCustomer = customerDelegate.getCurrentCustomer();

  assert.equal(result.message.includes("Đổi mật khẩu thành công"), true);
  assert.equal(savedCustomer.MatKhau, "hashed::Password456!");
  assert.equal(savedCustomer.TokenDatLaiMatKhau, null);
  assert.equal(savedCustomer.TokenDatLaiMatKhauHetHanLuc, null);
});
