import customerReportSchema from '../../../../server/src/validator/report/customerReport.validator.js';

export default async function run() {
  console.log('Running reports smoke flow (contract check)...');

  const validQuery = {
    granularity: 'month',
    from: '2026-01-01',
    to: '2026-03-31'
  };

  const { error } = customerReportSchema.getCustomerSummary.query.validate(validQuery);
  if (error) {
    throw new Error(`Customer report contract broke for valid data: ${error.message}`);
  }

  const invalidQuery = {
    granularity: 'yearly', // invalid granularity
    from: '2026-01-01',
    to: '2026-03-31'
  };

  const { error: errorInvalid } = customerReportSchema.getCustomerSummary.query.validate(invalidQuery);
  if (!errorInvalid || !errorInvalid.message.includes('granularity')) {
    throw new Error('Customer report contract should have rejected invalid granularity');
  }
}
