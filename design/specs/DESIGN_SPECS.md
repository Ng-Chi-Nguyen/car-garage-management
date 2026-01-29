# CORE_SCHEMA.md - Hệ thống Quản lý Gara Ô tô

Tài liệu này định nghĩa cấu trúc cơ sở dữ liệu, các biểu mẫu nghiệp vụ và các quy định logic cho phần mềm Quản lý Gara Ô tô.

---

## 1. Sơ đồ Cơ sở dữ liệu (Database Schema)

Hệ thống bao gồm 13 bảng dữ liệu chính để quản lý toàn bộ quy trình từ tiếp nhận đến báo cáo. Các tên bảng và tên cột được giữ bằng tiếng Anh để đồng nhất với mã nguồn, kèm theo giải thích bằng tiếng Việt.

### 1.1. Danh mục và Cấu hình
- **CAR_BRANDS (Hiệu xe)**
  - `brand_id` (INT, PK): Mã định danh hiệu xe (Khóa chính).
  - `brand_name` (VARCHAR): Tên hiệu xe (Ví dụ: Toyota, Honda, ...).
- **LABOR_FEES (Tiền công)**
  - `labor_id` (INT, PK): Mã định danh loại tiền công (Khóa chính).
  - `labor_name` (VARCHAR): Tên hoặc nội dung công việc sửa chữa.
  - `price` (DECIMAL): Đơn giá tiền công định mức cho công việc đó.
- **PARAMETERS (Tham số)**
  - `param_key` (VARCHAR, PK): Tên tham số cấu hình (Ví dụ: 'MAX_CARS_RECEIVE').
  - `param_value` (INT): Giá trị của tham số tương ứng.
- **USERS (Người dùng)**
  - `user_id` (INT, PK): Mã định danh người dùng.
  - `username` (VARCHAR): Tên đăng nhập vào hệ thống.
  - `password` (VARCHAR): Mật khẩu (đã được băm bảo mật).
  - `role` (VARCHAR): Quyền hạn của người dùng (Admin, Staff).

### 1.2. Khách hàng và Xe
- **CUSTOMERS (Khách hàng)**
  - `customer_id` (INT, PK): Mã định danh khách hàng.
  - `full_name` (VARCHAR): Họ và tên chủ xe.
  - `phone` (VARCHAR): Số điện thoại liên lạc.
  - `address` (VARCHAR): Địa chỉ thường trú.
- **CARS (Xe)**
  - `license_plate` (VARCHAR, PK): Biển số xe (Khóa chính).
  - `brand_id` (INT, FK): Mã hiệu xe (Khóa ngoại, liên kết bảng CAR_BRANDS).
  - `customer_id` (INT, FK): Mã khách hàng (Khóa ngoại, liên kết bảng CUSTOMERS).
  - `current_debt` (DECIMAL): Số tiền khách hàng hiện đang nợ tính riêng cho xe này.

### 1.3. Kho hàng (Vật tư phụ tùng)
- **SUPPLIERS (Nhà cung cấp)**
  - `supplier_id` (INT, PK): Mã định danh nhà cung cấp.
  - `supplier_name` (VARCHAR): Tên đơn vị cung cấp vật tư.
  - `phone` (VARCHAR), `address` (VARCHAR): Thông tin liên hệ của nhà cung cấp.
- **SUPPLIES (Vật tư/Phụ tùng)**
  - `supply_id` (INT, PK): Mã định danh vật tư.
  - `supply_name` (VARCHAR): Tên loại vật tư, phụ tùng.
  - `unit` (VARCHAR): Đơn vị tính (Ví dụ: Cái, Lít, Bộ, ...).
  - `stock_qty` (INT): Số lượng tồn kho hiện tại trong gara.
  - `import_price` (DECIMAL): Giá vốn nhập vào ở lô hàng gần nhất.
  - `sell_price` (DECIMAL): Giá bán niêm yết cho khách hàng.

### 1.4. Nghiệp vụ (Giao dịch)
- **SERVICE_TICKETS (Phiếu sửa chữa)**
  - `ticket_id` (INT, PK): Số phiếu sửa chữa (Tự động tăng).
  - `license_plate` (VARCHAR, FK): Biển số xe được sửa chữa (Khóa ngoại, liên kết bảng CARS).
  - `service_date` (DATETIME): Ngày và giờ lập phiếu sửa chữa.
  - `status` (VARCHAR): Trạng thái phiếu (Chờ, Đang làm, Hoàn thành).
  - `total_amount` (DECIMAL): Tổng tiền sửa chữa của cả phiếu.
- **TICKET_DETAILS (Chi tiết phiếu sửa chữa)**
  - `detail_id` (INT, PK): Mã định danh chi tiết dòng phiếu.
  - `ticket_id` (INT, FK): Liên kết với phiếu sửa chữa chính (Khóa ngoại).
  - `supply_id` (INT, FK): Mã vật tư được sử dụng (Có thể để trống nếu chỉ tính tiền công).
  - `labor_id` (INT, FK): Mã loại tiền công thực hiện (Có thể để trống nếu chỉ tính vật tư).
  - `quantity` (INT): Số lượng vật tư đã sử dụng.
  - `supply_price` (DECIMAL): Giá vật tư tại thời điểm lập phiếu (**Lưu bản sao - Snapshot**).
  - `labor_price` (DECIMAL): Giá tiền công tại thời điểm lập phiếu (**Lưu bản sao - Snapshot**).
  - `total_price` (DECIMAL): Thành tiền của dòng chi tiết này.
- **IMPORTS (Phiếu nhập kho)**
  - `import_id` (INT, PK): Số phiếu nhập hàng.
  - `supplier_id` (INT, FK): Nhà cung cấp của lô hàng (Khóa ngoại).
  - `import_date` (DATETIME): Ngày và giờ nhập hàng vào kho.
  - `total_amount` (DECIMAL): Tổng giá trị của toàn bộ lô hàng nhập.
- **IMPORT_DETAILS (Chi tiết phiếu nhập)**
  - `detail_id` (INT, PK): Mã định danh chi tiết dòng nhập.
  - `import_id` (INT, FK): Liên kết với phiếu nhập chính (Khóa ngoại).
  - `supply_id` (INT, FK): Mã vật tư được nhập (Khóa ngoại).
  - `quantity` (INT): Số lượng nhập của loại vật tư này.
  - `import_price` (DECIMAL): Đơn giá nhập của loại vật tư này trong lô hàng.
