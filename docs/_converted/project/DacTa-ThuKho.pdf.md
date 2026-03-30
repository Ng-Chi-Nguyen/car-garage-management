# Source
docs/project/DacTa-ThuKho.pdf

# Conversion method
pdftotext

1. Lập phiếu nhập kho (Import Supply)
1.1. Đặc tả (Functional Specification)
• Tên chức năng: Lập phiếu nhập kho
• Tác nhân kích hoạt (Trigger): Người dùng điều hướng đến phần "Nhập vật tư" và bắt đầu một giao
dịch nhập kho mới (biểu mẫu BM3).
• Dữ liệu vào (Input):
• Nhà cung cấp: Chọn từ danh sách NHA_CUNG_CAP.
• Ngày nhập: Mặc định là ngày/giờ hiện tại.
• Chi tiết nhập kho (Dạng bảng):
• Tên vật tư: Chọn từ danh sách VẬT_TƯ.
• Số lượng: Số lượng nhập (Số nguyên, > 0).
• Đơn giá nhập: Giá vốn cho lô hàng này (Số thập phân, >= 0).
• Dữ liệu ra (Output):
• Bản ghi mới được tạo trong bảng PHIEU_NHAP.
• Các bản ghi mới được tạo trong bảng CT_PHIEU_NHAP.
• Cập nhật so_luong_ton và don_gia_nhap trong bảng VAT_TU.
• Quy định liên quan (Logic/Validation):
• Tính tổng tiền: PHIEU_NHAP.tong_tien là tổng của (so_luong * don_gia_nhap) của tất cả các mặt
hàng trong phiếu.
• Cập nhật tồn kho (QĐ3): Sau khi lưu thành công, đối với mỗi mặt hàng:
• VAT_TU.so_luong_ton = VAT_TU.so_luong_ton + CT_PHIEU_NHAP.so_luong.
• Cập nhật giá (QĐ3): Cập nhật đơn giá nhập gần nhất cho vật tư:
• VAT_TU.don_gia_nhap = CT_PHIEU_NHAP.don_gia_nhap.
• Toàn vẹn dữ liệu: Tất cả các trường bắt buộc trong bảng chi tiết phải được điền đầy đủ trước khi cho
phép lưu.

1.2. Use Case
• Tác nhân: Nhân viên kho / Quản trị viên.
• Tiền điều kiện:
• Người dùng đã đăng nhập vào hệ thống.
• Thông tin Vật tư và Nhà cung cấp đã được khai báo trước đó trong hệ thống.
• Luồng chính (Main Flow):
• Tác nhân chọn "Lập phiếu nhập kho" từ menu chức năng.
• Hệ thống hiển thị biểu mẫu nhập kho (BM3).
• Tác nhân chọn Nhà cung cấp và kiểm tra Ngày nhập.
• Tác nhân thêm một hoặc nhiều vật tư vào danh sách nhập:
a. Chọn vật tư từ danh sách gợi ý.
b. Nhập số lượng và đơn giá nhập tương ứng.
• Hệ thống tự động tính toán thành tiền cho từng dòng và tổng giá trị của toàn bộ phiếu nhập.
• Tác nhân nhấn nút "Lưu".
• Hệ thống kiểm tra tính hợp lệ của dữ liệu và cập nhật cơ sở dữ liệu ( PHIEU_NHAP,
CT_PHIEU_NHAP, và VAT_TU).
• Hệ thống hiển thị thông báo "Lưu phiếu nhập thành công".

• Luồng phụ (Alternate Flows):
• Số lượng hoặc Đơn giá không hợp lệ: Nếu tác nhân nhập số lượng ≤ 0 hoặc đơn giá < 0, hệ thống
hiển thị thông báo lỗi và yêu cầu chỉnh sửa trước khi lưu.
• Chưa có chi tiết vật tư: Nếu tác nhân nhấn "Lưu" khi chưa thêm bất kỳ vật tư nào, hệ thống sẽ cảnh
báo "Vui lòng thêm ít nhất một vật tư vào phiếu nhập".

2. Tra cứu tồn kho (View Inventory List)
2.1. Đặc tả (Functional Specification)
• Tên chức năng: Tra cứu tồn kho
• Tác nhân kích hoạt (Trigger): Người dùng chọn chức năng "Danh sách tồn kho" hoặc "Quản lý kho"
từ bảng điều khiển chính.
• Dữ liệu vào (Input):
• (Tùy chọn) Từ khóa tìm kiếm: Tìm kiếm theo tên hoặc mã vật tư.
• Dữ liệu ra (Output):
• Danh sách các vật tư được truy xuất từ bảng VAT_TU.
• Các thông tin hiển thị bao gồm: Mã vật tư, Tên vật tư, Đơn vị tính, Số lượng tồn hiện tại, Đơn giá
nhập gần nhất, Đơn giá bán hiện hành.
• Quy định liên quan (Logic/Validation):
• Dữ liệu được truy vấn thời gian thực từ bảng VAT_TU.
• Mặc định danh sách được sắp xếp theo Tên vật tư (A-Z) hoặc theo Mã vật tư giảm dần.

2.2. Use Case
• Tác nhân: Nhân viên / Quản trị viên.
• Tiền điều kiện:
• Người dùng đã đăng nhập thành công vào hệ thống.
• Luồng chính (Main Flow):
• Tác nhân nhấn vào mục "Tra cứu tồn kho".
• Hệ thống thực hiện truy vấn cơ sở dữ liệu trên bảng VAT_TU.
• Hệ thống hiển thị danh sách dạng bảng chứa thông tin về mức tồn kho và giá cả của tất cả các vật tư.
• Tác nhân có thể nhập tên vật tư vào thanh tìm kiếm để lọc nhanh thông tin cần xem.

• Luồng phụ (Alternate Flows):
• Kho hàng chưa có dữ liệu: Nếu hệ thống chưa có bất kỳ vật tư nào được đăng ký, màn hình sẽ hiển
thị thông báo "Không có dữ liệu vật tư để hiển thị".

