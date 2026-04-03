import prisma from "../../db/prisma.js";
import { buildServiceError } from "../../shared/crud/crud.helpers.js";

const normalizeQuickTags = (value) =>
  (Array.isArray(value) ? value : []).map((item) => String(item).trim()).filter(Boolean);

const normalizeIntake = (intake, id = 1) => {
  const quickTags = normalizeQuickTags(intake.quickTags);
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
    licensePlate: intake.BienSoXe ?? null,
  };
};

const createIntakeWorkflowService = ({ db = prisma } = {}) => ({
  createIntakeAtomic: async (payload) => {
    const intake = payload.intake ?? payload;
    const customer = await db.kHACH_HANG.findUnique({
      where: { MaKH: Number(intake.MaKH) },
      select: { MaKH: true },
    });

    if (!customer) {
      throw buildServiceError(404, "Không tìm thấy khách hàng.");
    }

    const vehicle = await db.xE.findUnique({
      where: { MaXe: Number(intake.MaXe) },
      select: { MaXe: true, MaKH: true },
    });

    if (!vehicle || Number(vehicle.MaKH) !== Number(intake.MaKH)) {
      throw buildServiceError(404, "Không tìm thấy xe.");
    }

    const normalizedIntake = normalizeIntake(intake);

    const repairOrder = await db.pHIEU_SUA_CHUA.create({
      data: {
        MaXe: normalizedIntake.vehicleId,
        MaNV: normalizedIntake.employeeId,
        NgaySC: normalizedIntake.receivedAt,
        TrangThai: normalizedIntake.status,
        NoiDungLoi: normalizedIntake.issueDescription,
        GhiChu: normalizedIntake.GhiChu,
        TongTien: 0,
      },
    });

    return {
      intake: {
        ...normalizedIntake,
        id: repairOrder.MaPhieuSC,
      },
      history: [repairOrder],
    };
  },
  fetchIntakeHistory: async () => [],
});

const intakeWorkflowService = createIntakeWorkflowService();

export { createIntakeWorkflowService };
export default {
  create: intakeWorkflowService.createIntakeAtomic,
  createIntakeAtomic: intakeWorkflowService.createIntakeAtomic,
  fetchIntakeHistory: intakeWorkflowService.fetchIntakeHistory,
};
