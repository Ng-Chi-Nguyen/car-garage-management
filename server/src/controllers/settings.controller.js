import settingsService from "../services/settings/settings.service.js";

const settingsController = {
  getSystemParameters: async (_req, res) => {
    const parameters = await settingsService.getSystemParameters();
    return res.json({ success: true, data: { parameters } });
  },
  updateSystemParameters: async (req, res) => {
    const parameters = await settingsService.updateSystemParameters(req.body);
    return res.json({ success: true, data: { parameters } });
  },
  getServicePrices: async (_req, res) => {
    const servicePrices = await settingsService.getServicePrices();
    return res.json({ success: true, data: { servicePrices } });
  },
  getCarBrands: async (_req, res) => {
    const carBrands = await settingsService.getCarBrands();
    return res.json({ success: true, data: { carBrands } });
  },
};

export default settingsController;
