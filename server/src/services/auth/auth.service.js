import crypto from "node:crypto";

import prisma from "../../db/prisma.js";
import { buildServiceError } from "../../shared/crud/crud.helpers.js";
import { signAccessToken } from "../../utils/auth/jwt.util.js";
import { sendResetPasswordEmail, sendWelcomeEmail } from "../../utils/auth/mail.util.js";
import { comparePassword, hashPassword } from "../../utils/auth/password.util.js";

const normalizeEmail = (email) => email.trim().toLowerCase();

const sanitizeCustomer = (customer) => {
  if (!customer) {
    return null;
  }

  const {
    MatKhau,
    TokenDatLaiMatKhau,
    TokenDatLaiMatKhauHetHanLuc,
    TokenDatLaiMatKhauDaDungLuc,
    ...safeCustomer
  } = customer;

  return safeCustomer;
};

const defaultHashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const defaultCreateResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");

  return {
    rawToken,
    hashedToken: defaultHashResetToken(rawToken),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  };
};

const getResetPasswordUrl = () =>
  process.env.RESET_PASSWORD_URL || `http://localhost:${process.env.APP_PORT_CLIENT || 5173}/reset-password`;

const ensureCustomerExists = (customer, message) => {
  if (!customer) {
    throw buildServiceError(400, message);
  }
};

const ensureActiveCustomer = (customer, message = "Tài khoản hiện không thể đăng nhập.") => {
  if (customer.TrangThai === "BiKhoa" || customer.TrangThai === "DaXoa") {
    throw buildServiceError(403, message);
  }
};

