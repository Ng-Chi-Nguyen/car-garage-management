## Settings API

Nhóm API cấu hình hệ thống và dữ liệu tham chiếu cho màn hình cấu hình.

- Prefix: `/api/v1/settings`
- Auth/role: bắt buộc `requireAuth + requireRoles([Admin, NhanVien])` từ router chính.

## 1) Lấy tham số hệ thống

- **Mục đích:** đọc cấu hình vận hành chung.
- **Method/Path:** `GET /api/v1/settings/parameters`
- **Request:** không query/body.
- **Response thành công:**
  - `data.parameters = { maxCarsPerDay, materialProfitMargin }`
- **Lỗi thường gặp:** `401/403`, `500`.
- **Nghiệp vụ:** nếu DB chưa có bản ghi cấu hình, service trả mặc định:
  - `maxCarsPerDay = 20`
  - `materialProfitMargin = 15`

## 2) Cập nhật tham số hệ thống

- **Mục đích:** cập nhật cấu hình vận hành.
- **Method/Path:** `PUT /api/v1/settings/parameters`
- **Request body:**
  - `maxCarsPerDay`: số nguyên không âm
  - `materialProfitMargin`: số >= 0
- **Validate chính:** chỉ cho 2 key trên, không cho unknown.
- **Response thành công:** `data.parameters` mới.
- **Lỗi thường gặp:**
  - `400` sai kiểu/unknown key
  - `401/403` auth/role
- **Nghiệp vụ:** dùng `upsert` theo `MaCauHinh = 1`.

## 3) Lấy bảng giá dịch vụ

- **Mục đích:** trả danh sách tiền công dạng DTO cho UI settings.
- **Method/Path:** `GET /api/v1/settings/service-prices`
- **Request:** không query/body.
- **Response thành công:**
  - `data.servicePrices[] = { id, name, duration, price }`
- **Lỗi thường gặp:** `401/403`, `500`.
- **Nghiệp vụ:** đọc từ bảng `tIEN_CONG`, sắp xếp tăng dần theo mã.

## 4) Lấy danh sách hiệu xe cho settings

- **Mục đích:** trả dữ liệu hiệu xe kèm số model xe.
- **Method/Path:** `GET /api/v1/settings/car-brands`
- **Request:** không query/body.
- **Response thành công:**
  - `data.carBrands[] = { id, name, modelCount, description }`
- **Lỗi thường gặp:** `401/403`, `500`.
- **Nghiệp vụ:** lấy count số xe theo từng hiệu xe (`_count.Xe`).
