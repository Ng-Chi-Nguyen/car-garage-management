const settingsSchema = {
  update: {
    validate: (body) => {
      const errors = [];
      if (!Number.isInteger(body.maxCarsPerDay) || body.maxCarsPerDay < 0) {
        errors.push({ message: '"maxCarsPerDay" must be a non-negative integer' });
      }
      if (typeof body.materialProfitMargin !== "number" || Number.isNaN(body.materialProfitMargin) || body.materialProfitMargin < 0) {
        errors.push({ message: '"materialProfitMargin" must be a number greater than or equal to 0' });
      }
      const allowedKeys = ["maxCarsPerDay", "materialProfitMargin"];
      Object.keys(body).forEach((key) => {
        if (!allowedKeys.includes(key)) {
          errors.push({ message: `"${key}" is not allowed` });
        }
      });
      if (errors.length > 0) {
        return { error: { details: errors }, value: body };
      }
      return { error: null, value: body };
    },
  },
};

export default settingsSchema;