- **PAYMENTS (Phiếu thu tiền)**
  - `payment_id` (INT, PK): Số phiếu thu tiền.
  - `license_plate` (VARCHAR, FK): Biển số xe thực hiện thanh toán (Khóa ngoại).
  - `payment_date` (DATETIME): Ngày và giờ thực hiện thu tiền.
  - `amount` (DECIMAL): Số tiền thực tế thu được từ khách hàng.

---

## 2. Biểu mẫu (Forms - BM)

### BM1: Phiếu Tiếp Nhận Xe
- **Thông tin bao gồm:** Tên chủ xe, Điện thoại, Địa chỉ, Biển số xe, Hiệu xe, Ngày tiếp nhận.
- **Mục tiêu:** Ghi nhận xe vào gara và kiểm tra các giới hạn tiếp nhận theo quy định.

### BM2: Phiếu Sửa Chữa
- **Phần đầu (Header):** Biển số xe, Ngày sửa chữa.
- **Lưới dữ liệu (Grid):** Nội dung (Vật tư/Tiền công), Số lượng, Đơn giá, Thành tiền.
- **Phần cuối (Footer):** Tổng cộng tiền thanh toán của toàn bộ phiếu.

### BM3: Phiếu Nhập Kho
- **Thông tin chung:** Tên nhà cung cấp, Ngày thực hiện nhập hàng.
- **Lưới dữ liệu:** Tên vật tư, Số lượng nhập, Đơn giá nhập, Thành tiền từng loại.

### BM4: Phiếu Thu Tiền
- **Thông tin chính:** Tên chủ xe (hoặc Biển số), Điện thoại, Ngày thu tiền, Số tiền thu.
- **Thông tin bổ trợ:** Hiển thị số tiền khách đang nợ (Lấy dữ liệu từ trường `CARS.current_debt`).

### BM5.1: Báo Cáo Doanh Số
- **Các cột:** Số thứ tự (STT), Hiệu xe, Số lượt sửa, Thành tiền, Tỉ lệ (%).
- **Phạm vi báo cáo:** Thống kê theo Tháng/Năm được chọn.

### BM5.2: Báo Cáo Tồn Kho
- **Các cột:** Tên vật tư, Tồn đầu kỳ, Phát sinh (Nhập/Xuất), Tồn cuối kỳ.
- **Phạm vi báo cáo:** Thống kê theo Tháng/Năm được chọn.

### BM5.3: Báo Cáo Công Nợ
- **Các cột:** Số thứ tự (STT), Tên khách hàng, Biển số xe, Nợ đầu kỳ, Phát sinh nợ, Nợ cuối kỳ.
- **Lưu ý:** Hệ thống thường chỉ liệt kê các xe hiện đang có dư nợ (`current_debt > 0`).

---

## 3. Quy định Nghiệp vụ (Business Rules - QĐ)

Hệ thống áp dụng các quy định logic sau để đảm bảo tính nhất quán và chính xác của dữ liệu:

### QĐ1: Tiếp nhận xe
- Hệ thống chỉ cho phép tiếp nhận xe mới nếu tổng số xe đã tiếp nhận trong ngày hiện tại chưa vượt quá giới hạn đã cấu hình trong tham số hệ thống.
- **Công thức kiểm tra:** `Số lượng (SERVICE_TICKETS có Ngày lập = Hôm nay) <= Tham số['MAX_CARS_RECEIVE']`.

### QĐ2: Đơn giá và Lưu trữ Bản sao (Snapshot)
- Khi lập phiếu sửa chữa, đơn giá vật tư và tiền công phải được sao chép và lưu trực tiếp vào bảng chi tiết. Điều này giúp giá trị hóa đơn không bị thay đổi nếu sau này người quản lý cập nhật lại bảng giá danh mục.
- **Gán giá:** `ChiTiếtPhiếu.supply_price = VẬT_TƯ.sell_price` (tại thời điểm lưu).
- **Thành tiền:** `total_price = (số lượng * đơn giá vật tư) + đơn giá tiền công`.

### QĐ3: Quản lý kho hàng
- Khi lưu phiếu nhập kho hoàn tất, hệ thống tự động cập nhật số lượng tồn kho và cập nhật đơn giá nhập mới nhất cho loại vật tư đó.
- **Cập nhật tồn:** `VẬT_TƯ.stock_qty += ChiTiếtNhập.quantity`.
- **Cập nhật giá nhập:** `VẬT_TƯ.import_price = ChiTiếtNhập.import_price`.

### QĐ4: Thu tiền và Quản lý Công nợ
- Số tiền thu trên phiếu thu không được vượt quá số tiền mà khách hàng đang nợ tính cho chiếc xe đó.
- **Kiểm tra hợp lệ:** `Số tiền thu <= CARS.current_debt`.
- **Cập nhật dư nợ:** `CARS.current_debt -= Số tiền thu`.

### QĐ6: Quyền Quản trị và Thay đổi quy định
- Chỉ những người dùng có quyền **Admin** mới được phép truy cập và thay đổi các tham số cấu hình của hệ thống (Ví dụ: Số xe tiếp nhận tối đa, Danh mục Hiệu xe, Danh mục Tiền công).

---
*Tài liệu này được biên soạn dựa trên hồ sơ Đặc tả Nghiệp vụ của Hệ thống Quản lý Gara Ô tô.*

---

# Đặc tả Module Admin

Tài liệu này quy định các yêu cầu chức năng và quy trình nghiệp vụ cho Module Quản trị (Admin) trong Hệ thống Quản lý Gara Ô tô.

---

## 1. Đăng nhập (Login)
### 1.1 Đặc tả chức năng
- **Tên chức năng:** Đăng nhập
- **Trigger:** Người dùng mở ứng dụng hoặc chọn "Đăng xuất".
- **Input:** Tên đăng nhập (`username`), Mật khẩu (`password`).
- **Output:**
    - Thành công: Chuyển hướng đến Dashboard, tạo phiên làm việc (session/token) với thông tin vai trò (`role`).
    - Thất bại: Thông báo lỗi "Tên đăng nhập hoặc mật khẩu không đúng".
