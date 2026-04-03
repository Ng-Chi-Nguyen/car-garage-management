import repairOrderWorkflowSchema from '../../../../server/src/validator/workflows/repairOrderWorkflow.validator.js';

export default async function run() {
  console.log('Running repair smoke flow (contract check)...');

  const validRepairData = {
    repairOrder: {
      MaXe: 10,
      NgaySC: new Date().toISOString(),
      TrangThai: 'TiepNhan',
      NoiDungLoi: 'Engine noise',
    },
    details: [
      {
        MaVatTu: 5,
        MaTienCong: 2,
        SoLuong: 2,
        DonGiaVatTu: 150000,
        DonGiaTienCong: 500000
      }
    ]
  };

  const { error } = repairOrderWorkflowSchema.create.body.validate(validRepairData);
  if (error) {
    throw new Error(`Repair order contract broke for valid data: ${error.message}`);
  }

  const invalidRepairData = {
    repairOrder: {
      MaXe: 10,
      NgaySC: new Date().toISOString()
    },
    details: [] // empty details array not allowed
  };

  const { error: errorInvalid } = repairOrderWorkflowSchema.create.body.validate(invalidRepairData);
  if (!errorInvalid || !errorInvalid.message.includes('details')) {
    throw new Error('Repair order contract should have rejected empty details array');
  }
}
