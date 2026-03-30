# Source
docs/QuanLyGargaOto/BaoCao_GARA_OTO.pdf

# Conversion method
pdftotext

Huỳnh Lâm Vỹ - 227060038
Nguyễn Chí Nguyện – 227060172
Quách Trường Phúc - 226060168
Lê Thành Đạt – 227060036

MỤC LỤC
1.

2.

GIỚI THIỆU .............................................................................................................. 3
1.1.

Mục đích: ............................................................................................................ 3

1.2.

Phạm vi: .............................................................................................................. 3

ĐẶC TẢ YÊU CẦU..................................................................................................... 3
2.1 Quản lý tiếp nhận và sửa chữa xe: .............................................................................. 3
a.

Tiếp nhận xe sửa chữa: ......................................................................................... 3

b.

Lập phiếu sửa chữa: ............................................................................................. 4

2.2 Quản lý kho phụ tùng và vật tư: ................................................................................. 4
2.3 Quản lý thu tiền và công nợ: ...................................................................................... 4
2.4 Quản lý báo cáo định kỳ: ........................................................................................... 5
3.

MÔ HÌNH .................................................................................................................. 6
3.1 Sơ đồ hoạt vụ ( Use case diagram ): ............................................................................ 6
3.1.1. Tổng quát .......................................................................................................... 6
3.1.2 Phân hệ Tiếp nhận: ............................................................................................. 7
3.1.3. Phân hệ Lập phiếu sửa chữa: .............................................................................. 8
3.1.4 Phân hệ Quản lý Kho & Vật tư: ........................................................................... 8
3.1.5 Phân hệ Quản lý Thu tiền & Công nợ ................................................................... 9
3.1.6 Phân hệ Quản trị & Báo cáo .............................................................................. 10
3.2 Sơ đồ gói (Packet diagram): ..................................................................................... 12
a. Tổng quát:................................................................................................................ 12
b. Phân rã sơ đồ gói: ................................................................................................. 12
3.3 Sơ đồ lớp (Class diagram): ....................................................................................... 13
a. Sơ đồ: ................................................................................................................... 13
b. Phương thức: ........................................................................................................ 13

3.4 Sơ đồ tuần tự (Sequence diagram): ........................................................................... 24
a. Lập phiếu sửa chữa: .............................................................................................. 24
b. Thu Tiền:.............................................................................................................. 25
c. Nhập kho: ............................................................................................................. 25
3.5 Sơ đồ hoạt động (Activity Diagram): ........................................................................ 26
a. Lập phiếu sửa chữa: .............................................................................................. 26
b. Thu Tiền:.............................................................................................................. 27
c. Nhập kho: ............................................................................................................. 28

PHÂN TÍCH THIẾT KẾ PHẦN MỀM QUẢN LÝ GARA OTO

1. GIỚI THIỆU
1.1.
Mục đích:
- Nhằm nâng cao hiệu quả công tác quản lý sửa chữa xe và tin học hoá việc quản lý doanh
thu, vật liệu tại Gara. Nhóm thực hiện việc phân tích thiết kế phần mềm “Quản lý Gara Ô tô”
với các mục tiêu cụ thể:
•

1.2.

Tối ưu hoá thời gian: Rút ngắn quy trình tiếp nhận xe và lập phiếu sửa
chữa.
• Chính xác trong tài chính: Cung cấp thông tin công nợ khách hàng và
doanh thu hàng tháng một cách minh bạch, kịp thời.
• Quản lý vật tư hiệu quả: Theo dõi sát sao lượng tồn kho phụ tùng, hỗ trợ
lập kế hoạch nhập hàng hợp lý.
• Nâng cao trải nghiệm khách hàng: Lưu trữ lịch sử sửa chữa, giúp việc
tra cứu thông tin xe và chủ xe trở nên nhanh chóng.
Phạm vi:

Yêu cầu quản trị toàn bộ hoạt động của Gara từ khâu tiếp nhận xe, kiểm tra hỏng
hóc, báo giá vật tư/tiền công cho đến khâu thanh toán và báo cáo định kỳ.
• Cung cấp các biểu mẫu quản lý (Phiếu tiếp nhận, Phiếu sửa chữa, Phiếu thu
tiền) theo đúng quy chuẩn nghiệp vụ.
• Kết xuất các báo cáo doanh số và báo cáo tồn kho định kỳ hàng tháng cho
chủ Gara.
2. ĐẶC TẢ YÊU CẦU
2.1 Quản lý tiếp nhận và sửa chữa xe:
a. Tiếp nhận xe sửa chữa:
• Mô tả: Khi khách hàng mang xe đến, nhân viên Lễ tân thực hiện ghi nhận
thông tin bao gồm: Biển số xe, Tên chủ xe, Hiệu xe, Điện thoại và Địa chỉ.
• Logic hệ thống: * Hệ thống thực hiện tra cứu Biển số xe trong cơ sở dữ liệu:
* Nếu xe đã từng sửa chữa: Hệ thống tự động truy xuất các thông tin cũ
(Tên chủ xe, Địa chỉ...) để tiết kiệm thời gian nhập liệu.
* Nếu là xe mới: Nhân viên tiến hành nhập mới toàn bộ thông tin.
o Sau khi có thông tin xe, hệ thống thực hiện kiểm tra Quy định 1 (Số
xe tiếp nhận tối đa trong ngày):

o Trường hợp vượt định mức: Nếu số lượng xe đã tiếp nhận đạt
mức 30 xe, hệ thống hiển thị thông báo: "Hệ thống đã tiếp nhận đủ
xe trong ngày" và khóa chức năng tạo phiếu.
o Trường hợp hợp lệ: Hệ thống lưu thông tin vào bảng CARS và
CUSTOMERS, đồng thời kết xuất Phiếu tiếp nhận xe (BM1).
b. Lập phiếu sửa chữa:
• Cố vấn dịch vụ sẽ chọn xe từ danh sách xe đã tiếp nhận để tiến hành lập
Phiếu sửa chữa (BM2).
• Với mỗi nội dung hỏng hóc, nhân viên sẽ thực hiện chọn vật tư phụ tùng
và tiền công tương ứng:
• Logic hệ thống:
o Kiểm tra tồn kho: Khi chọn vật tư, hệ thống tự động đối chiếu số
lượng yêu cầu với lượng tồn thực tế trong kho. Nếu thiếu hàng, hệ
thống cảnh báo và yêu cầu điều chỉnh.
o Lưu giá hiện hành (Snapshot): Nếu đủ hàng, hệ thống tự động
lấy đơn giá vật tư (từ bảng SUPPLIES) và đơn giá tiền công (từ
bảng LABOR_FEES) để gán cứng vào chi tiết phiếu, nhằm tránh
sai lệch doanh thu nếu bảng giá gốc thay đổi sau này.
o Hệ thống tự động tính toán: Thành tiền = (Số lượng * Đơn giá
phụ tùng) + Đơn giá tiền công.
• Sau khi lưu phiếu, hệ thống tự động cộng dồn tổng tiền vào cột
current_debt (Tiền nợ hiện tại) trong hồ sơ xe của khách hàng.
2.2 Quản lý kho phụ tùng và vật tư:
• Nhập kho phụ tùng: Khi có hàng mới về, nhân viên Thủ kho tiến hành lập Phiếu
nhập hàng, cập nhật số lượng tồn kho và đơn giá vốn.
• Tra cứu phụ tùng: Hệ thống cho phép nhân viên xem danh sách phụ tùng, số lượng
tồn thực tế để chủ động trong việc tư vấn sửa chữa.
• Tính toán tồn kho: Cuối kỳ, hệ thống tổng hợp dữ liệu từ các Phiếu nhập và Phiếu
sửa chữa để xác định số lượng tồn đầu và tồn cuối của từng loại phụ tùng.
2.3 Quản lý thu tiền và công nợ:
• Mô tả: Khi khách hàng đến nhận xe sau khi sửa, nhân viên Thu ngân sẽ thực hiện
quy trình thanh toán và xoá nợ ( hoặc trừ nợ ) cho hồ sơ xe.
• Quy trình:
1. Truy xuất: Nhân viên nhập Biển số xe để truy xuất thông tin. Hệ thống hiển
thị các thông tin liên quan bao gồm: Tên chủ xe, Số điện thoại,… và đặc biệt

