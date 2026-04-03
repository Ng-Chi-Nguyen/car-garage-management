## Dashboard API

Nhóm API dashboard doanh thu nội bộ.

- Prefix: `/api/v1/dashboard`
- Auth/role: bắt buộc `requireAuth + requireRoles([Admin, NhanVien])`.
- Rate limit: áp dụng ở nhóm dashboard (mặc định 60 req/phút, cửa sổ 60s).

## 1) Lấy tổng quan doanh thu dashboard

- **Mục đích:** trả số liệu KPI dashboard + cảnh báo nhanh.
- **Method/Path:** `GET /api/v1/dashboard/revenue-summary`
- **Request:** không có query/body (schema query rỗng).
- **Validate chính:** không cho query key ngoài schema.
- **Response thành công:**
  - `data.summary = { todayRevenue, weekRevenue, monthRevenue, todayReceivedVehicles, activeRepairOrders, totalCollectedAmount, totalOutstandingDebt, lowStockPartsCount }`
  - `data.alerts[] = { code, severity, title, message }`
- **Lỗi thường gặp:**
  - `401/403` auth/role
  - `429` vượt rate limit
  - `500` lỗi xử lý
- **Nghiệp vụ:**
  - doanh thu tính từ `pHIEU_THU_TIEN` trạng thái `DaThu`
  - cảnh báo dựa trên số xe/ngày, công nợ cao, tồn kho thấp.

## 2) Export tổng quan doanh thu dashboard

- **Mục đích:** xuất file `.xlsx` cho dashboard revenue summary.
- **Method/Path:** `GET /api/v1/dashboard/revenue-summary/export`
- **Request:** query rỗng.
- **Validate chính:** như endpoint summary.
- **Response thành công:** file `.xlsx` binary.
- **Lỗi thường gặp:** `401/403`, `429`, `500`.
- **Nghiệp vụ:** dữ liệu export lấy qua `reportExportService.exportDashboardRevenueSummary`.
