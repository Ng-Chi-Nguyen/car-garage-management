import repairReportService from "../../services/report/repairReport.service.js";

const createRepairReportController = (service = repairReportService) => ({
  getRepairSummary: async (req, res) => {
    try {
      const data = await service.getRepairSummary(req.validatedQuery);

      return res.status(200).json({
        success: true,
        message: "Lấy báo cáo thống kê sửa chữa thành công.",
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

const repairReportController = createRepairReportController();

export { createRepairReportController };
export default repairReportController;
