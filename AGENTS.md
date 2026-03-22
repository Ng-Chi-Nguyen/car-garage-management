## Mục tiêu repo
- Xây dựng hệ thống quản lý gara ô tô giúp tự động hóa quy trình tiếp nhận, sửa chữa, kho, tài chính và báo cáo.
- Ưu tiên tính đúng nghiệp vụ, dữ liệu nhất quán, và khả năng bảo trì khi mở rộng theo module.
- Mọi thay đổi phải phục vụ luồng vận hành thực tế của gara, không thêm phạm vi ngoài yêu cầu.

## Nguồn ưu tiên
- Khi có mâu thuẫn, CONTRIBUTING.md ưu tiên hơn README.md.
- CONTRIBUTING.md là nguồn chuẩn cho workflow Git, coding conventions, commit types và quy tắc cộng tác.
- README.md là nguồn chuẩn cho mục tiêu nghiệp vụ, stack chính và cấu trúc repo.

## Stack chính
- Frontend: React + Vite + React Router + React Query.
- Backend: Node.js + Express.
- Database: MySQL 8.0, truy cập dữ liệu qua Prisma theo chuẩn server hiện tại.
- Validation: Joi ở backend trước khi vào controller.
- Hạ tầng: Docker là tùy chọn cho môi trường chạy/triển khai.

## Cấu trúc repo
- `client/`: mã frontend, route, page, component, hook, loader.
- `server/`: mã backend trong `server/src` (app entry, `config/`, `db/`, `routes/`) và schema/migration trong `server/prisma`.
- `database/`: SQL khởi tạo dữ liệu.
- `design/`: đặc tả nghiệp vụ và tài liệu thiết kế.
- `docs/`: tài liệu dự án và tham chiếu.
- `reports/`: báo cáo tiến độ/đồ án.

## Coding rules bắt buộc
### Frontend
- Dùng `<form onSubmit={handleSubmit}>`; không thay bằng click handler rời.
- Ép kiểu số bằng `Number()` trước khi gửi dữ liệu số (ID, tiền, số lượng).
- Sau mutation thành công phải `invalidateQueries` đúng `queryKey` liên quan.
- Không dùng `alert()`; dùng toast success/error theo message backend.
- Ưu tiên loader/React Query thay vì `useEffect` fetch thủ công.
- Dùng URL làm nguồn sự thật cho state điều hướng (page, filter, tab, selectedId).

### Backend
- Ưu tiên chuẩn hóa API theo version prefix (`api/v1/...`) và áp dụng xác thực trước controller ở các route hỗ trợ; không giả định toàn bộ endpoint hiện đã đồng nhất.
- Validate input bằng Joi ở route/validator trước khi xử lý nghiệp vụ.
- Tên hàm controller và service phải thống nhất 1-1.
- Truy cập DB bằng Prisma theo chuẩn repository/service hiện có.
- Trả dữ liệu danh sách theo dạng phân trang nhất quán.

## Workflow AI bắt buộc
- plan first
- hygienic review plan
- user self-review/approve
- execute
- hygienic review implementation
- ask user before commit
- Chỉ hỏi user có muốn commit không sau khi implementation review = OKAY; không tự commit.

## Chính sách chọn công cụ
- Code search mặc định: ccc/CocoIndex trước.
- Sau đó mới dùng LSP khi cần definition/reference/rename.
- Dùng AST grep cho structural search/refactor.
- Chỉ dùng grep cho exact string/regex verification hoặc fallback.
- Tra cứu tài liệu thư viện bằng Context7/librarian trước.

## Definition of Done
- Luôn báo cáo ngắn gọn: phạm vi, file đổi, blocker chính.
- Luôn nêu verification đã chạy và kết quả tương ứng.
