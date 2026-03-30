# Source
docs/project/DacTaPhanMem.pdf

# Conversion method
pdftotext

ĐẶC TẢ YÊU CẦU PHẦN MỀM: QUẢN LÝ GARA Ô TÔ
1.1 Danh sách các yêu cầu chức năng: Hệ thống được chia thành 6 phân hệ chính dựa trên
25 chức năng đã thiết kế
ST
T

Tên yêu cầu

1

Quản trị hệ
thống

2

Tiếp nhận xe

3

Biểu
mẫu

Quy
định

Ghi chú (Mô tả kỹ thuật)

QĐ6

Đăng nhập, Quản lý nhân viên, Cấu
hình tham số.

BM1

QĐ1

Kiểm tra quy định số xe tối đa (Max
30 xe/ngày).

Lập phiếu
sửa chữa

BM2

QĐ2

Chọn vật tư/công thợ. Lưu giá tại
thời điểm sửa (Snapshot).

4

Nhập kho
phụ tùng

BM3

QĐ3

Nhập hàng, cập nhật giá vốn và tăng
số lượng tồn kho.

5

Thu tiền &
Công nợ

BM4

QĐ4

Kiểm tra số tiền thu <= số nợ hiện
tại.

6

Tra cứu
thông tin

7

Lập báo cáo
tháng

Tra cứu lịch sử bảo dưỡng, tồn kho,
công nợ.
BM5

Báo cáo Doanh số, Tồn kho, Công
nợ.

1.2 Danh sách các biểu mẫu và quy định chi tiết
1.2.1 Biểu mẫu 1 và Quy định 1: Tiếp Nhận Xe (Check-in)
Mục đích: Ghi nhận xe vào xưởng và tạo hồ sơ khách hàng nếu chưa có.
BM1: PHIẾU TIẾP NHẬN XE
 Thông tin chủ xe:
o Tên chủ xe: ........................................... (full_name)
o Điện thoại: ............................................ (phone)
o Địa chỉ: ................................................ (address)
 Thông tin xe:
o Biển số xe: ............................................ (license_plate - Duy nhất)
o Hiệu xe: ................................................ (Chọn từ danh mục CAR_BRANDS)

Ngày tiếp nhận: ...................................... (Mặc định ngày hiện tại service_date)
QĐ1 (Quy định tiếp nhận):
1. Kiểm tra sức chứa: Trước khi lưu, hệ thống đếm số lượng phiếu trong ngày từ bảng
SERVICE_TICKETS. Nếu số lượng giá trị tham số MAX_CARS_RECEIVE trong
bảng PARAMETERS (Ví dụ: 30 xe), hệ thống báo lỗi và từ chối tiếp nhận.
2. Dữ liệu: Nếu biển số xe đã tồn tại trong bảng CARS, tự động hiển thị thông tin cũ.
Nếu chưa, tự động thêm mới vào bảng CUSTOMERS và CARS.
o

1.2.2 Biểu mẫu 2 và Quy định 2: Quản Lý Sửa Chữa (Service)
Mục đích: Ghi nhận chi tiết công việc, vật tư sử dụng và tính toán chi phí.
BM2: PHIẾU SỬA CHỮA (SERVICE TICKET)
 Số phiếu: ..................... Ngày lập: ..................... (service_date)
 Biển số xe: ................... Trạng thái: Chờ / Đang làm / Hoàn thành (status)
STT

Nội dung công
Đơn SL
Đơn giá
Loại
việc / Vật tư
vị
(quantity) (supply_price)

Tiền công
(labor_price)

Thành tiền
(total_price)

1

Thay nhớt
Castrol

Vật tư Lít

150.000

0

600.000

2

Công thay
nhớt

Công Lần 1

0

50.000

50.000

...

...

...

...

...

...

...

4

...

TỔNG CỘNG

650.000

