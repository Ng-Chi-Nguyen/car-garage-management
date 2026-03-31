export function calculateReceivablesSummary(receivableCustomers) {
  if (!receivableCustomers || !Array.isArray(receivableCustomers)) {
    return { totalDebtVehicles: 0, totalReceivable: 0 };
  }
  const totalDebtVehicles = receivableCustomers.length;
  const totalReceivable = receivableCustomers.reduce((sum, item) => sum + (item.debt || 0), 0);
  return { totalDebtVehicles, totalReceivable };
}
