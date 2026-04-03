## Activity API

Nhóm API nhật ký hoạt động nội bộ.

- Prefix: `/api/v1/activity`
- Auth/role: bắt buộc `requireAuth + requireRoles([Admin, NhanVien])` từ router chính.

## 1) Lấy danh sách hoạt động

- **Mục đích:** trả activity log có phân trang + filter.
- **Method/Path:** `GET /api/v1/activity/logs`
- **Query:**
  - `period`: `today | 7days | 30days | all` (default `today`)
  - `user`: string (default `all`)
  - `actionType`: string (default `all`)
  - `status`: `all | success | warning | error` (default `all`)
  - `search`: string (default rỗng)
  - `fromDate`, `toDate`: ISO date (optional)
  - `page` (>=1, default 1), `limit` (1..100, default 10)
- **Validate chính:** query schema chặt, không cho unknown.
- **Response thành công:**
  - `data.activityLogs[]`
  - `data.pagination`
  - `data.filters` (bao gồm `userOptions/actionTypeOptions/statusOptions`)
- **Lỗi thường gặp:**
  - `400` query invalid
  - `401/403` thiếu auth/role
  - `503` timeout pool DB
- **Nghiệp vụ:** log được tổng hợp từ phiếu sửa, phiếu thu, phiếu nhập và cập nhật khách hàng.

## 2) Lấy thống kê hoạt động

- **Mục đích:** trả KPI tổng quan hành động.
- **Method/Path:** `GET /api/v1/activity/stats`
- **Query:** giống `/logs` (không có phân trang trong schema gốc).
- **Validate chính:** query schema chặt.
- **Response thành công:**
  - `data.activityStats = { totalActions, trend, activeUsers, errors, successRate }`
- **Lỗi thường gặp:** như endpoint `/logs`.
- **Nghiệp vụ:** service tái sử dụng dữ liệu logs để tính thống kê.
