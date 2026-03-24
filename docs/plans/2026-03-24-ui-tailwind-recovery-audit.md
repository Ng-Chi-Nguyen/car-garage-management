# UI Tailwind Recovery Audit

## Degraded Page Recovery Matrix

| Route Path | Current File Path | Status | Preferred Donor | Fallback / Sibling Source | Required Supporting Files | executable smoke-check URL | executable expected text | Block Rule |
|------------|-------------------|--------|-----------------|---------------------------|---------------------------|----------------------------|--------------------------|------------|
| `/finance/receivables` | `client/src/pages/finance/Receivables.jsx` | Placeholder | `d5bee0d33aa61bc788c8b9377d71f98ad287d6a6` | `58179cf` or `client/src/pages/payments/payments-page.jsx` | TBD | `http://localhost:5173/finance/receivables` | "Thu tiền" | Block if no safe source |
| `/intake` | `client/src/pages/intake/VehicleIntake.jsx` | Placeholder | `d5bee0d33aa61bc788c8b9377d71f98ad287d6a6` | `58179cf` or `client/src/pages/intake/intake-page.jsx` | TBD | `http://localhost:5173/intake` | "Tiếp nhận xe mới" | Block if no safe source |
| `/repair-orders/new` | `client/src/pages/repair/RepairOrder.jsx` | Restored | Unknown | Sibling: `client/src/pages/repair/repair-order-page.jsx` | TBD | `http://localhost:5173/repair-orders/new` | "Lập phiếu sửa chữa" | Block if no safe source |
| `/finance/settlement/print` | `client/src/pages/finance/SettlementPrint.jsx` | Placeholder | Unknown | Sibling: `client/src/pages/settlement/settlement-page.jsx` | TBD | `http://localhost:5173/finance/settlement/print` | "Quyết toán / In hóa đơn" | Block if no safe source |
| `/intake/new` | `client/src/pages/intake/IntakeModalPage.jsx` | Placeholder | Unknown | Sibling: `client/src/pages/intake/intake-modal-page.jsx` | TBD | `http://localhost:5173/intake/new` | "Lập phiếu tiếp nhận" | Block if no safe source |
| `/customers/analytics` | `client/src/pages/customers/CustomerAnalytics.jsx` | Placeholder | Unknown | Sibling: `client/src/pages/customers/customer-report-page.jsx` | TBD | `http://localhost:5173/customers/analytics` | "Báo cáo khách hàng chuyên sâu" | Block if no safe source |
| `/customers/detail` | `client/src/pages/customers/CustomerDetail.jsx` | Placeholder | Unknown | Sibling: `client/src/pages/customers/customer-detail-page.jsx` | TBD | `http://localhost:5173/customers/detail` | "Hồ sơ khách hàng" | Block if no safe source |
| `/inventory/stock-card` | `client/src/pages/inventory/StockDetail.jsx` | Placeholder | Unknown | Sibling: `client/src/pages/inventory/stock-detail-page.jsx` | TBD | `http://localhost:5173/inventory/stock-card` | "Thẻ kho chi tiết" | Block if no safe source |

