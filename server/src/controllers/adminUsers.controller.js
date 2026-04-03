import adminUsersService from "../services/adminUsers/adminUsers.service.js";

const handleError = (res, error) =>
  res.status(error?.status || 500).json({ success: false, message: error?.message || "Đã xảy ra lỗi trong quá trình xử lý yêu cầu." });

const forbidden = (res) =>
  res.status(403).json({
    success: false,
    message: "Bạn không có quyền truy cập tài nguyên này.",
  });

const assertAdmin = (req) => req.user?.ChucVu === "Admin";

const adminUsersController = {
  getAdminUsers: async (req, res) => {
    try {
      const result = await adminUsersService.getAdminUsers(req.validatedQuery ?? req.query);
      return res.json({ success: true, message: "Lấy danh sách tài khoản thành công.", data: result });
    } catch (error) {
      return handleError(res, error);
    }
  },
  updateAdminUser: async (req, res) => {
    try {
      if (!assertAdmin(req)) {
        return forbidden(res);
      }

      const user = await adminUsersService.updateAdminUser(req.validatedParams?.id ?? req.params.id, req.body);
      return res.json({ success: true, message: "Cập nhật tài khoản thành công.", data: { user } });
    } catch (error) {
      return handleError(res, error);
    }
  },
  createAdminUser: async (req, res) => {
    try {
      if (!assertAdmin(req)) {
        return forbidden(res);
      }

      const user = await adminUsersService.createAdminUser(req.body);
      return res.status(201).json({ success: true, message: "Tạo tài khoản thành công.", data: { user } });
    } catch (error) {
      return handleError(res, error);
    }
  },
  resetAdminUserPassword: async (req, res) => {
    try {
      if (!assertAdmin(req)) {
        return forbidden(res);
      }

      const user = await adminUsersService.resetAdminUserPassword(req.validatedParams?.id ?? req.params.id, req.body);
      return res.json({ success: true, message: "Đặt lại mật khẩu thành công.", data: { user } });
    } catch (error) {
      return handleError(res, error);
    }
  },
};

export default adminUsersController;
