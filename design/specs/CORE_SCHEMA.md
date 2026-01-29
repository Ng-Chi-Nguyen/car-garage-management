# CORE_SCHEMA.md - Hệ Thống Quản Lý Gara Ô Tô

Tài liệu này định nghĩa cấu trúc cơ sở dữ liệu, các biểu mẫu nghiệp vụ và các quy định logic cho phần mềm Quản lý Gara Ô tô.

---

## 1. Cơ sở dữ liệu (Database Schema)

Hệ thống bao gồm 13 bảng dữ liệu chính để quản lý toàn bộ quy trình từ tiếp nhận đến báo cáo.

### 1.1. Danh mục và Cấu hình
- **CAR_BRANDS (Hiệu xe)**
  - `brand_id` (INT, PK): Mã hiệu xe.
  - `brand_name` (VARCHAR): Tên hiệu xe (Toyota, Honda, ...).
- **LABOR_FEES (Tiền công)**
  - `labor_id` (INT, PK): Mã loại tiền công.
  - `labor_name` (VARCHAR): Nội dung tiền công.
  - `price` (DECIMAL): Đơn giá tiền công định mức.
- **PARAMETERS (Tham số)**
  - `param_key` (VARCHAR, PK): Tên tham số (VD: 'MAX_CARS_RECEIVE').
  - `param_value` (INT): Giá trị tham số.
- **USERS (Người dùng)**
  - `user_id` (INT, PK): Mã người dùng.
  - `username` (VARCHAR): Tên đăng nhập.
  - `password` (VARCHAR): Mật khẩu băm.
  - `role` (VARCHAR): Quyền hạn (Admin, Staff).

### 1.2. Khách hàng và Xe
- **CUSTOMERS (Khách hàng)**
  - `customer_id` (INT, PK): Mã khách hàng.
  - `full_name` (VARCHAR): Họ tên chủ xe.
  - `phone` (VARCHAR): Số điện thoại.
  - `address` (VARCHAR): Địa chỉ.
- **CARS (Xe)**
  - `license_plate` (VARCHAR, PK): Biển số xe.
  - `brand_id` (INT, FK): Liên kết bảng CAR_BRANDS.
  - `customer_id` (INT, FK): Liên kết bảng CUSTOMERS.
  - `current_debt` (DECIMAL): Số tiền khách đang nợ của xe này.

### 1.3. Kho hàng (Vật tư phụ tùng)
- **SUPPLIERS (Nhà cung cấp)**
  - `supplier_id` (INT, PK): Mã nhà cung cấp.
  - `supplier_name` (VARCHAR): Tên nhà cung cấp.
  - `phone` (VARCHAR), `address` (VARCHAR): Thông tin liên hệ.
- **SUPPLIES (Vật tư/Phụ tùng)**
  - `supply_id` (INT, PK): Mã vật tư.
  - `supply_name` (VARCHAR): Tên vật tư.
  - `unit` (VARCHAR): Đơn vị tính.
  - `stock_qty` (INT): Số lượng tồn kho hiện tại.
  - `import_price` (DECIMAL): Giá vốn nhập gần nhất.
  - `sell_price` (DECIMAL): Giá bán niêm yết.

### 1.4. Nghiệp vụ (Giao dịch)
- **SERVICE_TICKETS (Phiếu sửa chữa)**
  - `ticket_id` (INT, PK): Số phiếu sửa chữa.
  - `license_plate` (VARCHAR, FK): Liên kết bảng CARS.
  - `service_date` (DATETIME): Ngày lập phiếu.
  - `status` (VARCHAR): Trạng thái (Chờ, Đang làm, Hoàn thành).
  - `total_amount` (DECIMAL): Tổng tiền sửa chữa.
- **TICKET_DETAILS (Chi tiết phiếu sửa chữa)**
  - `detail_id` (INT, PK): Mã chi tiết.
  - `ticket_id` (INT, FK): Liên kết bảng SERVICE_TICKETS.
  - `supply_id` (INT, FK): Liên kết bảng SUPPLIES (Có thể null nếu chỉ có tiền công).
  - `labor_id` (INT, FK): Liên kết bảng LABOR_FEES (Có thể null nếu chỉ có vật tư).
  - `quantity` (INT): Số lượng vật tư sử dụng.
  - `supply_price` (DECIMAL): Giá vật tư tại thời điểm sửa (**Snapshot**).
  - `labor_price` (DECIMAL): Giá tiền công tại thời điểm sửa (**Snapshot**).
  - `total_price` (DECIMAL): Thành tiền của dòng chi tiết.
- **IMPORTS (Phiếu nhập kho)**
  - `import_id` (INT, PK): Số phiếu nhập.
  - `supplier_id` (INT, FK): Liên kết bảng SUPPLIERS.
  - `import_date` (DATETIME): Ngày nhập hàng.
  - `total_amount` (DECIMAL): Tổng giá trị lô hàng.
