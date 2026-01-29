# Hướng dẫn đóng góp (Contributing Guide)

Chào mừng bạn đến với dự án! Để đảm bảo quy trình làm việc hiệu quả và thống nhất giữa 3 thành viên trong nhóm, vui lòng tuân thủ các quy định dưới đây.

## 1. Quy trình Git (Git Workflow)

Chúng ta sử dụng mô hình **Feature Branch Workflow**.

*   Nhánh chính: `main` (luôn chứa mã nguồn ổn định).
*   Mọi thay đổi phải được thực hiện trên một nhánh riêng biệt được tách ra từ `main`.
*   Sau khi hoàn thành, tạo Pull Request để gộp vào `main`.

Sơ đồ: `main` -> `feat/your-feature` -> `Pull Request` -> `main`.

## 2. Quy tắc đặt tên nhánh (Branch Naming)

Tên nhánh nên ngắn gọn, súc tích và phản ánh đúng nội dung thay đổi:

*   **Tính năng mới**: `feat/ten-chuc-nang` (ví dụ: `feat/dang-nhap`)
*   **Sửa lỗi**: `fix/ten-loi` (ví dụ: `fix/loi-hien-thi-anh`)
*   **Tài liệu**: `docs/ten-tai-lieu`
*   **Tối ưu mã nguồn**: `refactor/ten-phan-viec`

## 3. Quy tắc Commit (Commit Rules)

Chúng ta tuân theo tiêu chuẩn **Conventional Commits**. Mỗi tin nhắn commit cần có tiền tố rõ ràng:

*   `feat:`: Thêm một tính năng mới.
*   `fix:`: Sửa một lỗi.
*   `docs:`: Thay đổi về tài liệu (README, CONTRIBUTING, ...).
*   `refactor:`: Thay đổi mã nguồn nhưng không sửa lỗi cũng không thêm tính năng.
*   `style:`: Thay đổi về định dạng code (khoảng trắng, dấu phẩy, ...) không ảnh hưởng đến logic.
*   `test:`: Thêm hoặc sửa các bản kiểm thử (test cases).

**Cấu trúc:** `<type>: <mô tả ngắn bằng tiếng Việt>`
*Ví dụ: `feat: thêm chức năng lọc sản phẩm theo giá`*

## 4. Quy trình Pull Request (PR Process)

Để mã nguồn được gộp vào nhánh chính, hãy thực hiện các bước sau:

1.  **Tạo PR**: Đẩy nhánh của bạn lên remote và tạo Pull Request hướng về nhánh `main`.
2.  **Yêu cầu Review**: Chỉ định ít nhất 1 thành viên khác trong nhóm kiểm tra mã nguồn (Request Review).
3.  **Xử lý phản hồi**: Nếu có góp ý, hãy cập nhật mã nguồn ngay trên nhánh đó.
4.  **Merge**: Sau khi được chấp thuận (Approved) và vượt qua các bài kiểm thử (nếu có), người tạo PR hoặc người review sẽ tiến hành gộp nhánh.

## 5. Tiêu chuẩn lập trình (Coding Standards)

*   **Đặt tên biến/hàm**: Sử dụng `camelCase` (ví dụ: `userName`, `calculateTotal`).
*   **Đặt tên lớp (Class)**: Sử dụng `PascalCase` (ví dụ: `UserServiceProvider`).
*   **Hằng số**: Sử dụng `UPPER_SNAKE_CASE` (ví dụ: `MAX_RETRY_COUNT`).
*   **Ghi chú (Commenting)**: 
    *   Ghi chú rõ ràng cho các hàm phức tạp.
    *   Sử dụng tiếng Việt hoặc tiếng Anh thống nhất trong toàn dự án.
    *   Xóa mã nguồn thừa hoặc các dòng `console.log` không cần thiết trước khi commit.

---
*Chúc nhóm chúng ta làm việc hiệu quả!*
