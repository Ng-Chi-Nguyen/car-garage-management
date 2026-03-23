# document

_Nguồn chuyển đổi: document.odt -> document.md bằng pandoc (gfm)._

<div>

### NHÓM 1: QUẢN TRỊ & ĐỐI TƯỢNG (CORE MODULE)

Nhóm này quản lý người dùng và thông tin cơ bản của Gara.

#### 1. Bảng **USERS** (Người dùng hệ thống)

- **Mục đích:** Để đăng nhập và phân quyền.

- Cấu trúc:

  - **user_id** (INT, PK, Auto Increment): Mã định danh.
  - **username** (VARCHAR(50), Unique): Tên đăng nhập.
  - **password_hash** (VARCHAR(255)): Mật khẩu đã mã hóa (không lưu
    text).
  - **full_name** (NVARCHAR(100)): Tên hiển thị.
  - **role** (VARCHAR(20)): 'ADMIN', 'STAFF', 'WAREHOUSE'.

#### 2. Bảng **CUSTOMERS** (Khách hàng) - *Tách từ BM1*

- **Mục đích:** Quản lý thông tin chủ xe1.

- Cấu trúc:

  - **customer_id** (INT, PK).
  - **full_name** (NVARCHAR(100)): Tên chủ xe2.
  - **phone** (VARCHAR(15)): Điện thoại3.
  - **address** (NVARCHAR(200)): Địa chỉ4.
  - **email** (VARCHAR(100)): Email (phục vụ BM4 5).

#### 3. Bảng **CARS** (Xe) - *Trung tâm dữ liệu*

- **Mục đích:** Quản lý xe và công nợ6.

- Cấu trúc:

  - **car_id** (INT, PK).
  - **license_plate** (VARCHAR(20), Unique): Biển số xe7.
  - **brand_id** (INT, FK): Liên kết bảng **CAR_BRANDS**.
  - **customer_id** (INT, FK): Liên kết bảng **CUSTOMERS**.
  - **current_debt** (DECIMAL(18, 0), Default 0): Tiền nợ hiện tại (Phục
    vụ QĐ4 8).

- **Join:** **CARS** join **CUSTOMERS** để biết xe của ai.

### NHÓM 2: DANH MỤC & CẤU HÌNH (MASTER DATA)

Nhóm này chứa dữ liệu ít thay đổi, phục vụ các Dropdown list.

#### 4. Bảng **CAR_BRANDS** (Hiệu xe)

- **Mục đích:** Quản lý danh sách hiệu xe (Toyota, Honda...)9.

- Cấu trúc:

  - **brand_id** (INT, PK).
  - **brand_name** (NVARCHAR(50)): Tên hiệu xe.

- **Quy định:** Admin dùng bảng này để thêm/xóa hiệu xe theo QĐ610.

#### 5. Bảng **LABOR_FEES** (Tiền công)

- **Mục đích:** Quản lý 100 loại tiền công niêm yết1111.

- Cấu trúc:

  - **labor_id** (INT, PK).
  - **labor_name** (NVARCHAR(100)): Tên nội dung công việc (Rửa xe, vá
    lốp...).
  - **standard_fee** (DECIMAL(18, 0)): Đơn giá tiền công niêm yết1212.

#### 6. Bảng **PARAMETERS** (Tham số quy định)

- **Mục đích:** Lưu các luật của Gara để Admin thay đổi13.

- Cấu trúc:

  - **param_key** (VARCHAR(50), PK): Ví dụ 'MAX_CARS_RECEIVE'.
  - **param_value** (FLOAT): Ví dụ 30.
  - **description** (NVARCHAR(200)): Giải thích (Số xe tối đa trong
    ngày).

### NHÓM 3: KHO & VẬT TƯ (INVENTORY MODULE - BỔ SUNG)

Nhóm này giúp quản lý đầu vào của phụ tùng (như đã phân tích là cần
thiết để có tồn kho).

#### 7. Bảng **SUPPLIERS** (Nhà cung cấp)

- **Mục đích:** Quản lý nguồn nhập hàng.

- Cấu trúc:

  - **supplier_id** (INT, PK).
  - **supplier_name** (NVARCHAR(100)).
  - **contact_info** (NVARCHAR(200)).

#### 8. Bảng **SUPPLIES** (Vật tư phụ tùng)

- **Mục đích:** Quản lý danh sách 200 loại vật tư và tồn kho141414.

