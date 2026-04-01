import reportExportService from "../../services/report/reportExport.service.js";
import { sendXlsxBuffer } from "../../shared/xlsx/xlsxDownload.response.js";

const createReportExportController = (service = reportExportService) => ({
  exportAllReports: async (req, res) => {
    try {
      const reportFile = await service.exportAllReports(req.validatedQuery);
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

const reportExportController = createReportExportController();

export { createReportExportController };
export default reportExportController;
