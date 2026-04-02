import financeReportService from "../../services/report/financeReport.service.js";

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
        ? error?.message || "Đã xảy ra lỗi trong quá trình xử lý yêu cầu."
        : "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.",
    });
  }
};

const createFinanceReportController = (service = financeReportService) => ({
  getFinanceSummary: createHandler(
    service,
    "getFinanceSummary",
    "Lấy báo cáo công nợ/tài chính thành công.",
    true,
  ),
  getFinanceDebtors: createHandler(
    service,
    "getFinanceDebtors",
    "Lấy danh sách công nợ thành công.",
  ),
});

const financeReportController = createFinanceReportController();

export { createFinanceReportController };
export default financeReportController;