là Số tiền nợ hiện tại (current_debt) được tổng hợp từ các phiếu sửa chữa
trước đó.
2. Lập phiếu thu (BM4): Nhân viên nhập Số tiền khách đưa. Hệ thống tự động
tính toán và hiển thị Số tiền thối lại cho khách hàng (Tiền thối = Số tiền
khách đưa - Số tiền nợ).
3. Kiểm tra Quy định 4: Hệ thống xác định Số tiền thực thu (là số tiền thực
tế trừ vào nợ).
▪ Nếu “Số tiền thực thu” > “Số tiền nợ”, hệ thống sẽ ngăn chặn thao tác
lưu phiếu và hiển thị thông báo lỗi: “Số tiền thu không được vượt quá
số nợ của khách hàng”.
4. Cập nhật dữ liệu: Sau khi lưu phiếu thành công, hệ thống thực hiện:
▪ Ghi nhận giao dịch vào bảng PAYMENTS.
▪ Cập nhật lại số dư mới trong bảng CARS: Số nợ mới = Số nợ cũ – Số
tiền thu ).
▪ Kết xuất Hóa đơn thanh toán hiển thị đầy đủ các thông tin: Tổng nợ,
Số tiền thực thu và Tiền thối lại.
2.4 Quản lý báo cáo định kỳ:
• Báo cáo doanh số (BM5.1): * Mục đích: Theo dõi hiệu quả kinh doanh của Gara
theo từng tháng.
o Nội dung: Hệ thống tổng hợp dữ liệu để thống kê số lượt sửa chữa, tổng
doanh thu và tỷ lệ (%) đóng góp của từng Hiệu xe (Toyota, Honda, Kia...).
• Báo cáo tồn kho (BM5.2): * Mục đích: Kiểm soát lượng vật tư biến động trong
kỳ để có kế hoạch nhập hàng.
o Nội dung: Thống kê chi tiết cho từng loại phụ tùng bao gồm: Tồn đầu tháng,
Số lượng nhập mới, Số lượng xuất (để sửa chữa) và Tồn cuối tháng.

3. MÔ HÌNH
3.1 Sơ đồ hoạt vụ ( Use case diagram ):
3.1.1. Tổng quát

3.1.2 Phân hệ Tiếp nhận:
a. Đặc tả chi tiết:
o Tác nhân: Nhân viên Lễ tân
o Mô tả: Ghi nhận thông tin xe vào xưởng và kiểm tra định mức tiếp nhận tối
đa trong ngày (<=30 xe /ngày).
o Tiền điều kiện: Nhân viên đã đăng nhập vào hệ thống.
o Luồng sự kiện chính:
1. Lễ tân chọn chức năng "Tiếp nhận xe".
2. Hệ thống tự động kiểm tra số lượng xe đã nhận trong ngày.
a. Nếu số lượng xe > 30: Hệ thống sẽ thông báo “Đã tiếp nhận đủ số
lượng xe trong ngày” và không cho tao phiếu tiếp nhận xe.
3. Lễ tân nhập biển số xe để tra cứu thông tin.
4. Hệ thống hiển thị thông tin cũ (nếu có) hoặc cho phép nhập mới hoàn
toàn.
5. Lễ tân nhấn "Lưu phiếu", hệ thống ghi dữ liệu vào bảng CARS,
CUSTOMERS và kết xuất Phiếu tiếp nhận (BM1).
o Hậu điều kiện: Xe mới được ghi nhận vào danh sách chờ sửa chữa.
b. Sơ đồ phân rã:

