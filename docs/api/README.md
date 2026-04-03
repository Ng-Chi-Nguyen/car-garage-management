## Tài liệu API (Server)

Tài liệu này được dựng từ code backend hiện tại (router + validation + xử lý nghiệp vụ).

## Base URL

- Tất cả API chính dùng prefix: **`/api/v1`**

## Quy ước xác thực/phân quyền chung

- Chuẩn token: `Authorization: Bearer <accessToken>`.
- Xác thực: yêu cầu `Bearer accessToken`.
- Phân quyền nội bộ phổ biến: `Admin` hoặc `NhanVien`.
- Lỗi auth thường gặp:
  - `401`: `success: false`, message: chưa đăng nhập/token không hợp lệ.
  - `403`: `success: false`, message: không có quyền.
- Một số route có thể chạy bypass auth ở môi trường dev theo `AUTH_BYPASS` (không áp dụng production/test).

## Quy ước request/response chung

- Validation lỗi trả `400` với cấu trúc:
  - `success: false`
  - `message: "Dữ liệu đầu vào không hợp lệ (Validation Failed)."`
  - `errors: string[]`
- CRUD list thường trả:
  - `data.<listKey>` hoặc `data.items`
  - `data.pagination = { page, limit, totalItems, totalPages }`
- Export file `.xlsx` trả binary, header:
  - `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
  - `Content-Disposition: attachment; filename="...xlsx"`

## Upload/multipart

- Ảnh khách hàng: field `avatar`, tối đa 5MB, mime `jpeg/png/webp`.
- Ảnh hiệu xe: field `logo`, tối đa 5MB, mime `jpeg/png/webp`.
- Master data `.xlsx`: field `file`, tối đa 10MB.

## Rate limit

- Dashboard và một số route báo cáo dùng `express-rate-limit`.
- Cửa sổ mặc định: `60s`, giới hạn mặc định `60 request/phút` (có thể đổi qua `DASHBOARD_RATE_LIMIT_MAX`).
- Khi vượt ngưỡng thường trả `429` với `success: false` + message tiếng Việt tương ứng từng nhóm report.

## Danh sách tài liệu theo nhóm API

- [auth.md](./auth.md)
- [activity.md](./activity.md)
- [admin.md](./admin.md)
- [dashboard.md](./dashboard.md)
- [workflows.md](./workflows.md)
- [management.md](./management.md)
- [reports.md](./reports.md)
- [settings.md](./settings.md)

## Ghi chú quan trọng theo code hiện tại

- Có route file workflow phiếu thu tiền (`src/routes/workflows/paymentReceiptWorkflow.route.js`) nhưng **chưa được mount vào router chính**, nên chưa phải API public hiện tại.
- `GET /api/v1/reports/export` và nhóm `customer-report` hiện **chưa yêu cầu auth ở router chính**.
