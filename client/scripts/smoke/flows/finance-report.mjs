import axiosClient from '../../../src/lib/axiosClient.js';
import * as financeApi from '../../../src/features/finance/finance.api.js';

import financeReportSchema from '../../../../server/src/validator/report/financeReport.validator.js';

export default async function run() {
  console.log('Running finance-report smoke flow (API runtime & contract check)...');

  const validQuery = {
    page: 1,
    limit: 20,
    search: '',
    groupBy: 'vehicle'
  };
  const { error } = financeReportSchema.getFinanceDebtors.query.validate(validQuery);
  if (error) throw new Error(`Finance debtors contract broke for valid data: ${error.message}`);

  const originalGet = axiosClient.get;
  const calls = [];

  axiosClient.get = async (url, config) => {
    calls.push({ url, config });
    return { data: { data: 'mocked' } };
  };

  try {
    const params = { page: 1, limit: 20, search: '', groupBy: 'vehicle' };
    await financeApi.fetchReceivables(params);
    await financeApi.exportFinanceDebtors(params);

    const val = financeReportSchema.getFinanceDebtors.query.validate(params);
    if (val.error) throw new Error(`Finance debtors params invalid: ${val.error.message}`);

    const assertCall = (index, expectedUrl, expectedParams) => {
      const call = calls[index];
      if (call.url !== expectedUrl) {
        throw new Error(`Expected url ${expectedUrl}, got ${call.url}`);
      }
      if (expectedParams) {
        // match specific keys
        for (const k of Object.keys(expectedParams)) {
          if (call.config.params[k] !== expectedParams[k]) {
            throw new Error(`Expected param ${k}=${expectedParams[k]}, got ${call.config.params[k]}`);
          }
        }
      }
    };

    assertCall(0, '/api/v1/reports/finance/debtors', { page: 1, limit: 20, search: '', groupBy: 'vehicle' });
    assertCall(1, '/api/v1/reports/finance/debtors/export', { search: '', groupBy: 'vehicle' });

  } finally {
    axiosClient.get = originalGet;
  }
}