3.1.3. Phân hệ Lập phiếu sửa chữa:
a. Đặc tả chi tiết:
o Tác nhân: Cố vấn dịch vụ
o Mô tả: Lập danh sách các hạng mục hỏng hóc, vật tư thay thế và tiền công
tương ứng.
o Tiền điều kiện: Xe đã được Lễ tân tiếp nhận vào xưởng.
o Luồng sự kiện chính:
1. Cố vấn dịch vụ chọn xe từ danh sách xe đang chờ sửa chữa
2. Cố vấn thêm nội dung công việc. Khi chọn Vật tư phụ tùng, hệ thống bắt
buộc thực hiện Kiểm tra tồn kho.
3. Nếu số lượng tồn kho hợp lệ (Đủ hàng), hệ thống tự động điền đơn giá vật
tư và tiền công hiện tại.
4. Hệ thống thực hiện Lưu giá hiện hành (Snapshot) vào chi tiết phiếu để
tránh sai lệch báo cáo sau này (Theo QĐ2).
5. Hệ thống tự động tính tổng thành tiền của phiếu.
6. Cố vấn nhấn "Lưu phiếu", hệ thống tự động Cập nhật công nợ (cộng dồn
số tiền vào current_debt của khách hàng).
o Luồng ngoại lệ:
▪ Tại bước 2 (Thiếu vật tư): Hệ thống phát hiện số lượng tồn kho < số lượng
yêu cầu.
• Hệ thống hiển thị cảnh báo: "Phụ tùng trong kho không đủ".
• Cố vấn dịch vụ phải giảm số lượng hoặc chọn loại vật tư khác.
b. Sơ đồ phân rã:

3.1.4 Phân hệ Quản lý Kho & Vật tư:
a. Đặc tả chi tiết:
• Use Case: Nhập kho phụ tùng

o Tác nhân: Thủ kho.
o Mô tả: Ghi nhận vật tư mới nhập xưởng để cập nhật giá vốn và số lượng.
o Logic: Hệ thống thực hiện Cập nhật số lượng tồn, tự động cộng dồn số
lượng thực nhập vào cột stock_qty trong bảng SUPPLIES.
• Use Case: Tra cứu phụ tùng
o Tác nhân: Thủ kho, Cố vấn dịch vụ.
o Mô tả: Cho phép xem danh sách phụ tùng, đơn giá niêm yết và số lượng tồn
hiện tại để chủ động trong việc sửa chữa.
• Use Case: Tính toán tồn kho
o Tác nhân: Thủ kho.
o Mô tả: Cuối kỳ, hệ thống quét dữ liệu từ các Phiếu nhập và Phiếu sửa chữa
(đã xuất vật tư) để tính toán số dư.
o Logic: Thực hiện Kết xuất Báo cáo tồn kho (BM5.2) hiển thị các thông tin:
Tồn đầu, Nhập, Xuất và Tồn cuối của từng loại vật tư.
b. Sơ đồ phân rã:

3.1.5 Phân hệ Quản lý Thu tiền & Công nợ
a. Đặc tả chi tiết:
• Use Case: Lập phiếu thu tiền
• Tác nhân: Thu ngân.
• Mô tả: Thực hiện ghi nhận số tiền khách thanh toán để trừ vào công nợ của xe.

• Tiền điều kiện: Xe đã được lập phiếu sửa chữa và có phát sinh nợ
(current_debt > 0).
• Luồng sự kiện chính:
1. Thu ngân nhập biển số xe để truy xuất thông tin nợ.
2. Hệ thống thực hiện Truy xuất nợ cũ, hiển thị số tiền khách đang nợ.
3. Thu ngân nhập số tiền khách muốn trả.
4. Hệ thống thực hiện Kiểm tra Quy định 4: Nếu số tiền thu lớn hơn số tiền
đang nợ, hệ thống sẽ báo lỗi và ngăn chặn việc lưu phiếu.
5. Nếu hợp lệ, Thu ngân nhấn "Lưu phiếu".
• Hậu điều kiện: Số nợ của khách được cập nhật giảm xuống.
• Use Case: Cập nhật số dư nợ mới
• Mô tả: Hệ thống tự động tính toán lại: Nợ mới = Nợ cũ - Số tiền thực thu và
cập nhật vào bảng CARS.
• Use Case: In hóa đơn thanh toán
• Mô tả: Kết xuất ra biểu mẫu (BM4) hiển thị tổng nợ, số tiền đã thu và số nợ còn
lại (nếu có) để giao cho khách hàng.
b.Sơ đồ phân rã:

3.1.6 Phân hệ Quản trị & Báo cáo
a. Đặc tả chi tiết:
• Use Case: Báo cáo doanh số (BM5.1)
o Tác nhân: Quản trị viên.

