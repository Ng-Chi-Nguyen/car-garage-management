const normalizeIntake = (intake, id = 1) => ({
  id,
  customerId: Number(intake.MaKH),
  vehicleId: Number(intake.MaXe),
  employeeId: intake.MaNV === null || intake.MaNV === undefined ? null : Number(intake.MaNV),
  receivedAt: intake.NgayTiepNhan,
  status: intake.TrangThai ?? "TiepNhan",
  issueDescription: intake.NoiDungLoi ?? null,
  quickTags: Array.isArray(intake.quickTags) ? intake.quickTags.map((value) => String(value).trim()).filter(Boolean) : [],
  note: intake.note ?? null,
  GhiChu: JSON.stringify({
    quickTags: Array.isArray(intake.quickTags) ? intake.quickTags.map((value) => String(value).trim()).filter(Boolean) : [],
    note: intake.note ?? null,
  }),
  licensePlate: intake.BienSoXe ?? null,
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
