import Joi from "joi";

import { masterDataEntitySchema } from "../../services/management/masterDataXlsxV2.service.js";

const emptyObjectSchema = Joi.object({}).unknown(false);

const masterDataXlsxSchema = {
  params: Joi.object({
    entity: masterDataEntitySchema,
  }).unknown(false),
  query: emptyObjectSchema,
  body: emptyObjectSchema,
};

export default masterDataXlsxSchema;
