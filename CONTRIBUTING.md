# Quy định Đóng góp (CONTRIBUTING)

Chào mừng các bạn đến với dự án **Quản Lý Gara Ô Tô**. Tài liệu này hướng dẫn cách làm việc chung cho cả nhóm để code thống nhất, ít lỗi và dễ đọc.

---

## 1. Quy trình làm việc (Workflow)

Chúng ta sẽ làm việc trên **Github** theo quy trình đơn giản sau:

1.  **Nhánh `main`**: Chứa code ổn định nhất. **KHÔNG** được code trực tiếp hay push thẳng lên nhánh này.
2.  **Tạo nhánh mới**: Khi bắt đầu làm một chức năng mới hoặc sửa lỗi, hãy tạo nhánh từ `main`.
    *   Đặt tên nhánh: `loại/ten-ngan-gon-khong-dau`
    *   Ví dụ:
        *   Làm chức năng đăng nhập: `feat/dang-nhap`
        *   Sửa lỗi tính tiền: `fix/loi-tinh-tien`
        *   Cập nhật tài liệu: `docs/cap-nhat-readme`

**Các bước cụ thể:**
1.  `git checkout main` (Về nhánh chính)
2.  `git pull origin main` (Cập nhật code mới nhất từ server)
3.  `git checkout -b feat/ten-chuc-nang` (Tạo và chuyển sang nhánh mới)
4.  Code và Commit...
5.  `git push origin feat/ten-chuc-nang` (Đẩy nhánh lên Github)
6.  Lên Github tạo **Pull Request (PR)** vào nhánh `main`.
7.  Nhờ một bạn khác trong nhóm review (xem qua) và Approve.
8.  Merge vào `main`.

---

## 2. Quy tắc Commit (Commit Message)

*   **Ngôn ngữ**: Khuyến khích dùng **Tiếng Việt** cho dễ hiểu (hoặc Tiếng Anh nếu muốn).
*   **Cấu trúc**: `Loại: Mô tả ngắn gọn nội dung`

**Các loại commit (Type):**
*   `feat`: Thêm tính năng mới (Feature).
*   `fix`: Sửa lỗi (Bug fix).
*   `ui`: Chỉnh sửa giao diện (CSS, HTML...).
*   `docs`: Viết/sửa tài liệu.
*   `refactor`: Sửa lại code cho gọn/đẹp hơn (không đổi tính năng).
*   `chore`: Các việc linh tinh (cài thêm thư viện, setup...).

**Ví dụ:**
*   `feat: thêm chức năng tiếp nhận xe`
*   `fix: sửa lỗi không lưu được tiền công`
*   `ui: chỉnh màu nút bấm cho đẹp hơn`
*   `docs: cập nhật hướng dẫn cài đặt`

---

## 3. Quy định về Code (Coding Conventions)

### Chung
*   **Comment (Ghi chú)**: Nên viết comment bằng **Tiếng Việt** giải thích các đoạn logic phức tạp.
*   **Đặt tên**:
    *   Biến và Hàm: `camelCase` (ví dụ: `tongTien`, `tinhDoanhThu`).
    *   Tên file: `camelCase.js` hoặc `PascalCase.jsx` (đối với Component React).

### Backend (Node.js/Express)
*   **Cấu trúc**: Chia code rõ ràng làm 4 phần:
    *   `routes`: Định nghĩa đường dẫn (URL).
    *   `controllers`: Nhận dữ liệu từ user, kiểm tra dữ liệu.
    *   `services`: Xử lý logic chính (tính toán, nghiệp vụ).
    *   `models`: Gọi xuống Database.
*   Dùng `async/await` và luôn có `try/catch` để bắt lỗi.

### Frontend (ReactJS)
*   Dùng **Functional Component** và **Hooks** (useState, useEffect...), không dùng Class.
*   Tên Component viết hoa chữ cái đầu (ví dụ: `DanhSachXe.jsx`).
*   Giao diện dùng **TailwindCSS**.

### Database (MySQL)
*   **Tên bảng**: Tiếng Anh, số nhiều (ví dụ: `users`, `cars`, `invoices`).
*   **Tên cột**: Tiếng Anh, `snake_case` (ví dụ: `full_name`, `phone_number`).
*   **Truy vấn**: Hạn chế dùng `SELECT *`, nên liệt kê các cột cần lấy.

---

## 4. Báo cáo lỗi (Reporting Bugs)

Nếu phát hiện lỗi, hãy nhắn tin lên nhóm hoặc tạo Issue trên Github với mô tả rõ ràng:
1.  Lỗi là gì?
2.  Làm sao để tái hiện lỗi đó? (Các bước thực hiện).
3.  Mong muốn kết quả đúng là gì?

---
*Chúc cả nhóm làm việc hiệu quả!*
