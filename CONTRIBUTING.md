# Quy định Đóng góp Mã nguồn (CONTRIBUTING)

Chào mừng bạn đến với đội ngũ phát triển dự án **DoAn-QuanLyGarageOto**. Để duy trì chất lượng mã nguồn và tính nhất quán của hệ thống, mọi thành viên **PHẢI** tuân thủ nghiêm ngặt các quy định dưới đây. Đây là "Nguồn sự thật duy nhất" (Single Source of Truth) cho mọi hoạt động phát triển.

---

## 1. Nguyên tắc cốt lõi (Core Principles)

-   **Kiến trúc Chuẩn**: Mọi thay đổi phải tuân thủ kiến trúc `garage-arch`. Tách biệt hoàn toàn trách nhiệm giữa các tầng.
-   **Mã nguồn Sạch (Clean Code)**: Code phải dễ đọc, dễ bảo trì. Ưu tiên sự rõ ràng hơn là sự ngắn gọn.
-   **Không khoan nhượng với lỗi**: CẤM commit mã nguồn có lỗi cú pháp hoặc làm hỏng các chức năng hiện tại. Hệ thống CI/CD sẽ tự động chặn các thay đổi không đạt chuẩn.
-   **Bảo mật là tiên quyết**: Tuân thủ giao thức `sec-ops`. Không hardcode bí mật, luôn sanitize dữ liệu đầu vào.

---

## 2. Quy trình Git (Git Workflow - theo `git-commander`)

Chúng tôi sử dụng mô hình nhánh tính năng để quản lý mã nguồn.

-   **Nhánh chính (`main`)**: Là nhánh bảo vệ (Protected). **CẤM TUYỆT ĐỐI** việc push trực tiếp vào `main`.
-   **Quy trình làm việc**:
    1.  Tách nhánh từ `main` với tiền tố tương ứng:
        -   `feat/`: Tính năng mới (ví dụ: `feat/inventory-management`).
        -   `fix/`: Sửa lỗi (ví dụ: `fix/calculation-bug`).
        -   `docs/`: Cập nhật tài liệu.
        -   `refactor/`: Tái cấu trúc mã nguồn nhưng không thay đổi logic.
    2.  Làm việc trên nhánh riêng.
    3.  Đồng bộ hóa thường xuyên với `main` bằng `rebase`.
    4.  Tạo Pull Request (PR) để yêu cầu gộp mã nguồn.

-   **Quy tắc Commit Message (Conventional Commits)**:
    Mọi commit phải tuân theo cấu trúc: `type(scope): subject`.
    -   `feat`: Tính năng mới.
    -   `fix`: Sửa lỗi.
    -   `chore`: Thay đổi nhỏ về build, thư viện.
    -   `refactor`: Tái cấu trúc mã nguồn.
    -   *Ví dụ: `feat(api): add vehicle reception endpoint`*

---

## 3. Tiêu chuẩn Backend (Node.js - theo `garage-arch` & `js-ts-godmode`)

Yêu cầu thực thi nghiêm ngặt cấu trúc 4 tầng:

1.  **Routes**: Định nghĩa endpoint và điều hướng request.
2.  **Controllers**: Tiếp nhận request, validate dữ liệu đầu vào và định dạng response.
3.  **Services**: Chứa **TOÀN BỘ** logic nghiệp vụ, tính toán và xử lý giao dịch.
4.  **Repositories/Models**: Thực hiện các truy vấn trực tiếp vào cơ sở dữ liệu.

**Quy tắc lập trình:**
-   Sử dụng **Modern Syntax (ES6+)**: Dùng `const` và `let`, **CẤM** dùng `var`.
-   **Bất đồng bộ**: Sử dụng `async/await`. Mọi hàm bất đồng bộ phải có khối `try/catch` để xử lý lỗi.
-   **Hàm**: Ưu tiên Arrow Functions cho các callback và phương thức ngắn.
-   **Cấu hình**: Sử dụng biến môi trường (`.env`) cho các thông số cấu hình.

---

## 4. Tiêu chuẩn Frontend (React - theo `ui-architect`)

-   **Thành phần**: Chỉ sử dụng **Functional Components** và **Hooks**. Cấm sử dụng Class Components.
-   **Tách biệt logic**: Extract logic phức tạp ra các **Custom Hooks**. Giữ cho file JSX sạch sẽ, chỉ tập trung vào hiển thị.
-   **Styling**: Sử dụng **TailwindCSS** chuẩn. Đảm bảo giao diện nhất quán về khoảng cách, màu sắc và kiểu chữ.
-   **Phản hồi (UX)**: Luôn cung cấp phản hồi trực quan (Loading spinners, Toasts) cho mọi hành động của người dùng.
-   **Tối ưu**: Sử dụng `useMemo` và `useCallback` để tránh re-render không cần thiết khi xử lý dữ liệu lớn.

---

## 5. Tiêu chuẩn Cơ sở dữ liệu (MySQL - theo `mysql-supreme`)

-   **Đặt tên bảng**: Sử dụng tiếng Anh, số nhiều (ví dụ: `cars`, `services`, `invoices`, `parts`).
-   **Đặt tên cột**: Sử dụng `snake_case` (ví dụ: `car_id`, `owner_name`).
-   **Tối ưu hóa truy vấn**:
    -   **CẤM** sử dụng `SELECT *`. Chỉ chọn các cột cần thiết cho nghiệp vụ.
    -   Sử dụng **Transactions** cho các thao tác cập nhật nhiều bảng liên quan để đảm bảo tính toàn vẹn dữ liệu.
    -   Đánh **Index** cho các Foreign Keys và các cột thường xuyên nằm trong điều kiện `WHERE` hoặc `JOIN`.
-   **Chuẩn hóa**: Thiết kế database đạt chuẩn 3NF.

---

## 6. Quy trình Review (Code Review)

Mọi dòng code được gộp vào dự án đều phải được kiểm duyệt:

-   **Pull Request (PR)**:
    -   Tiêu đề PR phải rõ ràng, tóm tắt được thay đổi.
    -   Mô tả PR phải bao gồm: *Nội dung đã làm*, *Cách kiểm thử*, và *Ảnh chụp màn hình* (nếu có thay đổi UI).
-   **Điều kiện Merge**:
    -   Phải vượt qua tất cả các bài kiểm tra tự động (Linting, Tests).
    -   Phải có ít nhất **01 sự chấp thuận (Approve)** từ thành viên khác hoặc Senior Developer.
    -   Tác giả PR phải phản hồi và giải quyết tất cả các comment từ người review.

---

*Việc tuân thủ các quy định trên là bắt buộc. Mọi vi phạm sẽ dẫn đến việc từ chối Pull Request mà không cần báo trước.*
