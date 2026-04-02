const normalizeIntake = (intake, id = 1) => ({
  id,
  customerId: Number(intake.MaKH),
  vehicleId: Number(intake.MaXe),
  employeeId: intake.MaNV === null || intake.MaNV === undefined ? null : Number(intake.MaNV),
  receivedAt: intake.NgayTiepNhan,
  status: intake.TrangThai ?? "TiepNhan",
  note: intake.GhiChu ?? null,
  licensePlate: intake.BienSoXe,
});

const createIntakeWorkflowService = () => ({
  createIntakeAtomic: async (payload) => ({
    intake: normalizeIntake(payload.intake ?? payload),
    history: [],
  }),
  fetchIntakeHistory: async () => [],
});

const intakeWorkflowService = createIntakeWorkflowService();

export { createIntakeWorkflowService };
export default {
  create: intakeWorkflowService.createIntakeAtomic,
  createIntakeAtomic: intakeWorkflowService.createIntakeAtomic,
  fetchIntakeHistory: intakeWorkflowService.fetchIntakeHistory,
};
