import customerSchema from '../../../../server/src/validator/management/customer.validator.js';

export default async function run() {
  console.log('Running customers smoke flow (contract check)...');

  const validCustomer = {
    TenChuXe: 'Nguyen Van B',
    DienThoai: '0901234568',
    DiaChi: '123 ABC Street'
  };

  const { error } = customerSchema.create.body.validate(validCustomer);
  if (error) {
    throw new Error(`Customer contract broke for valid data: ${error.message}`);
  }

  const invalidCustomer = {
    TenChuXe: 'Nguyen Van B',
    // Missing DienThoai
    DiaChi: '123 ABC Street'
  };

  const { error: errorInvalid } = customerSchema.create.body.validate(invalidCustomer);
  if (!errorInvalid || !errorInvalid.message.includes('DienThoai')) {
    throw new Error('Customer contract should have rejected missing DienThoai');
  }
}