- **Quy định liên quan:**
    - Mật khẩu phải được mã hóa khi so sánh với cơ sở dữ liệu.
    - Phân quyền truy cập dựa trên vai trò (`role`) của người dùng trong bảng `USERS`.

### 1.2 Use Case Description
- **Tác nhân:** Nhân viên, Quản trị viên.
- **Tiền điều kiện:** Người dùng phải có tài khoản đã được cấp trong hệ thống.
- **Luồng chính:**
    1. Người dùng nhập `username` và `password`.
    2. Người dùng nhấn nút "Đăng nhập".
    3. Hệ thống kiểm tra thông tin đăng nhập trong bảng `USERS`.
    4. Hệ thống xác định vai trò (`role`) của người dùng (Admin hoặc Staff).
    5. Hệ thống chuyển hướng người dùng đến giao diện tương ứng.
- **Luồng phụ:**
    - *Sai thông tin:* Nếu tên đăng nhập hoặc mật khẩu không khớp, hệ thống hiển thị thông báo lỗi và giữ người dùng tại trang đăng nhập.

---

## 2. Quản lý Hiệu xe (Car Brand Management)
### 2.1 Đặc tả chức năng
- **Tên chức năng:** Quản lý Hiệu xe (Thêm, Xóa, Sửa)
- **Trigger:** Quản trị viên chọn "Quản lý Hiệu xe" từ menu điều hướng.
- **Input:** Tên hiệu xe (`brand_name`).
- **Output:** Danh sách hiệu xe trong bảng `CAR_BRANDS` được cập nhật.
- **Quy định liên quan:**
    - **QĐ6:** Chỉ Quản trị viên mới có quyền thực hiện chức năng này.
    - Tên hiệu xe không được để trống và không được trùng lặp.
    - Không được xóa hiệu xe đang có dữ liệu liên kết trong hệ thống (ví dụ: đang có xe thuộc hiệu xe này trong danh sách tiếp nhận).

### 2.2 Use Case Description
- **Tác nhân:** Quản trị viên.
- **Tiền điều kiện:** Quản trị viên đã đăng nhập thành công.
- **Luồng chính:**
    - **Thêm hiệu xe:**
        1. Quản trị viên nhấn nút "Thêm mới".
        2. Nhập tên hiệu xe mới.
        3. Hệ thống kiểm tra tính duy nhất và lưu vào cơ sở dữ liệu.
    - **Sửa hiệu xe:**
        1. Quản trị viên chọn hiệu xe cần chỉnh sửa.
        2. Cập nhật tên mới cho hiệu xe.
        3. Hệ thống kiểm tra tính hợp lệ và cập nhật lại thông tin.
    - **Xóa hiệu xe:**
        1. Quản trị viên chọn hiệu xe muốn xóa.
        2. Hệ thống kiểm tra xem có xe nào đang sử dụng hiệu xe này không.
        3. Nếu không có ràng buộc, hệ thống thực hiện xóa hiệu xe.
- **Luồng phụ:**
    - *Trùng tên:* Hệ thống thông báo "Hiệu xe này đã tồn tại trong hệ thống".
    - *Vi phạm ràng buộc:* Hệ thống thông báo "Không thể xóa hiệu xe này vì đang có dữ liệu liên quan".

---

## 3. Quản lý Tiền công (Labor Charge Management)
### 3.1 Đặc tả chức năng
- **Tên chức năng:** Quản lý Tiền công (Thêm, Xóa, Sửa)
- **Trigger:** Quản trị viên chọn "Quản lý Tiền công" từ menu.
- **Input:** Nội dung tiền công (`labor_name`), Đơn giá (`price`).
- **Output:** Bảng `LABOR_FEES` được cập nhật thông tin mới nhất.
- **Quy định liên quan:**
    - **QĐ6:** Chỉ Quản trị viên mới có quyền thực hiện.
    - Đơn giá tiền công phải là số nguyên dương hoặc bằng 0 (>= 0).

### 3.2 Use Case Description
- **Tác nhân:** Quản trị viên.
- **Tiền điều kiện:** Quản trị viên đã đăng nhập thành công.
- **Luồng chính:**
    - **Thêm loại tiền công:**
        1. Quản trị viên chọn "Thêm tiền công".
        2. Nhập nội dung công việc và đơn giá.
        3. Hệ thống kiểm tra và lưu vào bảng `LABOR_FEES`.
    - **Sửa loại tiền công:**
        1. Quản trị viên chọn loại tiền công cần thay đổi.
        2. Chỉnh sửa nội dung hoặc đơn giá.
        3. Hệ thống cập nhật thông tin mới.
    - **Xóa loại tiền công:**
        1. Quản trị viên chọn loại tiền công cần xóa.
        2. Hệ thống thực hiện xóa nếu không có phiếu sửa chữa nào đang tham chiếu đến loại tiền công này.
- **Luồng phụ:**
    - *Dữ liệu không hợp lệ:* Nếu giá tiền nhỏ hơn 0, hệ thống báo lỗi "Giá tiền công không hợp lệ".

---

## 4. Quản lý Nhân viên (User/Staff Management)
### 4.1 Đặc tả chức năng
- **Tên chức năng:** Quản lý Nhân viên (Thêm, Xóa, Sửa)
- **Trigger:** Quản trị viên chọn "Quản lý Người dùng/Nhân viên" từ menu Admin.
- **Input:** Tên đăng nhập (`username`), Mật khẩu (`password`), Vai trò (`role`).
- **Output:** Danh sách người dùng trong bảng `USERS` được cập nhật.
- **Quy định liên quan:**
    - **QĐ6:** Chỉ Quản trị viên mới có quyền quản lý tài khoản nhân viên.
    - `username` phải là duy nhất trong toàn hệ thống.
    - Mật khẩu khi lưu phải được băm (hash) để đảm bảo bảo mật.

