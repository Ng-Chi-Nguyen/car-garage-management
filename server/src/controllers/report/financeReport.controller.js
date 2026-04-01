import financeReportService from "../../services/report/financeReport.service.js";
import reportExportService from "../../services/report/reportExport.service.js";
import { sendXlsxBuffer } from "../../shared/xlsx/xlsxDownload.response.js";

const createHandler = (service, serviceMethodName, successMessage, includeRange = false) => async (req, res) => {
  try {
    const reportData = await service[serviceMethodName](req.validatedQuery);
    const data = includeRange
      ? {
          ...reportData,
          range: req.validatedQuery,
        }
      : reportData;

    return res.status(200).json({
      success: true,
      message: successMessage,
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
};

const createExportHandler = (exportMethodName) => async (req, res) => {
  try {
    const reportFile = await reportExportService[exportMethodName](req.validatedQuery);
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
};

const createFinanceReportController = (service = financeReportService) => ({
  getFinanceSummary: createHandler(
    service,
    "getFinanceSummary",
    "Lay bao cao cong no/tai chinh thanh cong.",
    true,
  ),
  getFinanceDebtors: createHandler(
    service,
    "getFinanceDebtors",
    "Lay danh sach cong no thanh cong.",
  ),
  exportFinanceSummary: createExportHandler("exportFinanceSummary"),
  exportFinanceDebtors: createExportHandler("exportFinanceDebtors"),
});

const financeReportController = createFinanceReportController();

export { createFinanceReportController };
export default financeReportController;