o Mô tả: Hệ thống tổng hợp dữ liệu từ các phiếu thu trong tháng để thống kê
doanh thu theo từng hiệu xe.
o Logic: Tính toán số lượt sửa chữa và tỉ lệ doanh thu (%) của từng hiệu xe
(Toyota, Honda, Kia...) để xuất biểu mẫu BM5.1.
• Use Case: Báo cáo tồn kho (BM5.2)
o Tác nhân: Quản trị viên (hoặc Thủ kho có quyền xem).
o Mô tả: Thống kê lượng phụ tùng biến động trong tháng.
o Logic: Tổng hợp từ phiếu nhập và phiếu sửa chữa để xác định: Tồn đầu, Nhập,
Xuất, Tồn cuối.
• Use Case: Thay đổi quy định (QĐ6)
o Tác nhân: Quản trị viên.
o Mô tả: Cho phép cập nhật các tham số hệ thống mà không cần sửa code.
o Nội dung: Thay đổi số xe tiếp nhận tối đa (QĐ1), đơn giá tiền công mới, hoặc
thay đổi tỉ lệ đơn giá bán so với giá vốn.
b. Sơ đồ phân rã:

3.2 Sơ đồ gói (Packet diagram):
a. Tổng quát:

b. Phân rã sơ đồ gói:

3.3 Sơ đồ lớp (Class diagram):
a. Sơ đồ:

b. Phương thức:

1. Bảng KHACH_HANG

STT

Tên thuộc tính

Kiểu

Kích
thước

Số chữ số
thập phân

Miền giá Trị mặc
trị
nhiên

Min Max

Khóa
chính

Ràng buộc Ràng buộc
Duy Not
Diễn
toàn vẹn
toàn vẹn
nhất Null
giải
luận lý
khóa ngoài

1

MaKH

Int

4

0

Số
nguyên
dương

1

x

x

2

TenChuXe

Nvarchar

50

0

Chuỗi ký
tự

3

DienThoai

Varchar

15

0

Số điện
thoại hợp
lệ

4

DiaChi

Nvarchar

100

0

Chuỗi ký
tự

Auto
Increment

10
số

∞

15
số

x

MaKH > 0

Mã
khách
hàng

x

Không rỗng

Tên chủ
xe

x

Đúng định
dạng số điện
thoại

Số điện
thoại
khách
hàng

x

Không rỗng

Địa chỉ
khách
hàng

2. Bảng HIEU_XE

STT

Tên thuộc
Kiểu
tính

Số chữ
Kích
Miền
số thập
thước
giá trị
phân

1

MaHieuXe Int

4

0

Số
nguyên
dương

2

TenHieuXe Nvarchar 30

0

Chuỗi
ký tự

Trị mặc
nhiên

Ràng buộc
Khóa Duy Not
toàn vẹn
Min Max
chính nhất Null
luận lý

Auto
1
Increment

∞

x

Ràng
buộc
Diễn
toàn vẹn
giải
khóa
ngoài

x

x

MaHieuXe >
0

Mã
hiệu
xe

x

x

Không rỗng

Tên
hiệu
xe

3. Bảng XE

STT

Tên thuộc
tính

Kiểu

Số
chữ
Kích
Miền Trị mặc
số
thước
giá trị nhiên
thập
phân

1

MaXe

Int

4

0

Số
Auto
nguyên
1
Increment
dương

2

BienSo

Varchar 15

0

Biển số
hợp lệ

3

MaHieuXe

Int

4

0

Số
nguyên
dương

1

4

MaKH

Int

4

0

Số
nguyên
dương

1

2

Số
không
âm

5

TienNoHienTai Decimal 12

0

Min Max

0

∞

Khóa Duy Not Ràng buộc toàn
chính nhất Null vẹn luận lý

x

x

MaXe > 0

Mã xe

x

x

Đúng định dạng
biển số

Biển
số xe

∞

x

Phải tồn tại trong
x
HIEU_XE

Mã
hiệu
xe

∞

x

Phải tồn tại trong
x
KHACH_HANG

Mã
khách
hàng

TienNoHienTai ≥
0

Số
tiền
khách
còn
nợ

∞

x

Ràng
buộc
toàn Diễn
vẹn
giải
khóa
ngoài

x

4. Bảng PHIEU_SUA_CHUA

STT

1

2

3

4

5

Tên thuộc
tính

Kiểu

MaPhieuSC Int

MaXe

NgaySC

TrangThai

TongTien

Int

