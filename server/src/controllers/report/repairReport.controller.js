import repairReportService from "../../services/report/repairReport.service.js";
import reportExportService from "../../services/report/reportExport.service.js";
import { sendXlsxBuffer } from "../../shared/xlsx/xlsxDownload.response.js";

const createRepairReportController = (service = repairReportService) => ({
  getRepairSummary: async (req, res) => {
    try {
      const data = await service.getRepairSummary(req.validatedQuery);

      return res.status(200).json({
        success: true,
        message: "Lay bao cao thong ke sua chua thanh cong.",
        data,
      });
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
  exportRepairSummary: async (req, res) => {
    try {
      const reportFile = await reportExportService.exportRepairSummary(req.validatedQuery);
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

const repairReportController = createRepairReportController();

export { createRepairReportController };
export default repairReportController;
