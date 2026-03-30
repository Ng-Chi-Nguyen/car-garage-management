# Source
docs/project/MoTaDeTai.pdf

# Conversion method
pdftotext

MÔ TẢ ĐỀ TÀI: XÂY DỰNG HỆ THỐNG PHẦN MỀM QUẢN LÝ GARA Ô TÔ
1. Đặt vấn đề và tính cấp thiết
Trong bối cảnh lượng phương tiện ô tô cá nhân gia tăng nhanh chóng, nhu cầu bảo dưỡng và
sửa chữa tại các Gara trở nên cấp thiết hơn bao giờ hết. Tuy nhiên, quy trình vận hành thủ
công tại đa số các Gara hiện nay đang bộc lộ nhiều hạn chế nghiêm trọng:


Quản lý thông tin rời rạc: Việc lưu trữ hồ sơ trên sổ sách hoặc Excel khiến việc tra
cứu lịch sử sửa chữa ("bệnh án" của xe) gặp nhiều khó khăn, làm giảm chất lượng tư
vấn và trải nghiệm khách hàng.



Thất thoát kho phụ tùng: Không kiểm soát được chính xác biến động nhập - xuất - tồn
của hàng trăm mã vật tư, dẫn đến tình trạng hết hàng cục bộ hoặc thất thoát không rõ
nguyên nhân.



Sai sót trong quản lý tài chính: Việc tính toán thủ công chi phí (tiền công, vật tư) và
quản lý công nợ thường xuyên xảy ra nhầm lẫn, gây khó khăn cho việc thu hồi vốn và
đối soát doanh thu.



Thiếu tính linh hoạt: Hệ thống cũ khó thích nghi kịp thời khi Gara thay đổi quy định
kinh doanh (VD: thay đổi định mức xe tiếp nhận, điều chỉnh bảng giá dịch vụ).

Xuất phát từ thực tế đó, đề tài "Xây dựng hệ thống phần mềm quản lý Gara Ô tô" được thực
hiện nhằm mục tiêu tin học hóa toàn diện quy trình nghiệp vụ, mang lại công cụ quản lý chặt
chẽ, minh bạch và tối ưu hóa hiệu quả kinh doanh cho doanh nghiệp.
2. Mục tiêu của đề tài
Hệ thống được xây dựng hướng đến các mục tiêu cụ thể sau:


Chuẩn hóa quy trình nghiệp vụ: Xây dựng luồng xử lý khép kín từ: Tiếp nhận xe ->
Chẩn đoán & Báo giá -> Xuất kho & Sửa chữa -> Thanh toán & Bàn giao.



Kiểm soát tuân thủ quy định: Đảm bảo các quy tắc nghiệp vụ được thực thi tự động
(Ví dụ: Cảnh báo khi vượt quá số lượng xe tiếp nhận trong ngày, chặn thanh toán khi
thu quá số tiền nợ).



Quản lý kho chính xác: Tự động hóa việc trừ kho khi sửa chữa và cộng kho khi nhập
hàng, cung cấp số liệu tồn kho theo thời gian thực (Real-time).



Hỗ trợ ra quyết định: Cung cấp hệ thống báo cáo trực quan về doanh thu, hiệu suất
làm việc của nhân viên và xu hướng hỏng hóc của các dòng xe.

3. Phạm vi và Quy trình nghiệp vụ

3.1. Đối tượng sử dụng (Actors)
Hệ thống phân quyền phục vụ cho các nhóm đối tượng:


Quản trị viên (Admin): Cấu hình hệ thống, quản lý nhân sự.



Nhân viên Lễ tân: Tiếp nhận, điều phối xe.



Cố vấn dịch vụ / Kỹ thuật viên: Lập phiếu sửa chữa, yêu cầu vật tư.



Thủ kho: Quản lý xuất nhập tồn vật tư.



Thu ngân: Thu tiền và quản lý công nợ.