Số
chữ
Kích
Trị mặc
số
Miền giá trị
thước
nhiên
thập
phân

4

4

Date

Nvarchar 20

Decimal 12

0

Số nguyên
dương

0

Số nguyên
dương

0

Ngày hợp lệ

0

{TiepNhan,
DangSua,
HoanTat}

2

Số không
âm

Min Max

Auto
1
Increment

1

∞

∞

Current
Date

TiepNhan

0

0

∞

Ràng buộc
Khóa Duy Not
toàn vẹn
chính nhất Null
luận lý

x

x

Ràng
buộc
toàn
vẹn
khóa
ngoài

Diễn
giải

x

MaPhieuSC
>0

Mã
phiếu
sửa
chữa

x

Phải tồn tại
trong XE

Mã xe
được
sửa
chữa

x

Không lớn
hơn ngày
hiện tại

Ngày
lập
phiếu
sửa
chữa

x

Thuộc tập
trạng thái
cho phép

Trạng
thái
phiếu
sửa
chữa

TongTien ≥
0

Tổng
tiền
phiếu
sửa
chữa

x

x

5. Bảng TIEN_CONG

STT

Tên thuộc
tính

1

MaTienCong Int

2

3

NoiDung

DonGia

Kiểu

Số
Kích chữ số Miền
thước thập giá trị
phân

4

Nvarchar 100

Decimal 12

0

Trị mặc
nhiên

Ràng
buộc
Ràng buộc
Khóa Duy Not
toàn
toàn vẹn luận
Min Max
vẹn
chính nhất Null
lý
khóa
ngoài

Số
Auto
nguyên
1
Increment
dương

0

Chuỗi
ký tự

2

Số
dương

∞

x

x

x

∞

x

x

x

Diễn
giải

MaTienCong
>0

Mã
tiền
công

Không rỗng

Nội
dung
công
việc
sửa
chữa

DonGia ≥ 0

Đơn
giá
tiền
công

0

0

Trị mặc
nhiên

Ràng
buộc
Ràng buộc
Khóa Duy Not
toàn
toàn vẹn luận
Min Max
vẹn
chính nhất Null
lý
khóa
ngoài

6. Bảng VAT_TU

STT

Tên thuộc
tính

Kiểu

Số
Kích chữ số Miền
thước thập giá trị
phân

1

MaVatTu

Int

4

0

Số
nguyên
dương

2

TenVatTu

Nvarchar 50

0

Chuỗi
ký tự

3

DonViTinh

Nvarchar 20

0

Chuỗi
ký tự

0

Số
nguyên
không
âm

4

SoLuongTon Int

4

Auto
1
Increment

0

0

∞

∞

x

Diễn
giải

x

x

MaVatTu > 0

Mã vật
tư

x

x

Không rỗng

Tên
vật tư

x

Không rỗng

Đơn vị
tính

x

SoLuongTon
≥0

Số
lượng
tồn
kho

Số
Kích chữ số Miền
thước thập giá trị
phân

Trị mặc
nhiên

Ràng
buộc
Ràng buộc
Khóa Duy Not
toàn
toàn vẹn luận
Min Max
vẹn
chính nhất Null
lý
khóa
ngoài

Diễn
giải

STT

Tên thuộc
tính

Kiểu

5

GiaVon

Decimal 12

2

Số
không
âm

0

0

∞

x

GiaVon ≥ 0

Giá
nhập

6

DonGiaBan Decimal 12

2

Số
không
âm

0

0

∞

x

DonGiaBan ≥
0

Giá
bán
vật tư

7. Bảng CT_PHIEU_SUA_CHUA

STT

1

2

3

Tên thuộc tính Kiểu

MaCTSC

MaPhieuSC

MaVatTu

Int

Int

Int

Số
chữ
Kích
số
Miền Trị mặc
thướ
thập giá trị nhiên
c
phâ
n

4

4

4

Ràng
buộc
Khóa Duy Not
toàn
Mi Ma
Ràng buộc toàn vẹn
Diễn
chín nhấ Nul
vẹn
n
x
luận lý
giải
khóa
h
t
l
ngoà
i

x

MaCTSC > 0

Mã
chi
tiết
phiếu
sửa
chữa

∞

x

Phải tồn tại trong
PHIEU_SUA_CHU
A

