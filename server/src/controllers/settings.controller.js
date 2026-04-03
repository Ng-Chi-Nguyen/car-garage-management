import settingsService from "../services/settings/settings.service.js";

const forbidden = (res) =>
  res.status(403).json({
    success: false,
    message: "Bạn không có quyền truy cập tài nguyên này.",
  });

const assertAdmin = (req, res) => req.user?.ChucVu === "Admin";

const settingsController = {
  getSystemParameters: async (_req, res) => {
    const parameters = await settingsService.getSystemParameters();
    return res.json({ success: true, data: { parameters } });
  },
  updateSystemParameters: async (req, res) => {
    if (!assertAdmin(req, res)) {
      return forbidden(res);
    }

    const parameters = await settingsService.updateSystemParameters(req.body);
    return res.json({ success: true, data: { parameters } });
  },
  getServicePrices: async (_req, res) => {
    const servicePrices = await settingsService.getServicePrices();
    return res.json({ success: true, data: { servicePrices } });
  },
  createServicePrice: async (req, res) => {
    if (!assertAdmin(req, res)) {
      return forbidden(res);
    }

    const servicePrice = await settingsService.createServicePrice(req.validatedBody ?? req.body);
    return res.status(201).json({ success: true, data: { servicePrice } });
  },
  updateServicePrice: async (req, res) => {
    if (!assertAdmin(req, res)) {
      return forbidden(res);
    }

    const params = req.validatedParams ?? req.params;
    const servicePrice = await settingsService.updateServicePrice(params.id, req.validatedBody ?? req.body);
    return res.json({ success: true, data: { servicePrice } });
  },
  deleteServicePrice: async (req, res) => {
    if (!assertAdmin(req, res)) {
      return forbidden(res);
    }

    const params = req.validatedParams ?? req.params;
    const result = await settingsService.deleteServicePrice(params.id);
    return res.json({ success: true, data: { result } });
  },
  getCarBrands: async (_req, res) => {
    const carBrands = await settingsService.getCarBrands();
    return res.json({ success: true, data: { carBrands } });
  },
};

export default settingsController;