### 4.2 Use Case Description
- **Tác nhân:** Quản trị viên.
- **Tiền điều kiện:** Quản trị viên đã đăng nhập thành công.
- **Luồng chính:**
    - **Thêm nhân viên mới:**
        1. Quản trị viên nhấn "Thêm tài khoản".
        2. Nhập `username`, `password` và chọn `role` (Admin/Staff).
        3. Hệ thống kiểm tra tính duy nhất của `username` và lưu tài khoản.
    - **Chỉnh sửa nhân viên:**
        1. Quản trị viên chọn tài khoản cần sửa.
        2. Có thể đổi mật khẩu mới hoặc thay đổi vai trò của nhân viên.
        3. Hệ thống lưu các thay đổi.
    - **Xóa nhân viên:**
        1. Quản trị viên chọn tài khoản muốn xóa.
        2. Hệ thống xác nhận và xóa tài khoản khỏi bảng `USERS`.
- **Luồng phụ:**
    - *Trùng tên đăng nhập:* Hệ thống báo "Tên đăng nhập đã tồn tại, vui lòng chọn tên khác".

---

## 5. Thay đổi quy định (Regulation Change - QĐ6)
### 5.1 Đặc tả chức năng
- **Tên chức năng:** Thay đổi quy định (Số lượng xe tối đa)
- **Trigger:** Quản trị viên truy cập vào mục "Cấu hình hệ thống" hoặc "Thay đổi quy định".
- **Input:** Giá trị mới cho số lượng xe tiếp nhận tối đa (`MAX_CARS_RECEIVE`).
- **Output:** Giá trị mới được cập nhật vào bảng `PARAMETERS`.
- **Quy định liên quan:**
    - **QĐ6:** Chỉ Quản trị viên có quyền thay đổi các tham số hệ thống.
    - **QĐ1:** Tham số này trực tiếp giới hạn số lượng xe tối đa mà hệ thống cho phép tiếp nhận trong một ngày.
    - Giá trị nhập vào phải là số nguyên lớn hơn hoặc bằng 1.

### 5.2 Use Case Description
- **Tác nhân:** Quản trị viên.
- **Tiền điều kiện:** Quản trị viên đã đăng nhập.
- **Luồng chính:**
    1. Quản trị viên vào trang Cấu hình.
    2. Hệ thống hiển thị số lượng xe tiếp nhận tối đa hiện tại (lấy từ bảng `PARAMETERS`).
    3. Quản trị viên nhập con số mới (ví dụ: từ 30 lên 50).
    4. Quản trị viên nhấn "Lưu thay đổi".
    5. Hệ thống cập nhật bảng `PARAMETERS` với khóa `param_key = 'MAX_CARS_RECEIVE'`.
- **Luồng phụ:**
    - *Dữ liệu không hợp lệ:* Nếu giá trị nhập vào không phải là số nguyên dương, hệ thống hiển thị thông báo "Dữ liệu nhập vào không hợp lệ".
- **Hậu điều kiện:** Quy định mới về số lượng xe tối đa sẽ có hiệu lực ngay lập tức cho quy trình tiếp nhận xe.

---

# Đặc tả Module Tiếp nhận xe

## 1. Tiếp nhận xe (Check-in)

### Đặc tả
- **Tên chức năng**: Tiếp nhận xe
- **Mô tả**: Ghi lại thông tin khách hàng và xe khi đến sửa chữa tại gara.
- **Trigger**: Nhân viên tiếp nhận chọn chức năng "Tiếp nhận xe mới" trên giao diện.
- **Input**: 
    - Biển số xe (Bắt buộc)
    - Hiệu xe (Chọn từ danh sách có sẵn)
    - Tên chủ xe (Bắt buộc)
    - Địa chỉ (Bắt buộc)
    - Điện thoại (Bắt buộc)
    - Ngày tiếp nhận (Mặc định là ngày hiện tại)
- **Output**: 
    - Thông tin xe được lưu vào cơ sở dữ liệu.
    - Hiển thị thông báo "Tiếp nhận xe thành công".
- **Quy định liên quan**: 
    - **QĐ1**: Số xe tiếp nhận tối đa trong một ngày không vượt quá 30 xe. Hệ thống phải tự động kiểm tra điều kiện này trước khi lưu.

### Use Case: Tiếp nhận xe
- **Tác nhân**: Nhân viên tiếp nhận
- **Tiền điều kiện**: Nhân viên đã đăng nhập vào hệ thống.
- **Luồng chính**:
    1. Nhân viên nhập thông tin xe và chủ xe (Biển số, Hiệu xe, Tên, Địa chỉ, Điện thoại).
    2. Nhân viên nhấn nút "Lưu".
    3. Hệ thống kiểm tra số lượng xe đã tiếp nhận trong ngày hiện tại.
    4. Hệ thống xác nhận số lượng xe tiếp nhận hiện tại < 30 (Thỏa mãn QĐ1).
    5. Hệ thống lưu thông tin vào cơ sở dữ liệu.
    6. Hệ thống hiển thị thông báo thành công và xóa trắng form để tiếp nhận xe tiếp theo.
- **Luồng phụ**:
    - **Vượt quá số lượng (QĐ1)**: Tại bước 4, nếu số xe đã đạt 30, hệ thống hiển thị thông báo lỗi: "Đã đạt giới hạn tiếp nhận tối đa trong ngày (30 xe) theo QĐ1. Không thể tiếp nhận thêm." và không lưu dữ liệu.
    - **Thiếu thông tin bắt buộc**: Tại bước 2, nếu các trường bắt buộc bị bỏ trống, hệ thống đánh dấu các trường lỗi và yêu cầu người dùng nhập đầy đủ.
    - **Biển số xe đã tồn tại trong trạng thái đang sửa**: Hệ thống thông báo xe này đã được tiếp nhận và chưa hoàn tất sửa chữa.

---

## 2. Tra cứu xe (Search)

### Đặc tả
- **Tên chức năng**: Tra cứu xe
- **Mô tả**: Tìm kiếm thông tin về các xe đã từng được tiếp nhận hoặc đang có trong gara.
- **Trigger**: Người dùng chọn chức năng "Tra cứu xe".
- **Input**: Các tiêu chí tìm kiếm (không bắt buộc nhập hết):
    - Biển số xe
    - Tên chủ xe
    - Hiệu xe
