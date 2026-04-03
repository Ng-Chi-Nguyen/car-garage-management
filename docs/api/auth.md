## Auth API

Nhóm endpoint xác thực gồm 2 luồng:

- Đăng ký tài khoản khách hàng mới.
- Đăng nhập / quên mật khẩu / đặt lại mật khẩu / đổi mật khẩu cho tài khoản dùng hệ thống.

> Lưu ý theo code hiện tại: luồng đăng nhập và các luồng mật khẩu đang áp dụng cho tài khoản role `Admin` hoặc `NhanVien`.

## 1) Đăng ký

- **Mục đích:** tạo tài khoản khách hàng (`ChucVu = KhachHang`, `TrangThai = HoatDong`).
- **Method/Path:** `POST /api/v1/auth/register`
- **Xác thực/phân quyền:** Không yêu cầu.
- **Request body:**
  - `Email` (email, bắt buộc)
  - `MatKhau` (string, 8-255, bắt buộc)
  - `XacNhanMatKhau` (phải khớp `MatKhau`)
  - `TenChuXe` (string, bắt buộc)
  - `DienThoai` (string, bắt buộc)
  - `DiaChi` (string, cho phép rỗng)
- **Validate chính:** không cho field ngoài schema; kiểm tra confirm password.
- **Response thành công:** `201`, `data.customer` (đã loại password/token reset).
- **Lỗi thường gặp:**
  - `409` Email đã tồn tại
  - `409` Số điện thoại đã tồn tại
  - `400` Validation lỗi
- **Nghiệp vụ:** có gửi welcome email (fail mail không rollback tạo user).

## 2) Đăng nhập

- **Mục đích:** xác thực và phát hành `accessToken`.
- **Method/Path:** `POST /api/v1/auth/login`
- **Xác thực/phân quyền:** Không yêu cầu.
- **Request body:**
  - `Email` (email)
  - `MatKhau` (string)
- **Validate chính:** schema body chặt, không cho unknown.
- **Response thành công:** `200`, `data = { accessToken, user }`.
- **Lỗi thường gặp:**
  - `400` Email hoặc mật khẩu không đúng
  - `403` tài khoản bị khóa/xóa
  - `403` tài khoản không thuộc role được phép (`Admin`, `NhanVien`)
- **Nghiệp vụ:** hiện flow login chỉ cho phép `Admin/NhanVien`.

## 3) Quên mật khẩu

- **Mục đích:** gửi email chứa link reset password.
- **Method/Path:** `POST /api/v1/auth/forgot-password`
- **Xác thực/phân quyền:** Không yêu cầu.
- **Request body:** `Email`.
- **Validate chính:** email hợp lệ.
- **Response thành công:** `200`, message chung (không lộ email có tồn tại hay không).
- **Lỗi thường gặp:**
  - `400` Validation lỗi
  - `500` lỗi gửi mail/hệ thống
- **Nghiệp vụ:** token reset sống 15 phút; chỉ áp dụng cho tài khoản đang hoạt động và role `Admin/NhanVien`.

## 4) Đặt lại mật khẩu

- **Mục đích:** đổi mật khẩu bằng token reset.
- **Method/Path:** `POST /api/v1/auth/reset-password`
- **Xác thực/phân quyền:** Không yêu cầu.
- **Request body:**
  - `Token`
  - `MatKhauMoi` (8-255)
  - `XacNhanMatKhauMoi` (khớp `MatKhauMoi`)
- **Validate chính:** token bắt buộc; password mới và confirm hợp lệ.
- **Response thành công:** `200`, message đặt lại thành công.
- **Lỗi thường gặp:**
  - `400` token không hợp lệ/hết hạn
  - `400` mật khẩu mới trùng mật khẩu hiện tại
  - `403` tài khoản không hợp lệ để reset
- **Nghiệp vụ:** token chỉ dùng một lần; sau khi reset sẽ clear token reset trong DB.

## 5) Đổi mật khẩu khi đã đăng nhập

- **Mục đích:** người dùng đã login đổi mật khẩu hiện tại.
- **Method/Path:** `POST /api/v1/auth/change-password`
- **Xác thực/phân quyền:** yêu cầu Bearer token hợp lệ.
- **Request body:**
  - `MatKhauHienTai`
  - `MatKhauMoi`
  - `XacNhanMatKhauMoi`
- **Validate chính:** body schema chặt, confirm password phải khớp.
- **Response thành công:** `200`, message đổi mật khẩu thành công.
- **Lỗi thường gặp:**
  - `401` chưa đăng nhập/token sai
  - `400` mật khẩu hiện tại không đúng
  - `400` mật khẩu mới trùng mật khẩu hiện tại
  - `403` không có quyền đổi mật khẩu theo chính sách role hiện tại
- **Nghiệp vụ:** hiện chỉ cho role `Admin/NhanVien` theo logic service.
