import customerReportService from "../../services/report/customerReport.service.js";
import reportExportService from "../../services/report/reportExport.service.js";
import { sendXlsxBuffer } from "../../shared/xlsx/xlsxDownload.response.js";

const createCustomerReportController = (service = customerReportService) => ({
  getCustomerSummary: async (req, res) => {
    try {
      const summary = await service.getCustomerSummary(req.validatedQuery);
      const data = {
        ...summary,
        range: req.validatedQuery,
      };

      return res.status(200).json({
        success: true,
        message: "Lấy báo cáo thống kê khách hàng thành công.",
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
  exportCustomerSummary: async (req, res) => {
    try {
      const reportFile = await reportExportService.exportCustomerSummary(req.validatedQuery);
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

const customerReportController = createCustomerReportController();

export { createCustomerReportController };
export default customerReportController;
