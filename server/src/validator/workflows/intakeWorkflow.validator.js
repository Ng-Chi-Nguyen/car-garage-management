const INTAKE_TRANG_THAI_VALUES = ["TiepNhan", "DangXuLy", "HoanTat"];

const toDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const validateIntake = (body) => {
  const errors = [];
  const intake = body?.intake;

  if (!intake || typeof intake !== "object") {
    errors.push({ message: '"intake" is required' });
    return { error: { details: errors } };
  }

  if (!Number.isInteger(Number(intake.MaKH)) || Number(intake.MaKH) <= 0) errors.push({ message: '"MaKH" must be a positive integer' });
  if (!Number.isInteger(Number(intake.MaXe)) || Number(intake.MaXe) <= 0) errors.push({ message: '"MaXe" must be a positive integer' });
  if (intake.MaNV !== null && intake.MaNV !== undefined && (!Number.isInteger(Number(intake.MaNV)) || Number(intake.MaNV) <= 0)) errors.push({ message: '"MaNV" must be a positive integer or null' });
  const receivedAt = toDate(intake.NgayTiepNhan);
  if (!receivedAt) errors.push({ message: '"NgayTiepNhan" must be a valid date' });
  if (intake.TrangThai && !INTAKE_TRANG_THAI_VALUES.includes(intake.TrangThai)) errors.push({ message: '"TrangThai" contains an invalid value' });
  if (!String(intake.BienSoXe ?? "").trim()) errors.push({ message: '"BienSoXe" is required' });
  for (const key of Object.keys(intake)) {
    if (!["MaKH", "MaXe", "MaNV", "NgayTiepNhan", "TrangThai", "GhiChu", "BienSoXe"].includes(key)) {
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
        GhiChu: intake.GhiChu ?? null,
        BienSoXe: String(intake.BienSoXe).trim(),
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