x

Mã
phiếu
sửa
chữa

1

∞

x

Phải tồn tại trong
VAT_TU

x

Mã
vật tư

1

∞

x

Phải tồn tại trong
TIEN_CONG

x

Mã
tiền
công

1

∞

x

SoLuong ≥ 1

0

Số
Auto
nguyê
Incremen 1
n
t
dương

0

Số
nguyê
n
dương

1

0

Số
nguyê
n
dương

4

MaTienCong

Int

4

0

Số
nguyê
n
dương

5

SoLuong

Int

4

0

Số
1
nguyê

∞

x

x

Số
lượng
vật tư

STT

6

7

8

Tên thuộc tính Kiểu

DonGiaVatTu

Số
chữ
Kích
số
Miền Trị mặc
thướ
thập giá trị nhiên
c
phâ
n

Decima
12
l

2

DonGiaTienCo Decima
12
ng
l

ThanhTien

2

Decima
12
l

2

Ràng
buộc
Khóa Duy Not
toàn
Mi Ma
Ràng buộc toàn vẹn
Diễn
chín nhấ Nul
vẹn
n
x
luận lý
giải
khóa
h
t
l
ngoà
i

n
dương

sử
dụng

Số
không 0
âm

DonGiaVatTu ≥ 0

Đơn
giá
vật tư
tại
thời
điểm
sửa

x

DonGiaTienCong ≥
0

Đơn
giá
tiền
công
tại
thời
điểm
sửa

x

ThanhTien =
SoLuong *
DonGiaVatTu +
DonGiaTienCong

Thàn
h tiền
của
dòng
chi
tiết

Số
không 0
âm

Số
không 0
âm

0

0

0

∞

x

∞

∞

8. Bảng NHA_CUNG_CAP

STT

Tên thuộc
Kiểu
tính

Số chữ
Kích
Miền
số thập
thước
giá trị
phân

1

MaNCC

Int

4

0

Số
nguyên
dương

2

TenNCC

Nvarchar 50

0

Chuỗi
ký tự

Trị mặc
nhiên

Ràng
Ràng buộc buộc
Khóa Duy Not
Diễn
toàn vẹn toàn vẹn
Min Max
chính nhất Null
giải
khóa
luận lý
ngoài

Auto
1
Increment

∞

x

x

x

MaNCC >
0

Mã nhà
cung
cấp

x

x

Không
rỗng

Tên nhà
cung
cấp

STT

3

4

Tên thuộc
Kiểu
tính

DienThoai Varchar

DiaChi

Số chữ
Kích
Miền
số thập
thước
giá trị
phân

15

Nvarchar 100

0

Số điện
thoại
hợp lệ

0

Chuỗi
ký tự

Trị mặc
nhiên

Ràng
Ràng buộc buộc
Khóa Duy Not
Diễn
toàn vẹn toàn vẹn
Min Max
chính nhất Null
giải
khóa
luận lý
ngoài

10
số

15
số

x

Đúng định
dạng số
điện thoại

Số điện
thoại
nhà
cung
cấp

x

Không
rỗng

Địa chỉ
nhà
cung
cấp

9. Bảng PHIEU_NHAP_KHO

STT

1

Tên thuộc
tính

Kiểu

MaPhieuNhap Int

2

MaNCC

Int

3

NgayNhap

Date

4

TongTien

Số
chữ
Kích
Miền Trị mặc
số
thước
giá trị nhiên
thập
phân

4

4

Decimal 12

Min Max

0

Số
Auto
nguyên
1
Increment
dương

0

Số
nguyên
dương

0

Ngày
hợp lệ

2

Số
không
âm

1

∞

∞

Current
Date

0

0

∞

Khóa Duy Not Ràng buộc toàn
chính nhất Null vẹn luận lý

x

x

Ràng
buộc
toàn Diễn
vẹn
giải
khóa
ngoài

x

MaPhieuNhap > 0

Mã
phiếu
nhập
kho

x

Phải tồn tại trong
x
NHA_CUNG_CAP

Mã
nhà
cung
cấp

x

Không lớn hơn
ngày hiện tại

Ngày
nhập
kho

TongTien ≥ 0

Tổng
tiền
phiếu
nhập

x

