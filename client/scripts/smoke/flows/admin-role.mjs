import adminUsersSchema from '../../../../server/src/validator/adminUsers.validator.js';

export default async function run() {
  console.log('Running admin-role smoke flow (contract check)...');

  // Verify that updating user role correctly enforces valid 'ChucVu' and 'TrangThai'
  const validUpdate = {
    ChucVu: 'Admin',
    TrangThai: 'HoatDong'
  };

  const result = adminUsersSchema.update.body.validate(validUpdate);
  if (result.error) {
    throw new Error(`Admin role contract broke for valid data: ${JSON.stringify(result.error)}`);
  }

  const invalidUpdate = {
    ChucVu: 'SuperAdmin' // Not in allowed list
  };

  const invalidResult = adminUsersSchema.update.body.validate(invalidUpdate);
  if (!invalidResult.error || !invalidResult.error.details.some(e => e.message.includes('ChucVu'))) {
    throw new Error('Admin role contract should have rejected invalid ChucVu');
  }

  const validParams = { id: '1' };
  const paramsResult = adminUsersSchema.update.params.validate(validParams);
  if (paramsResult.error) {
    throw new Error(`Admin role contract broke for valid params: ${JSON.stringify(paramsResult.error)}`);
  }

  const invalidParams = { id: 'abc' };
  const invalidParamsResult = adminUsersSchema.update.params.validate(invalidParams);
  if (!invalidParamsResult.error) {
    throw new Error('Admin role contract should have rejected invalid id parameter');
  }
}