- **Output**: Danh sách các xe khớp với tiêu chí tìm kiếm bao gồm: Biển số, Hiệu xe, Chủ xe, Ngày tiếp nhận gần nhất, Trạng thái (Đang sửa/Đã xong).
- **Quy định liên quan**: Không có.

### Use Case: Tra cứu xe
- **Tác nhân**: Nhân viên tiếp nhận, Người quản lý
- **Tiền điều kiện**: Hệ thống đang hoạt động.
- **Luồng chính**:
    1. Người dùng nhập một hoặc nhiều tiêu chí tìm kiếm vào các ô tương ứng.
    2. Người dùng nhấn nút "Tìm kiếm".
    3. Hệ thống thực hiện tìm kiếm (hỗ trợ tìm kiếm gần đúng/theo từ khóa).
    4. Hệ thống hiển thị danh sách kết quả dưới dạng bảng.
    5. Người dùng có thể chọn một dòng để xem chi tiết thông tin xe hoặc lịch sử sửa chữa.
- **Luồng phụ**:
    - **Không tìm thấy kết quả**: Nếu không có xe nào thỏa mãn, hệ thống hiển thị thông báo "Không tìm thấy dữ liệu phù hợp".
    - **Xóa bộ lọc**: Người dùng nhấn nút "Làm mới" hoặc "Xóa", hệ thống xóa các tiêu chí đã nhập và hiển thị lại toàn bộ danh sách xe.

---

# Đặc tả Module Dịch vụ (Service Module)

## 1. Chức năng: Lập phiếu sửa chữa

### Đặc tả (Specification)
- **Tên chức năng:** Lập phiếu sửa chữa.
- **Mô tả:** Tiếp nhận xe vào xưởng và khởi tạo phiếu sửa chữa để theo dõi quá trình bảo trì.
- **Tác nhân kích hoạt (Trigger):** Nhân viên tiếp nhận khi xe của khách hàng cần được sửa chữa.
- **Dữ liệu đầu vào (Input):** 
    - Biển số xe.
    - Ngày tiếp nhận (Mặc định ngày hiện tại).
    - Nội dung sửa chữa sơ bộ.
- **Dữ liệu đầu ra (Output):** Phiếu sửa chữa mới được lưu vào hệ thống với mã số duy nhất.
- **Quy định liên quan (QĐ2):** 
    - Xe phải có trong danh sách xe đã tiếp nhận/đăng ký.
    - Mỗi xe chỉ có thể có một phiếu sửa chữa đang ở trạng thái "Chưa hoàn thành" tại một thời điểm.

### Use Case: Lập phiếu sửa chữa
- **Tác nhân:** Nhân viên tiếp nhận.
- **Tiền điều kiện:** Xe đã được đăng ký thông tin trong hệ thống (Hồ sơ xe).
- **Luồng chính:**
    1. Nhân viên chọn chức năng "Lập phiếu sửa chữa".
    2. Nhân viên nhập biển số xe.
    3. Hệ thống kiểm tra thông tin xe (QĐ2):
        - Tìm kiếm xe trong cơ sở dữ liệu.
        - Kiểm tra xem xe có phiếu sửa chữa nào chưa hoàn thành hay không.
    4. Hệ thống hiển thị thông tin xe và ngày tiếp nhận mặc định.
    5. Nhân viên nhập các yêu cầu sửa chữa cơ bản từ khách hàng.
    6. Nhân viên nhấn "Lưu".
    7. Hệ thống tạo mã phiếu sửa chữa, lưu dữ liệu và thông báo thành công.
- **Luồng phụ:**
    - **3a. Biển số xe không tồn tại:** Hệ thống thông báo xe chưa được tiếp nhận, yêu cầu nhân viên lập "Phiếu tiếp nhận" trước.
    - **3b. Xe đang trong quá trình sửa chữa:** Hệ thống thông báo xe đã có phiếu sửa chữa chưa đóng, không cho phép tạo phiếu mới.
    - **6a. Hủy bỏ:** Nhân viên chọn hủy, hệ thống không lưu dữ liệu và quay lại màn hình chính.

---

## 2. Chức năng: Cập nhật nội dung sửa chữa

### Đặc tả (Specification)
- **Tên chức năng:** Cập nhật nội dung sửa chữa.
- **Mô tả:** Thêm thông tin chi tiết về vật tư phụ tùng đã sử dụng và các loại tiền công tương ứng vào phiếu sửa chữa.
- **Tác nhân kích hoạt (Trigger):** Kỹ thuật viên hoặc nhân viên phụ trách khi thực hiện sửa chữa thực tế.
- **Dữ liệu đầu vào (Input):**
    - Mã phiếu sửa chữa.
    - Danh sách vật tư phụ tùng (Tên vật tư, số lượng).
    - Danh sách tiền công (Loại tiền công).
- **Dữ liệu đầu ra (Output):** Phiếu sửa chữa được cập nhật chi tiết các khoản mục và tổng tiền.
- **Quy định liên quan:**
    - Số lượng vật tư phụ tùng sử dụng không vượt quá số lượng tồn kho.
    - Đơn giá vật tư và tiền công được lấy từ bảng giá quy định.

### Use Case: Cập nhật nội dung sửa chữa
- **Tác nhân:** Nhân viên kỹ thuật / Kế toán dịch vụ.
- **Tiền điều kiện:** Phiếu sửa chữa đã được lập và đang ở trạng thái "Đang thực hiện".
- **Luồng chính:**
    1. Nhân viên chọn phiếu sửa chữa cần cập nhật.
    2. Nhân viên chọn chức năng "Thêm chi tiết".
    3. **Thêm vật tư:**
        - Nhân viên chọn vật tư từ danh mục.
        - Nhập số lượng.
        - Hệ thống tự động lấy đơn giá và tính thành tiền.
    4. **Thêm tiền công:**
        - Nhân viên chọn loại tiền công.
        - Hệ thống tự động áp đơn giá tiền công.
    5. Nhân viên nhấn "Cập nhật".
    6. Hệ thống tính toán lại tổng tiền của phiếu sửa chữa, lưu dữ liệu và thông báo thành công.
