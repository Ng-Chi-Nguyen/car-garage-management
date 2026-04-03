const resolveDb = async (db) => db ?? (await import("../../db/prisma.js")).default;

export const normalizeLicensePlate = (plate) => {
  if (!plate) return "";
  let clean = String(plate).trim().toUpperCase();
  clean = clean.replace(/^(\d{2}[A-Z]\d?)-?(\d{3})[- ](\d{2})$/, "$1-$2.$3");
  return clean;
};

const normalizeIntake = (intake, id = 1) => {
  const quickTags = Array.isArray(intake.quickTags)
    ? intake.quickTags.map((value) => String(value).trim()).filter(Boolean)
    : [];
  const note = intake.note ?? null;

  return {
    id,
    customerId: Number(intake.MaKH),
    vehicleId: Number(intake.MaXe),
    employeeId: intake.MaNV === null || intake.MaNV === undefined ? null : Number(intake.MaNV),
    receivedAt: intake.NgayTiepNhan,
    status: intake.TrangThai ?? "TiepNhan",
    issueDescription: intake.NoiDungLoi ?? null,
    quickTags,
    note,
    GhiChu: JSON.stringify({ quickTags, note }),
  };
};

const createIntakeVehicleResolverService = ({ db } = {}) => ({
  resolveVehicleByPlate: async ({ BienSo }) => {
    const client = await resolveDb(db);
    const normalizedPlate = normalizeLicensePlate(BienSo);
    const vehicle = await client.xE.findUnique({
      where: { BienSo: normalizedPlate },
      select: { MaXe: true },
    });

    if (!vehicle) {
      const error = new Error("Không tìm thấy xe.");
      error.status = 404;
      throw error;
    }

    return { MaXe: Number(vehicle.MaXe) };
  },
  createIntakeAtomic: async (payload) => ({
    intake: normalizeIntake(payload.intake ?? payload),
    history: [],
  }),
});

const intakeVehicleResolverService = createIntakeVehicleResolverService();

export { createIntakeVehicleResolverService };
export default intakeVehicleResolverService;