10. Bảng CT_PHIEU_NHAP

STT

1

Tên thuộc
tính

MaCTPN

Kiểu

Int

Số
chữ
Kích
Miền Trị mặc
số
thước
giá trị nhiên
thập
phân

4

Ràng
buộc
Khóa Duy Not Ràng buộc toàn vẹn toàn Diễn
Min Max
vẹn giải
chính nhất Null luận lý
khóa
ngoài

0

Số
Auto
nguyên
1
Increment
dương

1

x

MaCTPN > 0

Mã
chi
tiết
phiếu
nhập

∞

x

Phải tồn tại trong
x
PHIEU_NHAP_KHO

Mã
phiếu
nhập
kho
Mã
vật tư

∞

x

x

2

MaPhieuNhap Int

4

0

Số
nguyên
dương

3

MaVatTu

Int

4

0

Số
nguyên
dương

1

∞

x

Phải tồn tại trong
VAT_TU

4

SoLuong

Int

4

0

Số
nguyên 1
dương

1

∞

x

SoLuong ≥ 1

Số
lượng
nhập

5

DonGiaNhap Decimal 12

2

Số
không 0
âm

0

∞

x

DonGiaNhap ≥ 0

Đơn
giá
nhập

2

Số
không 0
âm

x

ThanhTien =
SoLuong *
DonGiaNhap

Thành
tiền
dòng
nhập

6

ThanhTien

Decimal 12

0

∞

x

11. Bảng PHIEU_THU_TIEN

STT

Tên thuộc
tính

Kiểu

Số
chữ
Kích
Miền
số
thước
giá trị
thập
phân

Trị mặc
nhiên

Ràng
buộc
Khóa Duy Not Ràng buộc toàn toàn
Min Max
vẹn
chính nhất Null vẹn luận lý
khóa
ngoài

1

MaPhieuThu Int

4

0

Số
Auto
nguyên
1
Increment
dương

2

MaXe

Int

4

0

Số
nguyên
dương

3

NgayThu

Date

0

Ngày
hợp lệ

2

Số
dương

0

Chuỗi
ký tự

4

5

SoTienThu

GhiChu

Decimal 12

Nvarchar 100

1

∞

∞

x

x

Current
Date

0

0

∞

Diễn
giải

x

MaPhieuThu > 0

Mã
phiếu
thu
tiền

x

Phải tồn tại trong
x
XE

Mã xe
thanh
toán

x

Không lớn hơn
ngày hiện tại

Ngày
thu
tiền

x

SoTienThu > 0
và SoTienThu ≤
TienNoHienTai

Số tiền
khách
thanh
toán
Ghi
chú
thanh
toán

12. Bảng QUY_DINH
Số chữ
Kích số
Miền
thước thập giá trị
phân

STT

Tên thuộc
tính

1

MaQuyDinh Int

4

0

Số
Auto
nguyên
1
Increment
dương

2

TenQuyDinh Nvarchar 50

0

Chuỗi
ký tự

3

GiaTri

2

Số
không
âm

Kiểu

Decimal 12

Trị mặc
nhiên

Ràng
buộc
Ràng buộc
Khóa Duy Not
toàn
toàn vẹn luận
Min Max
vẹn
chính nhất Null
lý
khóa
ngoài

0

0

∞

∞

x

Diễn
giải

x

x

MaQuyDinh
>0

Mã
quy
định

x

x

Không rỗng

Tên
quy
định

x

GiaTri ≥ 0

Giá
trị

STT

Tên thuộc
tính

Kiểu

Số chữ
Kích số
Miền
thước thập giá trị
phân

Trị mặc
nhiên

Ràng
buộc
Ràng buộc
Khóa Duy Not
toàn
toàn vẹn luận
Min Max
vẹn
chính nhất Null
lý
khóa
ngoài

Diễn
giải

quy
định

4

MoTa

Nvarchar 100

0

Chuỗi
ký tự

3.4 Sơ đồ tuần tự (Sequence diagram):
a. Lập phiếu sửa chữa:

Mô tả
quy
định

b. Thu Tiền:

c. Nhập kho:

3.5 Sơ đồ hoạt động (Activity Diagram):
a. Lập phiếu sửa chữa:

b. Thu Tiền:

c. Nhập kho:

