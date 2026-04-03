const INTAKE_TRANG_THAI_VALUES = ["TiepNhan", "DangXuLy", "HoanTat"];

const toDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toQuickTags = (value) => {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    return null;
  }

  return value.map((item) => String(item).trim()).filter(Boolean);
};

const validateIntake = (body) => {
  const errors = [];
  const intake = body?.intake ?? body;

  if (!intake || typeof intake !== "object") {
    errors.push({ message: '"intake" is required' });
    return { error: { details: errors } };
  }

  if (intake.MaKH !== null && intake.MaKH !== undefined && (!Number.isInteger(Number(intake.MaKH)) || Number(intake.MaKH) <= 0)) errors.push({ message: '"MaKH" must be a positive integer or null' });
  if (intake.MaXe !== null && intake.MaXe !== undefined && (!Number.isInteger(Number(intake.MaXe)) || Number(intake.MaXe) <= 0)) errors.push({ message: '"MaXe" must be a positive integer or null' });
  if (intake.MaNV !== null && intake.MaNV !== undefined && (!Number.isInteger(Number(intake.MaNV)) || Number(intake.MaNV) <= 0)) errors.push({ message: '"MaNV" must be a positive integer or null' });
  const receivedAt = toDate(intake.NgayTiepNhan);
  if (!receivedAt) errors.push({ message: '"NgayTiepNhan" must be a valid date' });
  if (intake.TrangThai && !INTAKE_TRANG_THAI_VALUES.includes(intake.TrangThai)) errors.push({ message: '"TrangThai" contains an invalid value' });
  if (!String(intake.NoiDungLoi ?? "").trim()) errors.push({ message: '"NoiDungLoi" is required' });
  const quickTags = toQuickTags(intake.quickTags);

  if (quickTags === null) {
    errors.push({ message: '"quickTags" must be an array' });
  }

  if (intake.note !== undefined && intake.note !== null && typeof intake.note !== "string") {
    errors.push({ message: '"note" must be a string or null' });
  }
  for (const key of Object.keys(intake)) {
    if (!["MaKH", "MaXe", "MaNV", "NgayTiepNhan", "TrangThai", "NoiDungLoi", "quickTags", "note"].includes(key)) {
      errors.push({ message: `"${key}" is not allowed` });
    }
  }

  if (errors.length) {
    return { error: { details: errors, message: errors.map((entry) => entry.message).join(", ") } };
  }

  return {
    value: {
      intake: {
        MaKH: Number(intake.MaKH),
        MaXe: Number(intake.MaXe),
        MaNV: intake.MaNV === null || intake.MaNV === undefined ? null : Number(intake.MaNV),
        NgayTiepNhan: receivedAt,
        TrangThai: intake.TrangThai ?? "TiepNhan",
        NoiDungLoi: String(intake.NoiDungLoi).trim(),
        quickTags: quickTags ?? [],
        note: intake.note ?? null,
      },
    },
  };
};

const intakeWorkflowSchema = {
  create: {
    body: {
      validate: validateIntake,
    },
  },
};

export default intakeWorkflowSchema;
