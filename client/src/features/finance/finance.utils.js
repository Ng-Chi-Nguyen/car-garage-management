export function calculateReceivablesSummary(receivableCustomers) {
  if (!receivableCustomers || !Array.isArray(receivableCustomers)) {
    return { totalDebtVehicles: 0, totalReceivable: 0 };
  }
  const totalDebtVehicles = receivableCustomers.length;
  const totalReceivable = receivableCustomers.reduce((sum, item) => sum + (item.outstandingDebt || item.debt || 0), 0);
  return { totalDebtVehicles, totalReceivable };
}

export function buildFinanceSummaryQueryRange(baseDate) {
  const now = baseDate || new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  
  const fromDate = new Date(year, month, 1);
  const toDate = new Date(year, month, date);
  
  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  
  return {
    from: formatDate(fromDate),
    to: formatDate(toDate),
    granularity: 'day'
  };
}