- **Luồng phụ:**
    - **3a. Vật tư hết hàng:** Hệ thống thông báo số lượng tồn kho không đủ và yêu cầu nhập lại hoặc nhập hàng.
    - **5a. Dữ liệu không hợp lệ:** Hệ thống thông báo lỗi nếu số lượng hoặc các trường bắt buộc bị bỏ trống.
    - **6a. In phiếu:** Sau khi cập nhật, nhân viên có tùy chọn in phiếu sửa chữa để bàn giao cho khách hàng hoặc lưu hồ sơ.

---

# Đặc tả Module Kho (Inventory Module)

## 1. Lập phiếu nhập kho (Import Supply)

### 1.1. Đặc tả (Functional Specification)
- **Tên chức năng**: Lập phiếu nhập kho
- **Tác nhân kích hoạt (Trigger)**: Người dùng điều hướng đến phần "Nhập vật tư" và bắt đầu một giao dịch nhập kho mới (biểu mẫu BM3).
- **Dữ liệu vào (Input)**:
    - `Nhà cung cấp`: Chọn từ danh sách `NHA_CUNG_CAP`.
    - `Ngày nhập`: Mặc định là ngày/giờ hiện tại.
    - `Chi tiết nhập kho` (Dạng bảng):
        - `Tên vật tư`: Chọn từ danh sách `VẬT_TƯ`.
        - `Số lượng`: Số lượng nhập (Số nguyên, > 0).
        - `Đơn giá nhập`: Giá vốn cho lô hàng này (Số thập phân, >= 0).
- **Dữ liệu ra (Output)**:
    - Bản ghi mới được tạo trong bảng `PHIEU_NHAP`.
    - Các bản ghi mới được tạo trong bảng `CT_PHIEU_NHAP`.
    - Cập nhật `so_luong_ton` và `don_gia_nhap` trong bảng `VAT_TU`.
- **Quy định liên quan (Logic/Validation)**:
    - **Tính tổng tiền**: `PHIEU_NHAP.tong_tien` là tổng của `(so_luong * don_gia_nhap)` của tất cả các mặt hàng trong phiếu.
    - **Cập nhật tồn kho (QĐ3)**: Sau khi lưu thành công, đối với mỗi mặt hàng:
        - `VAT_TU.so_luong_ton = VAT_TU.so_luong_ton + CT_PHIEU_NHAP.so_luong`.
    - **Cập nhật giá (QĐ3)**: Cập nhật đơn giá nhập gần nhất cho vật tư:
        - `VAT_TU.don_gia_nhap = CT_PHIEU_NHAP.don_gia_nhap`.
    - **Toàn vẹn dữ liệu**: Tất cả các trường bắt buộc trong bảng chi tiết phải được điền đầy đủ trước khi cho phép lưu.

### 1.2. Use Case
- **Tác nhân**: Nhân viên kho / Quản trị viên.
- **Tiền điều kiện**:
    - Người dùng đã đăng nhập vào hệ thống.
    - Thông tin Vật tư và Nhà cung cấp đã được khai báo trước đó trong hệ thống.
- **Luồng chính (Main Flow)**:
    1. Tác nhân chọn "Lập phiếu nhập kho" từ menu chức năng.
    2. Hệ thống hiển thị biểu mẫu nhập kho (BM3).
    3. Tác nhân chọn Nhà cung cấp và kiểm tra Ngày nhập.
    4. Tác nhân thêm một hoặc nhiều vật tư vào danh sách nhập:
        a. Chọn vật tư từ danh sách gợi ý.
        b. Nhập số lượng và đơn giá nhập tương ứng.
    5. Hệ thống tự động tính toán thành tiền cho từng dòng và tổng giá trị của toàn bộ phiếu nhập.
    6. Tác nhân nhấn nút "Lưu".
    7. Hệ thống kiểm tra tính hợp lệ của dữ liệu và cập nhật cơ sở dữ liệu (`PHIEU_NHAP`, `CT_PHIEU_NHAP`, và `VAT_TU`).
    8. Hệ thống hiển thị thông báo "Lưu phiếu nhập thành công".
- **Luồng phụ (Alternate Flows)**:
    - **Số lượng hoặc Đơn giá không hợp lệ**: Nếu tác nhân nhập số lượng ≤ 0 hoặc đơn giá < 0, hệ thống hiển thị thông báo lỗi và yêu cầu chỉnh sửa trước khi lưu.
    - **Chưa có chi tiết vật tư**: Nếu tác nhân nhấn "Lưu" khi chưa thêm bất kỳ vật tư nào, hệ thống sẽ cảnh báo "Vui lòng thêm ít nhất một vật tư vào phiếu nhập".

---

## 2. Tra cứu tồn kho (View Inventory List)

### 2.1. Đặc tả (Functional Specification)
- **Tên chức năng**: Tra cứu tồn kho
- **Tác nhân kích hoạt (Trigger)**: Người dùng chọn chức năng "Danh sách tồn kho" hoặc "Quản lý kho" từ bảng điều khiển chính.
- **Dữ liệu vào (Input)**:
    - (Tùy chọn) Từ khóa tìm kiếm: Tìm kiếm theo tên hoặc mã vật tư.
- **Dữ liệu ra (Output)**:
    - Danh sách các vật tư được truy xuất từ bảng `VAT_TU`.
    - Các thông tin hiển thị bao gồm: Mã vật tư, Tên vật tư, Đơn vị tính, Số lượng tồn hiện tại, Đơn giá nhập gần nhất, Đơn giá bán hiện hành.
- **Quy định liên quan (Logic/Validation)**:
    - Dữ liệu được truy vấn thời gian thực từ bảng `VAT_TU`.
    - Mặc định danh sách được sắp xếp theo Tên vật tư (A-Z) hoặc theo Mã vật tư giảm dần.

### 2.2. Use Case
- **Tác nhân**: Nhân viên / Quản trị viên.
- **Tiền điều kiện**:
    - Người dùng đã đăng nhập thành công vào hệ thống.
- **Luồng chính (Main Flow)**:
    1. Tác nhân nhấn vào mục "Tra cứu tồn kho".
    2. Hệ thống thực hiện truy vấn cơ sở dữ liệu trên bảng `VAT_TU`.
    3. Hệ thống hiển thị danh sách dạng bảng chứa thông tin về mức tồn kho và giá cả của tất cả các vật tư.
    4. Tác nhân có thể nhập tên vật tư vào thanh tìm kiếm để lọc nhanh thông tin cần xem.
