import revenueReportService from "../../services/report/revenueReport.service.js";
import reportExportService from "../../services/report/reportExport.service.js";
import { sendXlsxBuffer } from "../../shared/xlsx/xlsxDownload.response.js";

const createHandler = (service, serviceMethodName, successMessage) => async (req, res) => {
  try {
    const data = await service[serviceMethodName](req.validatedQuery);

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

const createRevenueReportController = (service = revenueReportService) => ({
  getRevenueTimeseries: createHandler(service, "getRevenueTimeseries", "Lay bao cao doanh thu theo thoi gian thanh cong."),
  getRevenueByCarBrand: createHandler(service, "getRevenueByCarBrand", "Lay bao cao doanh thu theo hieu xe thanh cong."),
  getRevenueByPart: createHandler(service, "getRevenueByPart", "Lay bao cao doanh thu theo phu tung thanh cong."),
  getRevenueComparison: createHandler(service, "getRevenueComparison", "Lay bao cao so sanh doanh thu thanh cong."),
  getRevenueComposition: createHandler(service, "getRevenueComposition", "Lay bao cao ty trong doanh thu thanh cong."),
  exportRevenueTimeseries: createExportHandler("exportRevenueTimeseries"),
  exportRevenueByCarBrand: createExportHandler("exportRevenueByCarBrand"),
  exportRevenueByPart: createExportHandler("exportRevenueByPart"),
  exportRevenueComparison: createExportHandler("exportRevenueComparison"),
  exportRevenueComposition: createExportHandler("exportRevenueComposition"),
});

const revenueReportController = createRevenueReportController();

export { createRevenueReportController };
export default revenueReportController;
