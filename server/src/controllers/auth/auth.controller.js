import authService from "../../services/auth/auth.service.js";

const handleAuthError = (res, error) =>
  res.status(error?.status || 500).json({
    success: false,
    message: error?.message || "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.",
  });

const createAuthController = (service = authService) => ({
  register: async (req, res) => {
    try {
      const result = await service.register(req.body);

      return res.status(201).json({
        success: true,
        message: "Đăng ký tài khoản thành công.",
        data: result,
      });
    } catch (error) {
      return handleAuthError(res, error);
    }
  },
  login: async (req, res) => {
    try {
      const result = await service.login(req.body);

      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công.",
        data: result,
      });
    } catch (error) {
      return handleAuthError(res, error);
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const result = await service.forgotPassword(req.body);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return handleAuthError(res, error);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const result = await service.resetPassword(req.body);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return handleAuthError(res, error);
    }
  },
  changePassword: async (req, res) => {
    try {
      const result = await service.changePassword(req.user.MaKH, req.body);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return handleAuthError(res, error);
    }
  },
});

const authController = createAuthController();

export { createAuthController };
export default authController;
