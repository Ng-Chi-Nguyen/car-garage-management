## Reports API

Nhóm API báo cáo và export.

## A. Tổng quan route + auth/rate limit

| Nhóm path | Auth hiện tại theo code | Rate limit |
|---|---|---|
| `/api/v1/reports/export` | Không gắn auth ở router chính | Không |
| `/api/v1/reports/customer-report/*` | Không gắn auth ở router chính | Không |
| `/api/v1/reports/revenue/*` | Có `requireAuth + requireRoles(Admin,NhanVien)` ngay trong route | Có ở endpoint non-export (`timeseries/by-car-brand/by-part/comparison/composition`) |
| `/api/v1/reports/inventory/*` | Có auth+role ngay trong route | Không |
| `/api/v1/reports/repair-report/*` | Có auth+role ngay trong route | Không |
| `/api/v1/reports/finance/*` | Có auth+role từ mount router chính | Có ở `summary` và `debtors` |

> Lưu ý: tình trạng auth phía trên phản ánh đúng code hiện tại, không phải khuyến nghị bảo mật.

## B. Query validate chung cho report date range

Nhiều endpoint dùng schema range:

- `from`, `to`: bắt buộc, format `YYYY-MM-DD`, là ngày lịch hợp lệ.
- `from` không được lớn hơn `to`.
- Một số endpoint yêu cầu thêm `granularity`: `day | month | year`.

Service xử lý range theo mốc thời gian Việt Nam (`Asia/Ho_Chi_Minh`) với `endExclusive` = hết ngày `to` + 1 ngày.

---

## C. Endpoint chi tiết

## 1) Export tất cả báo cáo

- **Mục đích:** gom nhiều báo cáo vào một file workbook tổng hợp.
- **Method/Path:** `GET /api/v1/reports/export`
- **Query:** `from`, `to`, `granularity`.
- **Xác thực/phân quyền:** hiện chưa có middleware auth ở mount route.
- **Response thành công:** file `.xlsx` (`all-statistics-report-*.xlsx`).
- **Lỗi thường gặp:** `400` query invalid, `500` lỗi xử lý report.
- **Nghiệp vụ:** chạy song song customer/dashboard/finance/inventory/repair/revenue rồi xuất nhiều sheet.

## 2) Customer Report

### 2.1 Summary

- **Method/Path:** `GET /api/v1/reports/customer-report/summary`
- **Query:** `from`, `to`, `granularity`.
- **Auth:** hiện chưa gắn ở mount route.
- **Response thành công:**
  - `data.newCustomersTimeseries`
  - `data.topRevenueCustomer`
  - `data.topDebtCustomer`
  - `data.range`
- **Lỗi thường gặp:** `400`, `500`.
- **Nghiệp vụ:** thống kê khách hàng mới, top doanh thu, top công nợ.

### 2.2 Summary Export

- **Method/Path:** `GET /api/v1/reports/customer-report/summary/export`
- **Query/Auth:** như summary.
- **Response thành công:** file `.xlsx` customer summary.

## 3) Revenue Report (10 endpoint)

### Query rule

- `timeseries`: cần `from,to,granularity`
- các endpoint còn lại: cần `from,to`

### 3.1 Timeseries

- `GET /api/v1/reports/revenue/timeseries`
- `GET /api/v1/reports/revenue/timeseries/export`
- **Auth/role:** bắt buộc.
- **Rate limit:** có ở endpoint non-export.
- **Response summary:** `data.items[{label,revenue}]`, `totalRevenue`.
- **Nghiệp vụ:** doanh thu theo thời gian từ phiếu thu `DaThu`.

### 3.2 By Car Brand

- `GET /api/v1/reports/revenue/by-car-brand`
- `GET /api/v1/reports/revenue/by-car-brand/export`
- **Auth/role:** bắt buộc.
- **Rate limit:** có ở endpoint non-export.
- **Response summary:** `items[{carBrandId,carBrandName,revenue,ratio}]`, `totalRevenue`.

### 3.3 By Part

- `GET /api/v1/reports/revenue/by-part`
- `GET /api/v1/reports/revenue/by-part/export`
- **Auth/role:** bắt buộc.
- **Rate limit:** có ở endpoint non-export.
- **Response summary:** `items[{partId,partName,revenue,ratio}]`, `totalRevenue`.