- Cấu trúc:

  - **supply_id** (INT, PK).
  - **supply_name** (NVARCHAR(100)): Tên vật tư.
  - **unit** (NVARCHAR(20)): Đơn vị tính (Cái, Lít).
  - **unit_price** (DECIMAL(18, 0)): Đơn giá bán hiện tại.
  - **stock_qty** (INT): Số lượng tồn kho hiện tại (Tồn Cuối trong báo
    cáo 15).

#### 9. Bảng **IMPORT_TICKETS** (Phiếu nhập kho)

- **Mục đích:** Ghi nhận lịch sử nhập hàng.

- Cấu trúc:

  - **import_id** (INT, PK).
  - **supplier_id** (INT, FK).
  - **import_date** (DATETIME).
  - **total_cost** (DECIMAL(18, 0)).

#### 10. Bảng **IMPORT_DETAILS** (Chi tiết nhập)

- **Mục đích:** Chi tiết từng món hàng nhập.

- Cấu trúc:

  - **detail_id** (INT, PK).
  - **import_id** (INT, FK).
  - **supply_id** (INT, FK).
  - **quantity** (INT).
  - **import_price** (DECIMAL): Giá vốn nhập vào.

### NHÓM 4: NGHIỆP VỤ & GIAO DỊCH (TRANSACTION MODULE)

Đây là nhóm quan trọng nhất, xử lý logic BM2, BM4.

#### 11. Bảng **SERVICE_TICKETS** (Phiếu sửa chữa - Master)

- **Mục đích:** Đại diện cho một lần xe vào sửa (BM2 16).

- Cấu trúc:

  - **ticket_id** (INT, PK).
  - **car_id** (INT, FK): Sửa xe nào.
  - **service_date** (DATETIME): Ngày sửa chữa17.
  - **status** (VARCHAR(20)): 'PROCESSING', 'COMPLETED', 'CANCELED'.
  - **total_amount** (DECIMAL(18, 0)): Tổng tiền phiếu (Tính từ chi
    tiết).

#### 12. Bảng **TICKET_DETAILS** (Chi tiết phiếu sửa - Detail)

- **Mục đích:** Lưu từng hạng mục công việc/vật tư (Bảng trong BM2 18).

- Cấu trúc:

  - **detail_id** (INT, PK).
  - **ticket_id** (INT, FK).
  - **content** (NVARCHAR(200)): Nội dung (nhập tay hoặc tự sinh).
  - **supply_id** (INT, FK, Nullable): Link tới Vật tư (nếu có dùng).
  - **labor_id** (INT, FK, Nullable): Link tới Tiền công (nếu có dùng).
  - **quantity** (INT): Số lượng vật tư19.
  - **supply_price** (DECIMAL): **Snapshot** giá vật tư lúc sửa20.
  - **labor_price** (DECIMAL): **Snapshot** giá tiền công lúc sửa21.
  - **total_price** (DECIMAL): Thành tiền = (supply_price \* qty) +
    labor_price22.

#### 13. Bảng **PAYMENTS** (Phiếu thu tiền)

- **Mục đích:** Ghi nhận thanh toán và trừ nợ (BM4 23).

- Cấu trúc:

  - **payment_id** (INT, PK).
  - **car_id** (INT, FK): Thu tiền xe nào.
  - **payment_date** (DATETIME): Ngày thu tiền24.
  - **amount** (DECIMAL(18, 0)): Số tiền thu25.
  - **note** (NVARCHAR): Ghi chú.

### PHÂN TÍCH QUAN HỆ KHÓA (JOINS)

Dưới đây là cách các bảng kết nối với nhau để trả lời các câu hỏi nghiệp
vụ:

1.  Để in "Phiếu Sửa Chữa" (BM2) đầy đủ:

    - **SERVICE_TICKETS** **JOIN** **CARS** (Lấy biển số)
    - **JOIN** **CUSTOMERS** (Lấy tên chủ xe)
    - **JOIN** **TICKET_DETAILS** (Lấy danh sách hạng mục)
    - **TICKET_DETAILS** **LEFT JOIN** **SUPPLIES** (Lấy tên vật tư)
    - **TICKET_DETAILS** **LEFT JOIN** **LABOR_FEES** (Lấy tên công
      việc)

2.  Để kiểm tra quy định "Tiếp nhận xe" (QĐ1):

    - Đếm **COUNT(\*)** từ bảng **SERVICE_TICKETS** với điều kiện
      **service_date = TODAY**.
    - So sánh với giá trị trong bảng **PARAMETERS** (**Key =
      'MAX_CARS_RECEIVE'**).

3.  Để làm "Báo cáo tồn kho" (BM5.2):

    - Tồn Đầu: Tính toán từ lịch sử (Hơi phức tạp).
    - Phát Sinh Nhập: **SUM** **quantity** từ **IMPORT_DETAILS** theo
      tháng.
    - Phát Sinh Xuất: **SUM** **quantity** từ **TICKET_DETAILS** theo
      tháng.
    - Tồn Cuối: Lấy trực tiếp cột **stock_qty** từ bảng **SUPPLIES**.

4.  Để kiểm tra "Quy định thu tiền" (QĐ4):

    - Lấy **current_debt** từ bảng **CARS** (Ví dụ: 1.000.000đ).
    - So sánh với số tiền user nhập vào form **PAYMENTS** (Ví dụ nhập
      1.200.000đ).
    - Nếu Input \> Debt =\> Báo lỗi "Thu quá số tiền nợ"26.

</div>

Dựa trên 13 bảng database đã thiết kế, hệ thống Web App Gara Ô tô của
nhóm bạn sẽ có khoảng **20-25 chức năng cụ thể**, được chia thành **6
Phân hệ (Module) chính**.

<div>

Đây là danh sách chi tiết từng chức năng, mục đích sử dụng và các bảng
dữ liệu tham gia:

### 1. PHÂN HỆ QUẢN TRỊ & BẢO MẬT (ADMINISTRATION)

Dành cho Admin quản lý người dùng và cấu hình hệ thống.

1.  Đăng nhập & Đăng xuất (Authentication):

    - *Mục đích:* Bảo mật hệ thống, xác định ai đang thao tác (Admin hay
      Nhân viên).
    - *Bảng:* **USERS**.

2.  Quản lý Nhân viên (User Management):

    - *Chức năng:* Thêm tài khoản mới cho nhân viên, Reset mật khẩu,
      Khóa tài khoản nghỉ việc.
    - *Bảng:* **USERS**.

3.  Cấu hình Tham số quy định (System Config - QĐ6):

    - *Chức năng:* Thay đổi các luật như "Số xe tối đa trong ngày", "Tỉ
      lệ lãi suất".
    - *Mục đích:* Giúp phần mềm linh động, không cần sửa code khi luật
      thay đổi.
    - *Bảng:* **PARAMETERS**.

4.  Quản lý Danh mục dùng chung (Master Data):

    - *Chức năng:* Thêm/Sửa/Xóa Hiệu xe (**CAR_BRANDS**) và Bảng giá
      Tiền công (**LABOR_FEES**).
    - *Mục đích:* Cập nhật bảng giá niêm yết và các dòng xe mới ra mắt.

### 2. PHÂN HỆ LỄ TÂN & ĐIỀU PHỐI (RECEPTION)

Dành cho nhân viên tiếp nhận xe ở cổng.

5.  Dashboard Tổng quan (Home):

    - *Chức năng:* Hiển thị số xe đang trong xưởng, doanh thu tạm tính
      trong ngày, biểu đồ trạng thái (bao nhiêu xe đang chờ, bao nhiêu
      xe đang sửa).
    - *Bảng:* **SERVICE_TICKETS**, **CARS** (Query count/sum).

6.  Tra cứu thông tin Xe & Khách hàng:

    - *Chức năng:* Nhập biển số hoặc SĐT -\> Hiện thông tin chủ xe và
      lịch sử sửa chữa cũ.
    - *Bảng:* **CARS**, **CUSTOMERS**.

7.  Tiếp nhận xe mới (Check-in):

    - *Chức năng:* Ghi nhận xe vào xưởng. Hệ thống kiểm tra quy định
      "Max 30 xe/ngày". Nếu khách mới thì tạo hồ sơ khách, nếu xe mới
      thì tạo hồ sơ xe.
    - *Bảng:* **CARS**, **CUSTOMERS**, **SERVICE_TICKETS** (Tạo phiếu
      trạng thái 'RECEIVED'), **PARAMETERS**.