QĐ2 (Quy định tính giá & Snapshot):
1. Nguồn dữ liệu: Vật tư lấy từ bảng SUPPLIES , Tiền công lấy từ bảng LABOR_FEES.
2. Cơ chế Snapshot (Quan trọng): Khi lập phiếu, đơn giá vật tư và tiền công phải được lưu
cứng vào các cột supply_price và labor_price trong bảng TICKET_DETAILS.
o

Mục đích: Nếu sau này Admin thay đổi giá niêm yết, các phiếu cũ không bị sai lệch
doanh thu.

3. Công thức tính:

o

o

Tổng tiền phiếu = Tổng thành tiền các dòng chi tiết

1.2.3 Biểu mẫu 3 và Quy định 3: Nhập Kho (Import)
Mục đích: Quản lý nguồn hàng đầu vào để đảm bảo có vật tư sửa chữa (Logic dựa trên nhóm bảng
Kho).
BM3: PHIẾU NHẬP KHO
 Nhà cung cấp: ................................. (Chọn từ SUPPLIERS)
 Ngày nhập: ...................................... (import_date)
STT Tên vật tư Đơn vị Số lượng nhập Giá vốn nhập (import_price) Thành tiền
1

Lọc gió

Cái

10

100.000

1.000.000

QĐ3 (Quy định kho):
1. Khi phiếu nhập được lưu, hệ thống tự động cộng dồn số lượng vào cột stock_qty trong bảng
SUPPLIES.
2. Giá vốn nhập (import_price) được lưu lại để tính toán chi phí đầu vào.
1.2.4 Biểu mẫu 4 và Quy định 4: Thu Tiền (Payment)
Mục đích: Thanh toán chi phí sửa chữa và quản lý công nợ khách hàng.
BM4: PHIẾU THU TIỀN
 Khách hàng: ...................................... Biển số: ........................
 Ngày thu: ............................................ (payment_date)
 Số tiền nợ hiện tại: .............................. (Lấy giá trị current_debt từ bảng CARS).
 Số tiền thu: .......................................... (amount).
QĐ4 (Quy định thu tiền):
1. Kiểm tra hợp lệ: Số tiền thu không được lớn hơn số tiền nợ hiện tại. Nếu Người dùng nhập
số tiền > current_debt, hệ thống báo lỗi và chặn giao dịch.
2. Cập nhật nợ: Sau khi lưu phiếu thu, hệ thống tự động trừ nợ cho xe:

1.2.5 Biểu mẫu 5: Hệ thống Báo cáo (Reporting)
BM5.1: BÁO CÁO DOANH SỐ

 Nguồn: Tính tổng total_amount từ bảng SERVICE_TICKETS theo tháng và theo hiệu xe
(brand_id).
 Cột: STT, Hiệu xe, Số lượt sửa, Thành tiền, Tỉ lệ.
BM5.2: BÁO CÁO TỒN KHO
Mục đích: Kiểm soát vật tư.
Công thức tính toán :




Tồn Cuối: Lấy trực tiếp từ cột stock_qty
Phát Sinh Nhập: Tổng quantity từ bảng IMPORT_DETAILS trong tháng.
Phát Sinh Xuất: Tổng quantity từ bảng TICKET_DETAILS trong tháng.



Tồn Đầu:

BM5.3: BÁO CÁO CÔNG NỢ
Nguồn: Lấy danh sách xe có current_debt > 0 từ bảng CARS.
1.2.6 Quy định 6: Thay đổi quy định (Configuration)
Mục đích: Giúp Admin cấu hình hệ thống động mà không cần can thiệp Code.
QĐ6: Admin được phép thay đổi các giá trị trong bảng PARAMETERS và các bảng danh mục:
1. Tham số: Thay đổi số lượng xe tối đa nhận trong ngày (MAX_CARS_RECEIVE).
2. Danh mục:
o

Thêm/Xóa/Sửa tên các Hiệu xe (CAR_BRANDS).

o

Cập nhật đơn giá niêm yết Tiền công (LABOR_FEES).

