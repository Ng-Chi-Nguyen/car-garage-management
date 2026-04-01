# Auth Model

## Mô hình sản phẩm

Hệ thống dùng mô hình **đăng nhập nội bộ cho nhân sự gara**. Tài khoản hợp lệ để vào ứng dụng là **Admin** và **Nhân viên**; tài khoản **Khách hàng** không được dùng để truy cập hệ thống nội bộ.

## Luồng chính

- Đăng nhập bằng email/tên đăng nhập và mật khẩu.
- Sau khi xác thực, hệ thống cấp token và cho vào dashboard.
- Đổi mật khẩu được hỗ trợ trong khu vực tài khoản.
- Quên mật khẩu và đặt lại mật khẩu là các luồng có trong scope sản phẩm.

## Ngoài phạm vi hiện tại

- Đăng ký công khai cho khách hàng.
- Tài khoản customer đăng nhập vào khu vực quản trị/vận hành nội bộ.

## Quy ước demo

- Login staff/admin: `200`.
- Login customer: `403` với thông báo chặn truy cập nội bộ.