- **IMPORT_DETAILS (Chi tiết phiếu nhập)**
  - `detail_id` (INT, PK): Mã chi tiết nhập.
  - `import_id` (INT, FK): Liên kết bảng IMPORTS.
  - `supply_id` (INT, FK): Liên kết bảng SUPPLIES.
  - `quantity` (INT): Số lượng nhập.
  - `import_price` (DECIMAL): Đơn giá nhập.
- **PAYMENTS (Phiếu thu tiền)**
  - `payment_id` (INT, PK): Số phiếu thu.
  - `license_plate` (VARCHAR, FK): Liên kết bảng CARS.
  - `payment_date` (DATETIME): Ngày thu tiền.
  - `amount` (DECIMAL): Số tiền thu.

---

## 2. Biểu mẫu (Forms - BM)

### BM1: Phiếu Tiếp Nhận Xe
- **Thông tin:** Tên chủ xe, Điện thoại, Địa chỉ, Biển số xe, Hiệu xe, Ngày tiếp nhận.
- **Mục tiêu:** Ghi nhận xe vào gara và kiểm tra giới hạn tiếp nhận.

### BM2: Phiếu Sửa Chữa
- **Header:** Biển số, Ngày sửa chữa.
- **Lưới dữ liệu (Grid):** Nội dung (Vật tư/Tiền công), Số lượng, Đơn giá, Thành tiền.
- **Footer:** Tổng cộng tiền của phiếu.

### BM3: Phiếu Nhập Kho
- **Thông tin:** Nhà cung cấp, Ngày nhập.
- **Lưới dữ liệu:** Tên vật tư, Số lượng nhập, Đơn giá nhập, Thành tiền.

### BM4: Phiếu Thu Tiền
- **Thông tin:** Tên chủ xe (hoặc Biển số), Điện thoại, Ngày thu tiền, Số tiền thu.
- **Hiển thị thêm:** Số tiền đang nợ (Lấy từ `CARS.current_debt`).

### BM5.1: Báo Cáo Doanh Số
- **Cột:** STT, Hiệu xe, Số lượt sửa, Thành tiền, Tỉ lệ (%).
- **Phạm vi:** Theo tháng/năm.

### BM5.2: Báo Cáo Tồn Kho
- **Cột:** Tên vật tư, Tồn đầu, Phát sinh (Nhập/Xuất), Tồn cuối.
- **Phạm vi:** Theo tháng/năm.

### BM5.3: Báo Cáo Công Nợ
- **Cột:** STT, Tên khách hàng, Biển số xe, Nợ đầu, Phát sinh, Nợ cuối.
- **Lưu ý:** Thường chỉ liệt kê các xe có nợ (`current_debt > 0`).

---

## 3. Quy định (Business Rules - QĐ)

Hệ thống áp dụng các quy định logic sau để đảm bảo tính nhất quán của dữ liệu:

### QĐ1: Tiếp nhận xe
- Hệ thống chỉ tiếp nhận xe khi số xe đã tiếp nhận trong ngày chưa vượt quá tham số cấu hình.
- **Công thức:** `Count(SERVICE_TICKETS WHERE Date(service_date) = Today) <= PARAMETERS['MAX_CARS_RECEIVE']`.

### QĐ2: Đơn giá và Snapshot
- Khi lập phiếu sửa chữa, đơn giá vật tư và tiền công phải được lưu trực tiếp vào bảng chi tiết để không bị thay đổi khi giá danh mục cập nhật sau này.
- **Công thức:** `TicketDetail.supply_price = SUPPLIES.sell_price` (tại thời điểm lưu).
- **Thành tiền:** `total_price = (quantity * supply_price) + labor_price`.

### QĐ3: Quản lý kho
- Khi lưu phiếu nhập kho, hệ thống tự động cập nhật số lượng tồn và đơn giá nhập mới nhất cho vật tư.
- **Cập nhật tồn:** `SUPPLIES.stock_qty += IMPORT_DETAILS.quantity`.
- **Cập nhật giá:** `SUPPLIES.import_price = IMPORT_DETAILS.import_price`.

### QĐ4: Thu tiền và Công nợ
- Số tiền thu không được vượt quá số tiền khách hàng đang nợ cho xe đó.
- **Kiểm tra:** `Payment.amount <= CARS.current_debt`.
- **Cập nhật nợ:** `CARS.current_debt -= Payment.amount`.

### QĐ6: Quản trị và Thay đổi quy định
- Chỉ người dùng có quyền **Admin** mới được phép thay đổi các tham số hệ thống (Số xe tối đa, Danh mục Hiệu xe, Danh mục Tiền công).

---
*Tài liệu được trích xuất dựa trên hồ sơ Đặc tả phần mềm Quản lý Gara Ô tô.*
