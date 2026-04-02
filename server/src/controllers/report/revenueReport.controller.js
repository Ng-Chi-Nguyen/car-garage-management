import revenueReportService from "../../services/report/revenueReport.service.js";

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
        ? error?.message || "Đã xảy ra lỗi trong quá trình xử lý yêu cầu."
        : "Đã xảy ra lỗi trong quá trình xử lý yêu cầu.",
    });
  }
};

const createRevenueReportController = (service = revenueReportService) => ({
  getRevenueTimeseries: createHandler(service, "getRevenueTimeseries", "Lấy báo cáo doanh thu theo thời gian thành công."),
  getRevenueByCarBrand: createHandler(service, "getRevenueByCarBrand", "Lấy báo cáo doanh thu theo hiệu xe thành công."),
  getRevenueByPart: createHandler(service, "getRevenueByPart", "Lấy báo cáo doanh thu theo phụ tùng thành công."),
  getRevenueComparison: createHandler(service, "getRevenueComparison", "Lấy báo cáo so sánh doanh thu thành công."),
  getRevenueComposition: createHandler(service, "getRevenueComposition", "Lấy báo cáo tỷ trọng doanh thu thành công."),
});

const revenueReportController = createRevenueReportController();

export { createRevenueReportController };
export default revenueReportController;