### 3.4 Comparison

- `GET /api/v1/reports/revenue/comparison`
- `GET /api/v1/reports/revenue/comparison/export`
- **Auth/role:** bắt buộc.
- **Rate limit:** có ở endpoint non-export.
- **Response summary:** `currentPeriod`, `previousPeriod`, `samePeriodLastYear`, `delta*`.

### 3.5 Composition

- `GET /api/v1/reports/revenue/composition`
- `GET /api/v1/reports/revenue/composition/export`
- **Auth/role:** bắt buộc.
- **Rate limit:** có ở endpoint non-export.
- **Response summary:** `groups` theo `carBrand`, `part`, `other`.

### Lỗi thường gặp nhóm Revenue

- `400` query date invalid
- `401/403` auth/role
- `429` vượt rate limit (endpoint non-export)
- `500` lỗi tổng hợp dữ liệu

## 4) Inventory Report

### 4.1 Summary

- **Method/Path:** `GET /api/v1/reports/inventory/summary`
- **Query:** `from`, `to`
- **Auth/role:** bắt buộc.
- **Response thành công:**
  - `stockMovement` (totals + items)
  - `mostUsedParts`
  - `lowStockParts`
  - `currentInventoryValue`
  - `topSupplier`
- **Nghiệp vụ:** tính tồn đầu/nhập/xuất/tồn cuối từ chi tiết nhập và chi tiết sửa chữa.

### 4.2 Summary Export

- **Method/Path:** `GET /api/v1/reports/inventory/summary/export`
- **Query/Auth:** như summary.
- **Response thành công:** file `.xlsx` inventory summary.

## 5) Repair Report

### 5.1 Summary

- **Method/Path:** `GET /api/v1/reports/repair-report/summary`
- **Query:** `from`, `to`, `granularity`
- **Auth/role:** bắt buộc.
- **Response thành công:**
  - `timeseries`
  - `statusBreakdown`
  - `topTechnician`
- **Nghiệp vụ:** thống kê theo trạng thái phiếu sửa và kỹ thuật viên nổi bật.

### 5.2 Summary Export

- **Method/Path:** `GET /api/v1/reports/repair-report/summary/export`
- **Query/Auth:** như summary.
- **Response thành công:** file `.xlsx` repair summary.

## 6) Finance Report

### 6.1 Summary

- **Method/Path:** `GET /api/v1/reports/finance/summary`
- **Query:** `from`, `to`, `granularity`
- **Auth/role:** bắt buộc (được gắn từ mount router chính).
- **Rate limit:** có.
- **Response thành công:**
  - `totalOutstandingDebt`
  - `collectedAmountTimeseries`
  - `newDebtInCurrentMonth`
  - `range`

### 6.2 Summary Export

- **Method/Path:** `GET /api/v1/reports/finance/summary/export`
- **Query:** như summary.
- **Auth/role:** vẫn bắt buộc do mount route.
- **Rate limit:** không gắn ở endpoint export.
- **Response thành công:** file `.xlsx`.

### 6.3 Debtors

- **Method/Path:** `GET /api/v1/reports/finance/debtors`
- **Query:**
  - `page` (default 1), `limit` (default 10)
  - `search` (optional)
  - `groupBy`: `vehicle|customer` (default `vehicle`)
- **Auth/role:** bắt buộc (mount route).
- **Rate limit:** có.
- **Response thành công:** `data = { items, pagination }`.
- **Nghiệp vụ:** hỗ trợ gom nợ theo xe hoặc theo khách hàng.

### 6.4 Debtors Export

- **Method/Path:** `GET /api/v1/reports/finance/debtors/export`
- **Query:** như debtors.
- **Auth/role:** bắt buộc (mount route).
- **Rate limit:** không gắn ở endpoint export.
- **Response thành công:** file `.xlsx`.

---

## D. Lỗi thường gặp toàn nhóm Reports

- `400` lỗi validation query (`from/to/granularity/page/limit/groupBy...`)
- `401/403` thiếu auth/quyền trên các route có bảo vệ
- `429` vượt rate limit ở dashboard/revenue/finance non-export
- `500` lỗi tổng hợp dữ liệu hoặc xuất file