- **Luồng phụ (Alternate Flows)**:
    - **Kho hàng chưa có dữ liệu**: Nếu hệ thống chưa có bất kỳ vật tư nào được đăng ký, màn hình sẽ hiển thị thông báo "Không có dữ liệu vật tư để hiển thị".

---

# Đặc tả Module Tài chính

Tài liệu này định nghĩa các đặc tả chức năng và các trường hợp sử dụng (use cases) cho module Tài chính, tập trung vào việc xử lý phiếu thu tiền và quản lý công nợ.

---

## 1. Lập Phiếu Thu Tiền (BM4)

### 1.1. Đặc tả Chức năng
- **Sự kiện kích hoạt (Trigger)**: Nhân viên hoặc Quản trị viên muốn ghi lại một khoản thanh toán của khách hàng cho một xe cụ thể.
- **Dữ liệu vào (Input Data)**:
    - `Biển số xe`: Chuỗi, bắt buộc.
    - `Ngày thu tiền`: Ngày, mặc định là ngày hiện tại.
    - `Số tiền thu`: Số thập phân, bắt buộc, phải là số dương.
- **Dữ liệu ra (Output Data)**:
    - Một bản ghi mới trong bảng `PHIẾU THU`.
    - Cập nhật `Số tiền nợ` trong bảng `XE`.
- **Quy định liên quan (Logic/Validation)**:
    - **Kiểm tra Biển số xe**: Biển số xe phải tồn tại trong hệ thống (bảng `XE`).
    - **Truy xuất nợ**: Lấy giá trị `Tiền nợ hiện tại` của biển số xe tương ứng.
    - **QĐ4 - Giới hạn thu tiền**: Số tiền thu không được vượt quá số tiền nợ của xe.
        - Điều kiện: `Số tiền thu <= Tiền nợ hiện tại`.
    - **Cập nhật nợ**: Sau khi lập phiếu thu thành công, hệ thống phải trừ số tiền thu vào tiền nợ của xe.
        - Công thức: `Tiền nợ mới = Tiền nợ hiện tại - Số tiền thu`.
    - **Lưu trữ**: Lưu thông tin giao dịch vào bảng phiếu thu với các thông tin: Mã phiếu thu, Biển số xe, Ngày thu tiền, Số tiền thu.

### 1.2. Trường hợp sử dụng (Use Case)
- **Tác nhân (Actor)**: Nhân viên, Quản trị viên.
- **Tiền điều kiện (Pre-conditions)**:
    - Xe đã được đăng ký trong hệ thống.
    - Xe đang có khoản nợ (`Tiền nợ hiện tại > 0`).
- **Luồng chính (Main Flow)**:
    1. Tác nhân điều hướng đến màn hình "Lập Phiếu Thu Tiền".
    2. Tác nhân nhập hoặc chọn **Biển số xe**.
    3. Hệ thống hiển thị **Tên chủ xe**, **Điện thoại** và **Tiền nợ hiện tại** của xe đó.
    4. Tác nhân nhập **Ngày thu tiền** và **Số tiền thu**.
    5. Tác nhân nhấn nút "Lưu".
    6. Hệ thống kiểm tra tính hợp lệ của dữ liệu và kiểm tra **QĐ4** (Số tiền thu <= Tiền nợ).
    7. Hệ thống ghi lại phiếu thu vào cơ sở dữ liệu.
    8. Hệ thống cập nhật lại `Tiền nợ hiện tại` của xe.
    9. Hệ thống hiển thị thông báo thành công và cung cấp tùy chọn in phiếu thu (BM4).
- **Luồng phụ (Alternate Flows)**:
    - **Biển số xe không hợp lệ**: Nếu biển số xe không tồn tại, hệ thống hiển thị lỗi: "Biển số xe không tồn tại".
    - **Số tiền thu vượt quá nợ (Vi phạm QĐ4)**: Nếu `Số tiền thu` lớn hơn `Tiền nợ hiện tại`, hệ thống hiển thị lỗi: "Số tiền thu không được vượt quá số tiền nợ".
    - **Số tiền thu không hợp lệ**: Nếu `Số tiền thu` <= 0, hệ thống hiển thị lỗi: "Số tiền thu phải lớn hơn 0".
- **Hậu điều kiện (Post-conditions)**:
    - Một bản ghi phiếu thu được tạo ra.
    - Tiền nợ của xe được cập nhật giảm xuống.

---

## 2. Tra Cứu Công Nợ

### 2.1. Đặc tả Chức năng
- **Sự kiện kích hoạt (Trigger)**: Người dùng muốn kiểm tra tình trạng nợ của các khách hàng và xe của họ.
- **Dữ liệu vào (Input Data)**:
    - Bộ lọc tùy chọn: `Biển số xe` (khớp một phần hoặc chính xác).
    - Bộ lọc tùy chọn: `Tên chủ xe` (khớp một phần).
- **Dữ liệu ra (Output Data)**:
    - Danh sách/Bảng chứa các thông tin:
        - `Biển số xe`
        - `Tên chủ xe`
        - `Điện thoại`
        - `Tiền nợ hiện tại`
- **Quy định liên quan (Logic/Validation)**:
    - **Nguồn dữ liệu**: Kết hợp thông tin từ bảng `XE` và bảng `CHỦ XE`.
    - **Lọc dữ liệu**: Nếu có thông tin lọc, hệ thống chỉ trả về các bản ghi khớp với điều kiện.
    - **Quy tắc nghiệp vụ**: Tham chiếu **BM5.3 (Báo cáo công nợ)**. Thông thường, danh sách mặc định hiển thị các xe có `Tiền nợ hiện tại > 0`.
    - **Chỉ đọc**: Chế độ xem này không thay đổi dữ liệu; nó phản ánh trạng thái thời gian thực của trường `Tiền nợ hiện tại`.