const createAuthService = ({
  customerDelegate = prisma.kHACH_HANG,
  hashPassword: hashPasswordFn = hashPassword,
  comparePassword: comparePasswordFn = comparePassword,
  signAccessToken: signAccessTokenFn = signAccessToken,
  createResetToken = defaultCreateResetToken,
  hashResetToken = defaultHashResetToken,
  sendResetPasswordEmail: sendResetPasswordEmailFn = sendResetPasswordEmail,
  sendWelcomeEmail: sendWelcomeEmailFn = sendWelcomeEmail,
  resetPasswordUrl,
  getResetPasswordUrl: getResetPasswordUrlFn = getResetPasswordUrl,
  reportMailFailure = console.error,
  now = () => new Date(),
} = {}) => {
  const register = async ({ Email, MatKhau, TenChuXe, DienThoai, DiaChi }) => {
    const normalizedEmail = normalizeEmail(Email);
    const existingCustomer = await customerDelegate.findUnique({
      where: { Email: normalizedEmail },
    });

    if (existingCustomer) {
      throw buildServiceError(409, "Email đã tồn tại.");
    }

    const existingCustomerByPhone = await customerDelegate.findUnique({
      where: { DienThoai },
    });

    if (existingCustomerByPhone) {
      throw buildServiceError(409, "Số điện thoại đã tồn tại.");
    }

    const createdCustomer = await customerDelegate.create({
      data: {
        Email: normalizedEmail,
        MatKhau: await hashPasswordFn(MatKhau),
        TenChuXe,
        DienThoai,
        DiaChi,
        ChucVu: "KhachHang",
        TrangThai: "HoatDong",
      },
    });

    try {
      await sendWelcomeEmailFn({
        to: createdCustomer.Email,
        customerName: createdCustomer.TenChuXe,
      });
    } catch (error) {
      reportMailFailure("WELCOME_EMAIL_FAILED", error);
    }

    return {
      customer: sanitizeCustomer(createdCustomer),
    };
  };

  const login = async ({ Email, MatKhau }) => {
    const customer = await customerDelegate.findUnique({
      where: { Email: normalizeEmail(Email) },
    });

    ensureCustomerExists(customer, "Email hoặc mật khẩu không đúng.");
    ensureActiveCustomer(customer);

    if (!customer.MatKhau) {
      throw buildServiceError(400, "Email hoặc mật khẩu không đúng.");
    }

    const isValidPassword = await comparePasswordFn(MatKhau, customer.MatKhau);

    if (!isValidPassword) {
      throw buildServiceError(400, "Email hoặc mật khẩu không đúng.");
    }

    return {
      accessToken: signAccessTokenFn({ MaKH: customer.MaKH, ChucVu: customer.ChucVu }),
      user: sanitizeCustomer(customer),
    };
  };

  const forgotPassword = async ({ Email }) => {
    const customer = await customerDelegate.findUnique({
      where: { Email: normalizeEmail(Email) },
    });

    if (customer && customer.TrangThai === "HoatDong") {
      const resolvedResetPasswordUrl = resetPasswordUrl ?? getResetPasswordUrlFn();
      const { rawToken, hashedToken, expiresAt } = createResetToken();

      await customerDelegate.update({
        where: { MaKH: customer.MaKH },
        data: {
          TokenDatLaiMatKhau: hashedToken,
          TokenDatLaiMatKhauHetHanLuc: expiresAt,
          TokenDatLaiMatKhauDaDungLuc: null,
        },
      });

      await sendResetPasswordEmailFn({
        to: customer.Email,
        customerName: customer.TenChuXe,
        resetUrl: `${resolvedResetPasswordUrl}?token=${encodeURIComponent(rawToken)}`,
      });
    }

    return {
      message: "Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.",
    };
  };

  const resetPassword = async ({ Token, MatKhauMoi }) => {
    const customer = await customerDelegate.findFirst({
      where: {
        TokenDatLaiMatKhau: hashResetToken(Token),
        TokenDatLaiMatKhauDaDungLuc: null,
      },
    });

    ensureCustomerExists(customer, "Token đặt lại mật khẩu không hợp lệ.");
    ensureActiveCustomer(customer, "Tài khoản hiện không thể đặt lại mật khẩu.");

    if (!customer.TokenDatLaiMatKhauHetHanLuc || customer.TokenDatLaiMatKhauHetHanLuc <= now()) {
      throw buildServiceError(400, "Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.");
    }

    const isReusedPassword = await comparePasswordFn(MatKhauMoi, customer.MatKhau);

    if (isReusedPassword) {
      throw buildServiceError(400, "Mật khẩu mới không được trùng mật khẩu hiện tại.");
    }

    const newHashedPassword = await hashPasswordFn(MatKhauMoi);

    await customerDelegate.update({
      where: { MaKH: customer.MaKH },
      data: {
        MatKhau: newHashedPassword,
        TokenDatLaiMatKhau: null,
        TokenDatLaiMatKhauHetHanLuc: null,
        TokenDatLaiMatKhauDaDungLuc: now(),
      },
    });

    return {
      message: "Đặt lại mật khẩu thành công.",
    };
  };

  const changePassword = async (customerId, { MatKhauHienTai, MatKhauMoi }) => {
    const customer = await customerDelegate.findUnique({
      where: { MaKH: Number(customerId) },
    });

    ensureCustomerExists(customer, "Bạn chưa đăng nhập hoặc phiên đăng nhập không hợp lệ.");
    ensureActiveCustomer(customer);

    if (!customer.MatKhau) {
      throw buildServiceError(400, "Tài khoản hiện chưa có mật khẩu để đổi.");
    }

    const isCurrentPasswordValid = await comparePasswordFn(MatKhauHienTai, customer.MatKhau);

    if (!isCurrentPasswordValid) {
      throw buildServiceError(400, "Mật khẩu hiện tại không đúng.");
    }

    const isReusedPassword = await comparePasswordFn(MatKhauMoi, customer.MatKhau);

    if (isReusedPassword) {
      throw buildServiceError(400, "Mật khẩu mới không được trùng mật khẩu hiện tại.");
    }

    const newHashedPassword = await hashPasswordFn(MatKhauMoi);

    await customerDelegate.update({
      where: { MaKH: customer.MaKH },
      data: {
        MatKhau: newHashedPassword,
        TokenDatLaiMatKhau: null,
        TokenDatLaiMatKhauHetHanLuc: null,
        TokenDatLaiMatKhauDaDungLuc: null,
      },
    });

    return {
      message: "Đổi mật khẩu thành công.",
    };
  };

  return {
    register,
    login,
    forgotPassword,
    resetPassword,
    changePassword,
  };
};

const authService = createAuthService();

export { createAuthService };
export default authService;
