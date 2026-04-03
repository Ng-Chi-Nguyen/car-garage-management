import prisma from "../../db/prisma.js";
import { buildServiceError } from "../../shared/crud/crud.helpers.js";

const normalizePlate = (value) => String(value ?? "").trim().replace(/-(\d{2})$/, ".$1");

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
  };
};

const createIntakeWorkflowService = ({ db = prisma } = {}) => ({
  createIntakeAtomic: async (payload) => {
    const body = payload.intake ?? payload;
    const intake = {
      ...body,
      MaKH: body.MaKH ?? payload.customer?.MaKH ?? null,
      MaXe: body.MaXe ?? payload.vehicle?.MaXe ?? null,
      BienSo: body.BienSo ?? payload.vehicle?.BienSo ?? null,
    };
    let vehicle = await db.xE.findUnique({
      where: { MaXe: Number(intake.MaXe) },
      select: { MaXe: true, MaKH: true },
    });

    if (!vehicle) {
      const normalizedPlate = normalizePlate(intake.BienSo);
      if (normalizedPlate) {
        vehicle = await db.xE.findUnique({
          where: { BienSo: normalizedPlate },
          select: { MaXe: true, MaKH: true },
        });
      }
    }

    if (!vehicle) {
      throw buildServiceError(404, "Không tìm thấy xe.");
    }

    intake.MaXe = Number(vehicle.MaXe);
    intake.MaKH = Number(intake.MaKH ?? vehicle.MaKH);

    const customer = await db.kHACH_HANG.findUnique({
      where: { MaKH: Number(intake.MaKH) },
      select: { MaKH: true },
    });

    if (!customer) {
      throw buildServiceError(404, "Không tìm thấy khách hàng.");
    }

    if (Number(vehicle.MaKH) !== Number(intake.MaKH)) {
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
