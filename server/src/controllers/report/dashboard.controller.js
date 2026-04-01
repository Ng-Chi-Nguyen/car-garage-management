import dashboardService from "../../services/report/dashboard.service.js";
import reportExportService from "../../services/report/reportExport.service.js";
import { sendXlsxBuffer } from "../../shared/xlsx/xlsxDownload.response.js";

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
  exportRevenueSummary: async (req, res) => {
    try {
      const reportFile = await reportExportService.exportDashboardRevenueSummary(req.validatedQuery);
      return sendXlsxBuffer(res, reportFile);
    } catch (error) {
      const status = Number.isInteger(error?.status) ? error.status : 500;
      const isBusinessError = status >= 400 && status < 500;

      return res.status(status).json({
        success: false,
        message: isBusinessError
          ? error?.message || "Da xay ra loi trong qua trinh xu ly yeu cau."
          : "Da xay ra loi trong qua trinh xu ly yeu cau.",
      });
    }
  },
});

const dashboardController = createDashboardController();

export { createDashboardController };
export default dashboardController;
