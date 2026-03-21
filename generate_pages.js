const fs = require('fs');
const path = require('path');
const manifest = [
    { componentPath: 'src/pages/auth/Login.jsx' },
    { componentPath: 'src/pages/dashboard/Dashboard.jsx' },
    { componentPath: 'src/pages/workshop/WorkshopStatus.jsx' },
    { componentPath: 'src/pages/intake/VehicleIntake.jsx' },
    { componentPath: 'src/pages/intake/IntakeModalPage.jsx' },
    { componentPath: 'src/pages/repair/RepairOrder.jsx' },
    { componentPath: 'src/pages/inventory/InventoryManagement.jsx' },
    { componentPath: 'src/pages/inventory/StockDetail.jsx' },
    { componentPath: 'src/pages/finance/Receivables.jsx' },
    { componentPath: 'src/pages/finance/SettlementPrint.jsx' },
    { componentPath: 'src/pages/customers/CustomerList.jsx' },
    { componentPath: 'src/pages/customers/CustomerDetail.jsx' },
    { componentPath: 'src/pages/customers/CustomerAnalytics.jsx' },
    { componentPath: 'src/pages/settings/SystemSettings.jsx' },
    { componentPath: 'src/pages/settings/ActivityLog.jsx' }
];

manifest.forEach(route => {
    const fullPath = path.join(__dirname, 'client', route.componentPath);
    const componentName = path.basename(route.componentPath, '.jsx');
    const content = `export default function ${componentName}() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">${componentName} Placeholder</h1>
    </div>
  );
}
`;
    fs.writeFileSync(fullPath, content);
});