### 2.2. Trường hợp sử dụng (Use Case)
- **Tác nhân (Actor)**: Nhân viên, Quản trị viên.
- **Tiền điều kiện (Pre-conditions)**: Không có.
- **Luồng chính (Main Flow)**:
    1. Tác nhân điều hướng đến màn hình "Tra cứu công nợ" hoặc "Quản lý nợ khách hàng".
    2. Hệ thống truy xuất danh sách xe và tiền nợ tương ứng từ cơ sở dữ liệu.
    3. Hệ thống hiển thị danh sách dưới dạng bảng.
    4. Tác nhân có thể sử dụng thanh tìm kiếm để lọc theo **Biển số xe** hoặc **Tên chủ xe**.
    5. Hệ thống cập nhật danh sách hiển thị dựa trên tiêu chí tìm kiếm.
    6. Tác nhân có thể nhấn vào một dòng cụ thể để chuyển nhanh đến màn hình "Lập Phiếu Thu Tiền" cho xe đó.
- **Hậu điều kiện (Post-conditions)**: Không có.

---

# Đặc tả Module Báo Cáo (Report Module)

## 1. Báo cáo doanh số (Sales Report)

### Đặc tả
- **Tên chức năng**: Lập báo cáo doanh số tháng.
- **Trigger**: Người dùng chọn chức năng "Báo cáo doanh số" từ menu báo cáo.
- **Input**: Tháng, Năm cần báo cáo.
- **Output**:
    - Bảng danh sách các ngày trong tháng có phát sinh doanh thu.
    - Các cột: STT, Ngày, Số hóa đơn, Doanh số, Tỷ lệ (%).
    - Tổng doanh số cả tháng.
- **Quy định liên quan**:
    - Doanh số ngày = Tổng trị giá của tất cả các hóa đơn được xuất trong ngày đó.
    - Tỷ lệ = (Doanh số ngày / Tổng doanh số tháng) * 100.

### Use Case
- **Tác nhân**: Nhân viên quản lý.
- **Tiền điều kiện**: Hệ thống đã có dữ liệu hóa đơn của tháng/năm được chọn.
- **Luồng chính**:
    1. Người dùng chọn tháng và năm cần xem báo cáo.
    2. Người dùng nhấn nút "Lập báo cáo".
    3. Hệ thống kiểm tra dữ liệu và tính toán doanh số cho từng ngày.
    4. Hệ thống tính tổng doanh số tháng và tỷ lệ cho từng ngày.
    5. Hệ thống hiển thị bảng báo cáo lên màn hình.
- **Luồng phụ**:
    - **2a. Tháng/Năm không hợp lệ**: Hệ thống hiển thị thông báo lỗi và yêu cầu chọn lại.
    - **3a. Không có dữ liệu doanh thu**: Hệ thống hiển thị bảng trống với tổng doanh số bằng 0 và thông báo "Không có dữ liệu trong tháng này".

---

## 2. Báo cáo tồn kho (Inventory Report)

### Đặc tả
- **Tên chức năng**: Lập báo cáo tồn kho tháng.
- **Trigger**: Người dùng chọn chức năng "Báo cáo tồn kho" từ menu báo cáo.
- **Input**: Tháng, Năm cần báo cáo.
- **Output**:
    - Bảng danh sách các loại thuốc/vật tư trong kho.
    - Các cột: STT, Thuốc, Đơn vị tính, Tồn đầu, Phát sinh (Nhập/Xuất), Tồn cuối.
- **Quy định liên quan**:
    - Tồn đầu tháng (n) = Tồn cuối tháng (n-1).
    - Tồn cuối = Tồn đầu + Tổng nhập trong tháng - Tổng xuất trong tháng.

### Use Case
- **Tác nhân**: Nhân viên kho.
- **Tiền điều kiện**: Các nghiệp vụ nhập kho và xuất kho trong tháng đã được ghi nhận đầy đủ.
- **Luồng chính**:
    1. Người dùng chọn tháng và năm cần xem báo cáo tồn kho.
    2. Người dùng nhấn nút "Lập báo cáo".
    3. Hệ thống truy vấn dữ liệu tồn đầu kỳ và các phiếu nhập/xuất trong kỳ.
    4. Hệ thống tính toán lượng tồn cuối cho từng mặt hàng.
    5. Hệ thống hiển thị bảng báo cáo chi tiết.
- **Luồng phụ**:
    - **3a. Chưa có dữ liệu kỳ trước**: Nếu là tháng đầu tiên sử dụng hệ thống, tồn đầu được coi là số lượng ban đầu khi khởi tạo kho.

---

## 3. Báo cáo công nợ (Debt Report)

### Đặc tả
- **Tên chức năng**: Lập báo cáo công nợ khách hàng.
- **Trigger**: Người dùng chọn chức năng "Báo cáo công nợ" từ menu báo cáo.
- **Input**: Tháng, Năm cần báo cáo.
- **Output**:
    - Bảng danh sách khách hàng có dư nợ hoặc phát sinh nợ.
    - Các cột: STT, Khách hàng, Nợ đầu, Phát sinh (Nợ mới/Đã trả), Nợ cuối.
- **Quy định liên quan**:
    - Nợ mới: Tổng tiền nợ từ các hóa đơn chưa thanh toán hết trong tháng.
    - Đã trả: Tổng số tiền khách hàng đã trả qua các phiếu thu trong tháng.
    - Nợ cuối = Nợ đầu + Nợ mới - Đã trả.

### Use Case
- **Tác nhân**: Nhân viên kế toán.
- **Tiền điều kiện**: Dữ liệu hóa đơn và phiếu thu tiền khách hàng đã được cập nhật.
- **Luồng chính**:
    1. Người dùng chọn tháng và năm cần xem báo cáo công nợ.
    2. Người dùng nhấn nút "Lập báo cáo".
    3. Hệ thống tính toán dư nợ đầu kỳ của từng khách hàng.
    4. Hệ thống tổng hợp các giao dịch phát sinh nợ và thanh toán trong tháng.
    5. Hệ thống tính nợ cuối kỳ và hiển thị báo cáo.
- **Luồng phụ**:
    - **5a. Khách hàng không có nợ**: Nếu khách hàng không còn nợ và không có phát sinh trong tháng, hệ thống có thể ẩn khách hàng đó để báo cáo gọn hơn (tùy cấu hình).
