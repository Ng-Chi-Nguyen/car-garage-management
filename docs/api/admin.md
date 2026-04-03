## Admin Users API

Nhóm API quản trị tài khoản nội bộ.

- Prefix: `/api/v1/admin/users`
- Auth/role: bắt buộc `requireAuth + requireRoles([Admin, NhanVien])` từ router chính.

## 1) Danh sách tài khoản

- **Mục đích:** lấy danh sách tài khoản có phân trang/lọc.
- **Method/Path:** `GET /api/v1/admin/users`
- **Query:**
  - `page`, `limit` (số nguyên dương)
  - `search`
  - `role`: `Admin | NhanVien | KhachHang`
  - `status`: `HoatDong | BiKhoa | DaXoa`
- **Validate chính:** reject unknown query key.
- **Response thành công:** `data = { users, pagination }`.
- **Lỗi thường gặp:** `400`, `401`, `403`.
- **Nghiệp vụ:** user trả ra đã sanitize mật khẩu và có thêm `roleLabel`.

## 2) Tạo tài khoản nội bộ

- **Mục đích:** tạo user mới cho quản trị/nhân viên.
- **Method/Path:** `POST /api/v1/admin/users`
- **Request body:**
  - bắt buộc: `TenChuXe`, `DienThoai`, `Email`, `MatKhau`, `XacNhanMatKhau`
  - tùy chọn: `DiaChi`, `ChucVu` (`Admin|NhanVien`), `TrangThai` (`HoatDong|BiKhoa`)
- **Validate chính:** body validator custom, không cho unknown.
- **Response thành công:** `201`, `data.user`.
- **Lỗi thường gặp:**
  - `400` xác nhận mật khẩu không khớp
  - `409` email/sđt đã tồn tại
  - `401/403` thiếu auth/role
- **Nghiệp vụ:** mặc định `ChucVu=NhanVien`, `TrangThai=HoatDong` nếu không truyền.

## 3) Cập nhật tài khoản

- **Mục đích:** cập nhật role/trạng thái user.
- **Method/Path:** `PUT /api/v1/admin/users/:id`
- **Request params:** `id` là số nguyên dương.
- **Request body:** `ChucVu`, `TrangThai` (theo enum cho phép).
- **Validate chính:** validate cả params + body.
- **Response thành công:** `data.user`.
- **Lỗi thường gặp:** `404` không tìm thấy tài khoản, `400` invalid input.
- **Nghiệp vụ:** chỉ field hợp lệ mới được ghi vào DB.

## 4) Reset mật khẩu tài khoản

- **Mục đích:** admin reset mật khẩu cho user theo id.
- **Method/Path:** `POST /api/v1/admin/users/:id/reset-password`
- **Request params:** `id` số nguyên dương.
- **Request body:** `MatKhauMoi`, `XacNhanMatKhauMoi`.
- **Validate chính:** validate params + body.
- **Response thành công:** `data.user`.
- **Lỗi thường gặp:**
  - `404` không tìm thấy tài khoản
  - `400` xác nhận mật khẩu không khớp
- **Nghiệp vụ:** reset đồng thời clear token reset password cũ.
