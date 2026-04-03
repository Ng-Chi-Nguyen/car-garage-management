## Workflows API

Nhóm API workflow nghiệp vụ theo transaction.

## Tổng quan mount route

- Đang public từ router chính (yêu cầu `Bearer token`, role `Admin|NhanVien`):
  - `GET /api/v1/workflows/intakes/resolve-vehicle`
  - `POST /api/v1/workflows/intakes`
  - `GET /api/v1/workflows/intakes/history`
  - `POST /api/v1/workflows/repair-orders`
  - `POST /api/v1/workflows/stock-receipts`

## Khi nào dùng workflow atomic vs CRUD management

Workflow atomic dùng khi cần tạo nghiệp vụ liên hoàn trong **một request + một transaction**, ví dụ tạo chứng từ header và nhiều dòng chi tiết đồng thời.

- **Repair order**
  - Workflow: `POST /api/v1/workflows/repair-orders` (tạo header + details + trừ kho + đồng bộ tổng tiền)
  - CRUD management tương ứng: `/api/v1/repair-orders` và `/api/v1/repair-order-details`
- **Stock receipt**
  - Workflow: `POST /api/v1/workflows/stock-receipts` (tạo header + details + cộng tồn kho + đồng bộ tổng tiền)
  - CRUD management tương ứng: `/api/v1/stock-receipts` và `/api/v1/stock-receipt-details`
- **Payment receipt**
  - CRUD management hiện dùng được: `/api/v1/payment-receipts`
  - Workflow atomic tương ứng chưa public (xem ghi chú cuối tài liệu)

Nếu chỉ cần thao tác từng bản ghi độc lập (tạo/sửa/xóa riêng header hoặc detail), ưu tiên dùng nhóm CRUD management.

## 1) Resolve xe theo biển số

- **Mục đích:** tra cứu mã xe trước khi lập intake.
- **Method/Path:** `GET /api/v1/workflows/intakes/resolve-vehicle`
- **Auth/role:** bắt buộc.
- **Query:** `BienSo` (string, bắt buộc).
- **Validate chính:** query schema chặt, không cho field ngoài.
- **Response thành công:** `data = { MaXe }`.
- **Lỗi thường gặp:** `404` không tìm thấy xe, `400` query invalid, `401/403` auth.
- **Nghiệp vụ:** dùng `BienSo` để lấy `MaXe` phục vụ bước tiếp nhận.

## 2) Tạo workflow tiếp nhận xe

- **Mục đích:** tiếp nhận xe và tạo phiếu sửa chữa đầu vào.
- **Method/Path:** `POST /api/v1/workflows/intakes`
- **Auth/role:** bắt buộc.
- **Request body:** hỗ trợ dạng `{"intake": {...}}` hoặc object trực tiếp:
  - `MaKH` (int > 0)
  - `MaXe` (int > 0)
  - `MaNV` (int > 0 hoặc null)
  - `NgayTiepNhan` (date hợp lệ)
  - `TrangThai` (`TiepNhan|DangXuLy|HoanTat`, default `TiepNhan`)
  - `NoiDungLoi` (bắt buộc)
  - `quickTags` (array string, optional)
  - `note` (string/null, optional)
- **Validate chính:** custom validator intake, không cho field ngoài whitelist.
- **Response thành công:** `201`, `data = { intake, history }`.
- **Lỗi thường gặp:**
  - `404` không tìm thấy xe/khách hàng hoặc xe không thuộc khách hàng
  - `400` body invalid
  - `409` conflict transaction (`P2034`)
- **Nghiệp vụ:** tạo chứng từ intake và ghi nhận lịch sử ngay trong flow.

## 3) Lịch sử workflow tiếp nhận

- **Mục đích:** lấy history intake workflow.
- **Method/Path:** `GET /api/v1/workflows/intakes/history`
- **Auth/role:** bắt buộc.
- **Request:** không body/query.
- **Response thành công:** `200`, `data` (hiện trả danh sách history, có thể rỗng).
- **Lỗi thường gặp:** `401/403`, `500`.
- **Nghiệp vụ:** phục vụ truy vết các thao tác intake workflow.

## 4) Tạo workflow phiếu sửa chữa (atomic)

- **Mục đích:** tạo header + chi tiết sửa chữa + trừ kho + đồng bộ tổng tiền trong một transaction.
- **Method/Path:** `POST /api/v1/workflows/repair-orders`
- **Auth/role:** bắt buộc.
- **Request body:**
  - `repairOrder`: `MaXe`, `MaNV`, `NgaySC`, `TrangThai`, `NoiDungLoi`, `GhiChu`
  - `details[]`: mỗi dòng gồm `MaVatTu`, `MaTienCong`, `SoLuong`, `DonGiaVatTu`, `DonGiaTienCong`
- **Validate chính:** Joi schema chặt, `details` tối thiểu 1 dòng.
- **Response thành công:** `201`, `data = { repairOrder, repairOrderDetails }`.
- **Lỗi thường gặp:**
  - `404` không tìm thấy xe/vật tư/tiền công
  - `400` tồn kho không đủ
  - `409` conflict transaction
- **Nghiệp vụ:** tự tính `ThanhTien`, không tin số tổng do client gửi.

## 5) Tạo workflow phiếu nhập kho (atomic)

- **Mục đích:** tạo phiếu nhập + chi tiết + cộng tồn kho + đồng bộ tổng tiền.
- **Method/Path:** `POST /api/v1/workflows/stock-receipts`
- **Auth/role:** bắt buộc.
- **Request body:**
  - `stockReceipt`: `MaNCC`, `NgayNhap`
  - `details[]`: `MaVatTu`, `SoLuong`, `DonGiaNhap`
- **Validate chính:** Joi schema chặt, details >= 1.
- **Response thành công:** `201`, `data = { receipt, items, totals }`.
- **Lỗi thường gặp:**
  - `404` không tìm thấy nhà cung cấp/vật tư
  - `409` conflict transaction
  - `400` body invalid
- **Nghiệp vụ:** cập nhật tồn kho ngay trong transaction và trả snapshot tồn sau nhập.

## 6) Ghi chú quan trọng: workflow phiếu thu tiền chưa public

- Trong code hiện tại có route file workflow phiếu thu tiền (`src/routes/workflows/paymentReceiptWorkflow.route.js`).
- Route này **chưa được mount vào router chính** (`src/routes/index.route.js`), nên **chưa phải public API hiện tại**.
