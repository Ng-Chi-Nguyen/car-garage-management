import inventoryReportService from "../../services/report/inventoryReport.service.js";
import reportExportService from "../../services/report/reportExport.service.js";
import { sendXlsxBuffer } from "../../shared/xlsx/xlsxDownload.response.js";

const createInventoryReportController = (service = inventoryReportService) => ({
  getInventorySummary: async (req, res) => {
    try {
      const data = await service.getInventorySummary(req.validatedQuery);

      return res.status(200).json({
        success: true,
        message: "Lay bao cao thong ke kho phu tung thanh cong.",
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
  exportInventorySummary: async (req, res) => {
    try {
      const reportFile = await reportExportService.exportInventorySummary(req.validatedQuery);
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

const inventoryReportController = createInventoryReportController();

export { createInventoryReportController };
export default inventoryReportController;
