import axiosClient from '../../../src/lib/axiosClient.js';
import * as reportsApi from '../../../src/features/reports/reports.api.js';

import inventoryReportSchema from '../../../../server/src/validator/report/inventoryReport.validator.js';
import repairReportSchema from '../../../../server/src/validator/report/repairReport.validator.js';
import revenueReportSchema from '../../../../server/src/validator/report/revenueReport.validator.js';
import customerReportSchema from '../../../../server/src/validator/report/customerReport.validator.js';

export default async function run() {
  console.log('Running reports smoke flow (API runtime & contract check)...');

  // Customer contract check (legacy check retained)
  const validQuery = {
    granularity: 'month',
    from: '2026-01-01',
    to: '2026-03-31'
  };
  const { error } = customerReportSchema.getCustomerSummary.query.validate(validQuery);
  if (error) throw new Error(`Customer report contract broke for valid data: ${error.message}`);
  
  const invalidQuery = {
    granularity: 'yearly',
    from: '2026-01-01',
    to: '2026-03-31'
  };
  const { error: errorInvalid } = customerReportSchema.getCustomerSummary.query.validate(invalidQuery);
  if (!errorInvalid || !errorInvalid.message.includes('granularity')) {
    throw new Error('Customer report contract should have rejected invalid granularity');
  }

  // API runtime check
  const originalGet = axiosClient.get;
  const calls = [];

  axiosClient.get = async (url, config) => {
    calls.push({ url, config });
    return { data: { data: 'mocked' } };
  };

  try {
    // 1. Inventory
    const invParams = { from: '2026-01-01', to: '2026-01-31' };
    await reportsApi.fetchInventoryReport(invParams);
    await reportsApi.exportInventoryReport(invParams);

    const invVal = inventoryReportSchema.getInventorySummary.query.validate(invParams);
    if (invVal.error) throw new Error(`Inventory params invalid: ${invVal.error.message}`);

    // 2. Repair
    const repParams = { from: '2026-01-01', to: '2026-01-31', granularity: 'month' };
    await reportsApi.fetchRepairReport(repParams);
    await reportsApi.exportRepairReport(repParams);

    const repVal = repairReportSchema.getRepairSummary.query.validate(repParams);
    if (repVal.error) throw new Error(`Repair params invalid: ${repVal.error.message}`);

    // 3. Revenue Composition
    const revParams = { from: '2026-01-01', to: '2026-01-31' };
    await reportsApi.fetchRevenueReport(revParams);
    await reportsApi.exportRevenueReport(revParams);

    const revVal = revenueReportSchema.getRevenueComposition.query.validate(revParams);
    if (revVal.error) throw new Error(`Revenue params invalid: ${revVal.error.message}`);

    // Assertions
    const assertCall = (index, expectedUrl, expectedParams) => {
      const call = calls[index];
      if (call.url !== expectedUrl) {
        throw new Error(`Expected url ${expectedUrl}, got ${call.url}`);
      }
      if (JSON.stringify(call.config.params) !== JSON.stringify(expectedParams)) {
        throw new Error(`Expected params ${JSON.stringify(expectedParams)}, got ${JSON.stringify(call.config.params)}`);
      }
    };

    assertCall(0, '/api/v1/reports/inventory/summary', invParams);
    assertCall(1, '/api/v1/reports/inventory/summary/export', invParams);
    
    assertCall(2, '/api/v1/reports/repair/summary', repParams);
    assertCall(3, '/api/v1/reports/repair/summary/export', repParams);

    assertCall(4, '/api/v1/reports/revenue/composition', revParams);
    assertCall(5, '/api/v1/reports/revenue/composition/export', revParams);

  } finally {
    axiosClient.get = originalGet;
  }
}
