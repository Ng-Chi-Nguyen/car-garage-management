const makeValidator = (rules) => ({
  validate(value) {
    const errors = [];
    const validated = {};

    for (const [key, rule] of Object.entries(rules)) {
      const input = value?.[key];
      if (input === undefined || input === null || input === "") {
        if (rule.required) errors.push({ message: `"${key}" is required` });
        continue;
      }

      if (rule.type === "number") {
        const parsed = Number(input);
        if (!Number.isInteger(parsed) || parsed <= 0) errors.push({ message: `"${key}" must be a positive integer` });
        else validated[key] = parsed;
        continue;
      }

      if (rule.values && !rule.values.includes(input)) {
        errors.push({ message: `"${key}" must be one of [${rule.values.join(", ")}]` });
        continue;
      }

      validated[key] = input;
    }

    const unknownKeys = Object.keys(value ?? {}).filter((key) => !rules[key]);
    if (unknownKeys.length > 0) {
      errors.push(...unknownKeys.map((key) => ({ message: `"${key}" is not allowed` })));
    }

    return errors.length ? { error: { details: errors } } : { value: validated };
  },
});

export default {
  getAll: {
    query: makeValidator({
      page: { type: "number" },
      limit: { type: "number" },
      search: {},
      role: { values: ["Admin", "NhanVien", "KhachHang"] },
      status: { values: ["HoatDong", "BiKhoa", "DaXoa"] },
    }),
  },
  update: {
    params: makeValidator({ id: { type: "number", required: true } }),
    body: makeValidator({
      ChucVu: { values: ["Admin", "NhanVien", "KhachHang"] },
      TrangThai: { values: ["HoatDong", "BiKhoa", "DaXoa"] },
    }),
  },
};
