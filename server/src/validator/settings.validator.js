import Joi from "joi";

const idParamSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
}).unknown(false);

const servicePriceBodySchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  price: Joi.number().min(0).required(),
}).unknown(false);

const settingsSchema = {
  update: Joi.object({
    maxCarsPerDay: Joi.number().integer().min(0).required(),
    materialProfitMargin: Joi.number().min(0).required(),
  }).unknown(false),
  createServicePrice: {
    body: servicePriceBodySchema,
  },
  updateServicePrice: {
    params: idParamSchema,
    body: servicePriceBodySchema,
  },
  deleteServicePrice: {
    params: idParamSchema,
  },
};

export default settingsSchema;