3.2. Mô tả các quy trình nghiệp vụ chính
a. Quy trình Tiếp nhận xe (Check-in): Nhân viên lễ tân ghi nhận thông tin xe vào xưởng,
hệ thống hỗ trợ tra cứu nhanh hồ sơ khách hàng cũ.


Cơ chế kiểm soát: Hệ thống tự động kiểm tra tham số "Số xe tối đa trong ngày" (Ví
dụ: 30 xe). Nếu số lượng xe hiện tại đã đạt ngưỡng, hệ thống sẽ cảnh báo và chặn tiếp
nhận mới để đảm bảo chất lượng phục vụ.

b. Quy trình Dịch vụ và Sửa chữa (Service & Repair): Cố vấn dịch vụ lập Phiếu Sửa
Chữa (Service Ticket), bao gồm:


Vật tư phụ tùng: Lấy từ danh mục kho, tự động điền đơn giá bán.



Tiền công: Lấy từ bảng giá dịch vụ niêm yết.



Cơ chế Snapshot (Lưu vết giá): Các đơn giá vật tư và tiền công được lưu trữ cố định
tại thời điểm lập phiếu. Điều này đảm bảo tính chính xác của dữ liệu lịch sử và doanh
thu ngay cả khi bảng giá gốc sau này có sự điều chỉnh.

c. Quy trình Quản lý Kho (Inventory): Hệ thống quản lý chặt chẽ đầu vào và đầu ra của
vật tư:


Nhập hàng: Số lượng cộng dồn vào kho, cập nhật giá vốn (Weighted Average Cost
hoặc LIFO/FIFO tùy cấu hình).



Xuất hàng: Khi lập phiếu sửa chữa, số lượng vật tư tương ứng tự động được trừ khỏi
kho.



Công thức báo cáo: Tồn Cuối = Tồn Đầu + Nhập - Xuất.

d. Quy trình Thu tiền và Công nợ (Finance): Sau khi hoàn tất sửa chữa, thu ngân lập
Phiếu Thu Tiền.



Cơ chế kiểm soát: Hệ thống bắt buộc số tiền thu không được vượt quá số tiền khách
đang nợ. Sau khi thu, công nợ của xe được cập nhật giảm trừ tự động, đảm bảo dữ
liệu tài chính luôn đồng bộ.

e. Cấu hình tham số động (Dynamic Configuration): Cho phép Quản trị viên tùy biến các
quy định kinh doanh mà không cần can thiệp vào Source Code, bao gồm:


Thay đổi số lượng xe tối đa tiếp nhận trong ngày.



Cập nhật danh sách Hiệu xe, Tiền công, Tỉ lệ lãi suất vật tư.

4. Các phân hệ chức năng chính
Hệ thống được tổ chức thành 06 phân hệ (Module) chuyên biệt:
1. Phân hệ Hệ thống: Đăng nhập, phân quyền (RBAC), sao lưu dữ liệu và cấu hình
tham số.
2. Phân hệ Danh mục: Quản lý dữ liệu nền tảng (Hiệu xe, Tiền công, Nhà cung cấp,
Khách hàng).
3. Phân hệ Lễ tân: Dashboard theo dõi trạng thái xưởng, Tiếp nhận xe, Tra cứu lịch sử.
4. Phân hệ Kho: Quản lý danh mục vật tư, Nhập kho, Thẻ kho, Báo cáo tồn.
5. Phân hệ Sửa chữa: Lập phiếu dịch vụ, Cập nhật tiến độ, In báo giá/quyết toán.
6. Phân hệ Tài chính: Quản lý công nợ, Lập phiếu thu, Báo cáo doanh thu và công nợ.
5. Yêu cầu phi chức năng và Công nghệ


Tính bảo mật: Mật khẩu được mã hóa (MD5/Bcrypt), phân quyền chức năng chi tiết
theo vai trò.



Giao diện: Thân thiện, dễ sử dụng, hỗ trợ tìm kiếm thông tin nhanh.



Công nghệ dự kiến:
o

Ngôn ngữ: [Nodejs, Reactjs]

o

Cơ sở dữ liệu: [MySQL]

o

Nền tảng: [Web Application ]

