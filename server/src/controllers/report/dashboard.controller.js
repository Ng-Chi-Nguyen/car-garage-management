import dashboardService from "../../services/report/dashboard.service.js";

const createDashboardController = (service = dashboardService) => ({
  getRevenueSummary: async (req, res) => {
    try {
      const data = await service.getRevenueSummary(req.validatedQuery);

      return res.status(200).json({
        success: true,
        message: "Lấy thống kê doanh thu dashboard thành công.",
        data,
      });
    } catch (error) {
      const status = Number.isInteger(error?.status) ? error.status : 500;
      const isBusinessError = status >= 400 && status < 500;

      return res.status(status).json({
        success: false,
        message: isBusinessError
          ? error?.message || "Đã xảy ra lỗi trong quá trình xử lý yêu cầu."
          : "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.",
      });
    }
  },
});

const dashboardController = createDashboardController();

export { createDashboardController };
export default dashboardController;