8.  Xem Lịch sử bảo dưỡng (Service History):

    - *Chức năng:* Xem lại xe này từng thay nhớt ngày nào, sửa gì.
    - *Mục đích:* Tư vấn khách hàng (VD: "3 tháng rồi anh chưa thay
      nhớt").
    - *Bảng:* **SERVICE_TICKETS** cũ, **TICKET_DETAILS** cũ.

### 3. PHÂN HỆ KỸ THUẬT & DỊCH VỤ (WORKSHOP)

Dành cho cố vấn dịch vụ hoặc thợ sửa chữa.

9.  Lập Phiếu Sửa Chữa (Create Ticket):

    - *Chức năng:* Tạo phiếu chi tiết cho xe. Chọn vật tư, chọn công
      thợ.
    - *Logic:* Tự động điền giá bán (lấy từ kho) và giá công (lấy từ
      bảng niêm yết).
    - *Bảng:* **SERVICE_TICKETS**, **TICKET_DETAILS**, **SUPPLIES**,
      **LABOR_FEES**.

10. Cập nhật Trạng thái sửa chữa (Workflow):

    - *Chức năng:* Chuyển trạng thái phiếu từ "Đang chờ" -\> "Đang làm"
      -\> "Hoàn thành".
    - *Mục đích:* Để Lễ tân và Khách biết xe đã xong chưa.
    - *Bảng:* **SERVICE_TICKETS** (cột status).

11. In Phiếu Báo Giá / Quyết toán:

    - *Chức năng:* Xuất file PDF phiếu sửa chữa để khách xem và ký.
    - *Bảng:* Join 5-6 bảng để lấy đủ thông tin hiển thị.

### 4. PHÂN HỆ KHO & VẬT TƯ (INVENTORY)

Dành cho thủ kho.

12. Quản lý Nhà cung cấp (Supplier Mgmt):

    - *Chức năng:* Lưu danh bạ nơi nhập hàng.
    - *Bảng:* **SUPPLIERS**.

13. Nhập kho phụ tùng (Import Goods):

    - *Chức năng:* Lập phiếu nhập hàng mới. Tự động cộng số lượng vào
      kho. Cập nhật giá vốn.
    - *Bảng:* **IMPORT_TICKETS**, **IMPORT_DETAILS**, **SUPPLIES**.

14. Quản lý Danh sách Phụ tùng (Product List):

    - *Chức năng:* Xem danh sách phụ tùng, số lượng tồn kho hiện tại,
      sửa giá bán.
    - *Bảng:* **SUPPLIES**.

### 5. PHÂN HỆ TÀI CHÍNH & THU NGÂN (CASHIER)

Dành cho bộ phận thu tiền.

15. Theo dõi Công nợ (Debt Tracking):

    - *Chức năng:* Xem danh sách các xe đang nợ tiền Gara.
    - *Bảng:* **CARS** (cột current_debt).

16. Lập Phiếu Thu Tiền (Payment):

    - *Chức năng:* Thu tiền khách trả.
    - *Logic:* Kiểm tra số tiền thu \<= số nợ (QĐ4). Trừ nợ tự động sau
      khi thu.
    - *Bảng:* **PAYMENTS**, **CARS**.

17. In Hóa đơn thanh toán:

    - *Chức năng:* In phiếu thu tiền cho khách.

### 6. PHÂN HỆ BÁO CÁO (REPORTING)

Dành cho chủ Gara xem kết quả kinh doanh.

18. Báo cáo Doanh số (Revenue Report):

    - *Chức năng:* Xem doanh thu theo tháng, theo hiệu xe (để biết xe
      hãng nào hay sửa nhất).
    - *Bảng:* **SERVICE_TICKETS**, **CAR_BRANDS**.

19. Báo cáo Tồn kho (Inventory Report - BM5.1):

    - *Chức năng:* Bảng kê Tồn đầu - Nhập - Xuất - Tồn cuối trong tháng.
    - *Logic:* Tính toán dựa trên **IMPORT_DETAILS** (Nhập) và
      **TICKET_DETAILS** (Xuất).

20. Báo cáo Công nợ:

    - *Chức năng:* Ai đang nợ nhiều nhất? Nợ bao lâu rồi?
    - *Bảng:* **CARS**, **CUSTOMERS**.

- **Giai đoạn 1 (Core):** Làm chức năng 1, 4, 5, 6, 7, 9, 16 (Đăng nhập,
  Tiếp nhận, Sửa chữa cơ bản, Thu tiền). Đây là khung xương sống.
- **Giai đoạn 2 (Inventory):** Làm chức năng 12, 13, 14 (Nhập kho). Nếu
  không có kho thì sửa chữa không chạy được.
- **Giai đoạn 3 (Enhancement):** Làm Báo cáo (18, 19) và Cấu hình tham
  số (3).

</div>
