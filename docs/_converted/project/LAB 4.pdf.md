# Source
docs/project/LAB 4.pdf

# Conversion method
pdftotext

Lab 04: THỰC HÀNH VỀ XÂY DỰNG BIỂU ĐỒ USE CASE VỚI
ĐỀ TÀI
QUẢN LÝ THƯ VIỆN
1. Mục tiêu
- Trình bày được các thành phần trong biểu đồ Use Case
- Xác định được các Actor trong hệ thống
- Xác định được các Use Case trong hệ thống
- Xác định được các mối quan hệ giữa các Use Case.
- Sử dụng được phần mềm để biểu diễn biểu đồ Use Case
2. Nội dung
- Dựa vào bản mô tả hệ thống, hãy xác định các Actor và Use Case của hệ thống
- Xây dựng biểu đồ Use case mức tổng quát cho hệ thống.
- Xây dựng các biểu Use case phân rã cho các Use case tổng quát nếu có
- Xây dựng kịch bản cho Use case
- Vẽ biểu đồ phân rã cho các Use case tổng quát còn lại (nếu có).
- Xây dựng kịch bản cho các Use case đó

Gợi ý ngắn gọn bỏ qua bước thu thập yêu cầu (theo ngôn ngữ tự nhiên):
1. Bản mô tả hệ thống (Yêu cầu đầu vào)
Hệ thống Quản lý Thư viện cần phục vụ các đối tượng: Thủ thư, Độc giả và Người
quản trị.
➢

Độc giả: Có thể tìm kiếm sách, đăng ký mượn sách trực tuyến và xem lịch sử
mượn của mình.

➢

Thủ thư: Thực hiện cho mượn sách, nhận sách trả, cập nhật tình trạng sách và xử
lý vi phạm (mất sách, trễ hạn).

➢

Người quản trị: Quản lý danh mục sách, quản lý thông tin độc giả và thống kê
báo cáo hàng tháng.

➢

Yêu cầu chung: Mọi người dùng phải Đăng nhập trước khi thực hiện các chức
năng cốt lõi. Chức năng Cho mượn sách phải bao gồm việc Kiểm tra thẻ độc
giả.

2. Hướng dẫn thực hiện chi tiết
Bước 1: Xác định các thành phần của hệ thống
Dựa trên mô tả, chúng ta xác định:
➢

Actors (Tác nhân): Độc giả (Reader), Thủ thư (Librarian), Người quản trị
(Admin).

➢

Use Cases (Chức năng): Đăng nhập, Tìm kiếm sách, Mượn sách, Trả sách, Quản
lý sách, Quản lý độc giả, Thống kê.

Bước 2: Xây dựng biểu đồ Use Case tổng quát
Ở mức này, chúng ta tập trung vào việc ai làm việc gì.
Bước 3: Xác định các mối quan hệ (Relationship)
➢

Include (Bao hàm): Use case "Mượn sách" và "Quản lý sách" đều cần "Đăng
nhập".

➢

Extend (Mở rộng): Trong lúc "Trả sách", nếu quá hạn sẽ có thêm "Xử lý vi
phạm".

➢

Generalization (Tổng quát hóa): Admin và Thủ thư đều là "Nhân viên".

3. Phân rã Use Case và Xây dựng kịch bản
A. Biểu đồ phân rã Use Case "Mượn sách"
Trong chức năng Mượn sách, thủ thư cần thực hiện các bước nhỏ hơn như:
Kiểm tra thông tin thẻ, Kiểm tra tình trạng sách, Ghi nhận phiếu mượn.
B. Xây dựng kịch bản (Use Case Specification)
Bạn cần lập bảng mô tả cho các Use Case quan trọng. Dưới đây là ví dụ
cho Use Case "Mượn sách":
Thành phần

Nội dung mô tả

Tên Use Case

Mượn sách

Actor chính

Thủ thư

Tiền điều kiện

Thủ thư đã đăng nhập vào hệ thống

Luồng sự kiện
chính

1. Thủ thư nhập mã thẻ độc giả.
2. Hệ thống hiển thị thông tin độc giả.
3. Thủ thư nhập mã sách.
4. Hệ thống kiểm tra sách có sẵn không.
5. Hệ thống tạo phiếu mượn và cập nhật số lượng sách.

Ngoại lệ

- Thẻ độc giả hết hạn: Hệ thống báo lỗi và dừng.
- Độc giả đang mượn quá số sách quy định: Hệ thống từ chối cho
mượn.

4. Công cụ thực hiện gợi ý
Để vẽ biểu đồ, bạn có thể sử dụng các phần mềm chuyên dụng sau:
➢ StarUML: Chuyên nghiệp, đúng chuẩn UML.
➢ Draw.io (Lucidchart) hoặc StarUML.io: Miễn phí, dễ sử dụng trên trình duyệt.
➢ Visual Paradigm: Mạnh mẽ cho các dự án lớn.
5. Danh mục sản phẩm nộp bài Lab
Để đạt điểm cao cho bài Lab này, bạn cần đóng gói sản phẩm gồm:
➢ File báo cáo (Word/PDF): Chứa bản mô tả, danh sách Actor/Use Case.
➢ Hình ảnh biểu đồ: Biểu đồ tổng quát và các biểu đồ phân rã.
➢ Bảng kịch bản: Ít nhất 2 hoặc 3 kịch bản cho 3 Use Case quan trọng nhất.

