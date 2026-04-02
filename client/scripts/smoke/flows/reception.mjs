import intakeWorkflowSchema from '../../../../server/src/validator/workflows/intakeWorkflow.validator.js';

export default async function run() {
  console.log('Running reception smoke flow (contract check)...');

  // Executable assertion: the custom validator must require MaKH, MaXe, BienSoXe, NgayTiepNhan
  const validData = {
    intake: {
      MaKH: 1,
      MaXe: 2,
      BienSoXe: '51A-123.45',
      NgayTiepNhan: new Date().toISOString()
    }
  };

  const result = intakeWorkflowSchema.create.body.validate(validData);
  if (result.error) {
    throw new Error(`Reception contract broke for valid data: ${JSON.stringify(result.error)}`);
  }

  const invalidData = {
    intake: { MaKH: 1 } // missing MaXe, BienSoXe, NgayTiepNhan
  };

  const resultInvalid = intakeWorkflowSchema.create.body.validate(invalidData);
  if (!resultInvalid.error) {
    throw new Error('Reception contract should have rejected missing MaXe/BienSoXe/NgayTiepNhan');
  }
}
