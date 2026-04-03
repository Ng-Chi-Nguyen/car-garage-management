## Management API

Nhóm API management bao gồm các endpoint CRUD/multipart/XLSX đang **public** dưới `/api/v1/...`.

## Quy ước chung

- **Auth/role mặc định:** bắt buộc `Authorization: Bearer <accessToken>`, role `Admin` hoặc `NhanVien`.
- **Validate mặc định:** dùng Joi ở layer route; schema `params/query/body` đều chặn field ngoài (`unknown(false)`) theo từng endpoint.
- **Response CRUD chuẩn:**
  - Create: `201`
  - List/Detail/Update/Delete: `200`
  - List trả `data` + `pagination`
- **Lỗi thường gặp chung:** `400` (validation), `401/403` (auth/role), `404` (không tìm thấy), `409` (xung đột dữ liệu/transaction), `500` (hệ thống).

---

## 1) Customers (`/api/v1/customers`)

### 1.1 `POST /api/v1/customers`
- **Mục đích:** tạo khách hàng/chủ xe mới.
- **Method/Path:** `POST /api/v1/customers`
- **Auth/role:** bắt buộc `Bearer token`, role `Admin|NhanVien`.
- **Request:** `multipart/form-data`; body gồm `Email, TenChuXe, DienThoai, DiaChi, ChucVu, TrangThai`; file tùy chọn `avatar` (jpeg/png/webp, tối đa 5MB).
- **Validate chính:** `TenChuXe`, `DienThoai` bắt buộc; chuỗi giới hạn độ dài; enum `ChucVu`, `TrangThai` đúng whitelist.
- **Response thành công:** `201`, `data` là bản ghi khách hàng vừa tạo.
- **Lỗi thường gặp:** `400` dữ liệu sai định dạng, `409` trùng dữ liệu, `401/403`, `500`.
- **Giải thích nghiệp vụ:** là điểm vào master data khách hàng để liên kết xe và chứng từ.

### 1.2 `GET /api/v1/customers`
- **Mục đích:** lấy danh sách khách hàng có phân trang/lọc.
- **Method/Path:** `GET /api/v1/customers`
- **Auth/role:** bắt buộc.
- **Request:** query `page, limit, search` + filter `MaKH, Email, TenChuXe, DienThoai, DiaChi, ChucVu, TrangThai, NgayTaoFrom, NgayTaoTo, NgayCapNhatFrom, NgayCapNhatTo`.
- **Validate chính:** query schema chặt, kiểm tra kiểu số/date/enum.
- **Response thành công:** `200`, `data.items` (hoặc key tương đương) + `data.pagination`.
- **Lỗi thường gặp:** `400`, `401/403`, `500`.
- **Giải thích nghiệp vụ:** phục vụ màn hình danh sách và bộ lọc tìm kiếm khách hàng.

### 1.3 `GET /api/v1/customers/:id`
- **Mục đích:** lấy chi tiết 1 khách hàng.
- **Method/Path:** `GET /api/v1/customers/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id` (số nguyên dương).
- **Validate chính:** `id` bắt buộc, integer, `> 0`.
- **Response thành công:** `200`, `data` bản ghi khách hàng.
- **Lỗi thường gặp:** `400` id sai, `404` không tồn tại, `401/403`.
- **Giải thích nghiệp vụ:** dùng khi mở trang chi tiết/chỉnh sửa khách hàng.

### 1.4 `PUT /api/v1/customers/:id`
- **Mục đích:** cập nhật thông tin khách hàng.
- **Method/Path:** `PUT /api/v1/customers/:id`
- **Auth/role:** bắt buộc.
- **Request:** `multipart/form-data`; params `id`; body cho phép cập nhật một phần `Email, TenChuXe, DienThoai, DiaChi, ChucVu, TrangThai`; file `avatar` tùy chọn.
- **Validate chính:** body `.min(1)`; đúng kiểu dữ liệu; cho phép trường hợp chỉ upload file (`allowFileOnly`).
- **Response thành công:** `200`, `data` bản ghi sau cập nhật.
- **Lỗi thường gặp:** `400`, `404`, `409`, `401/403`.
- **Giải thích nghiệp vụ:** cho phép bảo trì hồ sơ khách hàng khi thông tin thay đổi.

### 1.5 `DELETE /api/v1/customers/:id`
- **Mục đích:** xóa khách hàng theo id.
- **Method/Path:** `DELETE /api/v1/customers/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id` (số nguyên dương).
- **Validate chính:** validate params id trước khi xóa.
- **Response thành công:** `200`, trả kết quả xóa.
- **Lỗi thường gặp:** `400`, `404`, `409` (ràng buộc dữ liệu liên quan), `401/403`.
- **Giải thích nghiệp vụ:** dùng cho dọn master data theo chính sách dữ liệu của gara.

---

## 2) Car Brands (`/api/v1/car-brands`)

### 2.1 `POST /api/v1/car-brands`
- **Mục đích:** tạo hiệu xe mới.
- **Method/Path:** `POST /api/v1/car-brands`
- **Auth/role:** bắt buộc.
- **Request:** `multipart/form-data`; body `TenHieuXe`; file tùy chọn `logo` (jpeg/png/webp, tối đa 5MB).
- **Validate chính:** `TenHieuXe` bắt buộc, độ dài tối đa 100.
- **Response thành công:** `201`, `data` hiệu xe mới.
- **Lỗi thường gặp:** `400`, `409` trùng tên, `401/403`, `500`.
- **Giải thích nghiệp vụ:** chuẩn hóa danh mục hiệu xe để liên kết xe.

### 2.2 `GET /api/v1/car-brands`
- **Mục đích:** lấy danh sách hiệu xe.
- **Method/Path:** `GET /api/v1/car-brands`
- **Auth/role:** bắt buộc.
- **Request:** query `page, limit, search, MaHieuXe, TenHieuXe`.
- **Validate chính:** query đúng kiểu; không cho field lạ.
- **Response thành công:** `200`, danh sách + phân trang.
- **Lỗi thường gặp:** `400`, `401/403`, `500`.
- **Giải thích nghiệp vụ:** phục vụ dropdown chọn hiệu xe và tra cứu master data.

### 2.3 `GET /api/v1/car-brands/:id`
- **Mục đích:** lấy chi tiết hiệu xe.
- **Method/Path:** `GET /api/v1/car-brands/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** `id` integer dương.
- **Response thành công:** `200`, `data` hiệu xe.
- **Lỗi thường gặp:** `400`, `404`, `401/403`.
- **Giải thích nghiệp vụ:** dùng khi cần xem/sửa một hiệu xe cụ thể.

### 2.4 `PUT /api/v1/car-brands/:id`
- **Mục đích:** cập nhật hiệu xe.
- **Method/Path:** `PUT /api/v1/car-brands/:id`
- **Auth/role:** bắt buộc.
- **Request:** `multipart/form-data`; params `id`; body cập nhật `TenHieuXe`; file `logo` tùy chọn.
- **Validate chính:** params `id` hợp lệ; body `.min(1)`; hỗ trợ chỉ cập nhật file (`allowFileOnly`).
- **Response thành công:** `200`, bản ghi sau cập nhật.
- **Lỗi thường gặp:** `400`, `404`, `409`, `401/403`.
- **Giải thích nghiệp vụ:** duy trì dữ liệu danh mục hiệu xe nhất quán.

### 2.5 `DELETE /api/v1/car-brands/:id`
- **Mục đích:** xóa hiệu xe theo id.
- **Method/Path:** `DELETE /api/v1/car-brands/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id số nguyên dương.
- **Response thành công:** `200`, kết quả xóa.
- **Lỗi thường gặp:** `400`, `404`, `409`, `401/403`.
- **Giải thích nghiệp vụ:** loại bỏ hiệu xe không còn sử dụng theo chính sách quản trị dữ liệu.

---

## 3) Vehicles (`/api/v1/vehicles`)

### 3.1 `POST /api/v1/vehicles`
- **Mục đích:** tạo xe mới cho khách hàng.
- **Method/Path:** `POST /api/v1/vehicles`
- **Auth/role:** bắt buộc.
- **Request:** JSON body `BienSo, MauXe, MaHieuXe, MaKH`.
- **Validate chính:** `BienSo`, `MaHieuXe`, `MaKH` bắt buộc; khóa ngoại là số nguyên dương.
- **Response thành công:** `201`, `data` xe mới.
- **Lỗi thường gặp:** `400`, `404` khách hàng/hiệu xe không tồn tại, `409` biển số trùng.
- **Giải thích nghiệp vụ:** là dữ liệu gốc để phát sinh sửa chữa và phiếu thu theo xe.

### 3.2 `GET /api/v1/vehicles`
- **Mục đích:** lấy danh sách xe có lọc.
- **Method/Path:** `GET /api/v1/vehicles`
- **Auth/role:** bắt buộc.
- **Request:** query `page, limit, search` + `MaXe, BienSo, MauXe, MaHieuXe, MaKH, TienNoHienTai`.
- **Validate chính:** kiểm tra số dương và decimal cho `TienNoHienTai`.
- **Response thành công:** `200`, danh sách xe + phân trang.
- **Lỗi thường gặp:** `400`, `401/403`.
- **Giải thích nghiệp vụ:** hỗ trợ tìm xe theo biển số/khách hàng/công nợ hiện tại.

### 3.3 `GET /api/v1/vehicles/:id`
- **Mục đích:** lấy chi tiết xe.
- **Method/Path:** `GET /api/v1/vehicles/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id integer dương.
- **Response thành công:** `200`, `data` xe.
- **Lỗi thường gặp:** `400`, `404`, `401/403`.
- **Giải thích nghiệp vụ:** dùng trước khi lập chứng từ liên quan xe.

### 3.4 `PUT /api/v1/vehicles/:id`
- **Mục đích:** cập nhật thông tin xe.
- **Method/Path:** `PUT /api/v1/vehicles/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`; body cập nhật một phần `BienSo, MauXe, MaHieuXe, MaKH`.
- **Validate chính:** body `.min(1)`; khóa ngoại phải là số nguyên dương.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `409` biển số trùng.
- **Giải thích nghiệp vụ:** đồng bộ hồ sơ xe khi đổi chủ/đổi thông tin nhận diện.

### 3.5 `DELETE /api/v1/vehicles/:id`
- **Mục đích:** xóa xe theo id.
- **Method/Path:** `DELETE /api/v1/vehicles/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id integer dương.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `409` khi còn dữ liệu nghiệp vụ phụ thuộc.
- **Giải thích nghiệp vụ:** thao tác quản trị dữ liệu xe không còn sử dụng.

---

## 4) Repair Orders (`/api/v1/repair-orders`)

### 4.1 `POST /api/v1/repair-orders`
- **Mục đích:** tạo phiếu sửa chữa (header).
- **Method/Path:** `POST /api/v1/repair-orders`
- **Auth/role:** bắt buộc.
- **Request:** body `MaXe, MaNV, NgaySC, TrangThai, NoiDungLoi, GhiChu`.
- **Validate chính:** `MaXe`, `NgaySC` bắt buộc; `TrangThai` thuộc `TiepNhan|DangSua|HoanTat|Huy`.
- **Response thành công:** `201`.
- **Lỗi thường gặp:** `400`, `404` xe/nhân viên không tồn tại, `409`.
- **Giải thích nghiệp vụ:** CRUD header dùng cho luồng thao tác từng bản ghi, khác workflow atomic.

### 4.2 `GET /api/v1/repair-orders`
- **Mục đích:** danh sách phiếu sửa chữa.
- **Method/Path:** `GET /api/v1/repair-orders`
- **Auth/role:** bắt buộc.
- **Request:** query `page, limit, search` + `MaPhieuSC, MaXe, MaNV, NgaySCFrom, NgaySCTo, TrangThai, NoiDungLoi, GhiChu, TongTien, NgayTaoFrom, NgayTaoTo, NgayCapNhatFrom, NgayCapNhatTo`.
- **Validate chính:** enum `TrangThai` hỗ trợ alias tìm kiếm; date range hợp lệ.
- **Response thành công:** `200`, list + pagination.
- **Lỗi thường gặp:** `400`, `401/403`.
- **Giải thích nghiệp vụ:** giúp theo dõi trạng thái xử lý phiếu theo thời gian.

### 4.3 `GET /api/v1/repair-orders/:id`
- **Mục đích:** lấy chi tiết phiếu sửa chữa.
- **Method/Path:** `GET /api/v1/repair-orders/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id integer dương.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `401/403`.
- **Giải thích nghiệp vụ:** mở chi tiết phiếu trước khi cập nhật/xử lý nghiệp vụ liên quan.

### 4.4 `PUT /api/v1/repair-orders/:id`
- **Mục đích:** cập nhật header phiếu sửa chữa.
- **Method/Path:** `PUT /api/v1/repair-orders/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`; body cập nhật một phần các trường của phiếu.
- **Validate chính:** body `.min(1)`; enum trạng thái hợp lệ.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `409`.
- **Giải thích nghiệp vụ:** cho phép đổi trạng thái/nội dung lỗi/ghi chú trong vòng đời sửa chữa.

### 4.5 `DELETE /api/v1/repair-orders/:id`
- **Mục đích:** xóa phiếu sửa chữa.
- **Method/Path:** `DELETE /api/v1/repair-orders/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id integer dương.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `409` khi ràng buộc chi tiết phiếu.
- **Giải thích nghiệp vụ:** chỉ dùng khi cần loại bản ghi sai trong quản trị dữ liệu.

---

## 5) Labor Fees (`/api/v1/labor-fees`)

### 5.1 `POST /api/v1/labor-fees`
- **Mục đích:** tạo danh mục tiền công.
- **Method/Path:** `POST /api/v1/labor-fees`
- **Auth/role:** bắt buộc.
- **Request:** body `NoiDung, DonGia`.
- **Validate chính:** `NoiDung` bắt buộc; `DonGia >= 0`.
- **Response thành công:** `201`.
- **Lỗi thường gặp:** `400`, `409`, `401/403`.
- **Giải thích nghiệp vụ:** chuẩn giá tiền công để dùng cho chi tiết sửa chữa.

### 5.2 `GET /api/v1/labor-fees`
- **Mục đích:** danh sách tiền công.
- **Method/Path:** `GET /api/v1/labor-fees`
- **Auth/role:** bắt buộc.
- **Request:** query `page, limit, search, MaTienCong, NoiDung, DonGia`.
- **Validate chính:** query number/decimal hợp lệ.
- **Response thành công:** `200`, list + pagination.
- **Lỗi thường gặp:** `400`, `401/403`.
- **Giải thích nghiệp vụ:** phục vụ tra cứu/chọn tiền công khi tạo chi tiết sửa chữa.

### 5.3 `GET /api/v1/labor-fees/:id`
- **Mục đích:** chi tiết tiền công.
- **Method/Path:** `GET /api/v1/labor-fees/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id integer dương.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`.
- **Giải thích nghiệp vụ:** lấy dữ liệu tiền công để kiểm tra hoặc hiển thị form sửa.

### 5.4 `PUT /api/v1/labor-fees/:id`
- **Mục đích:** cập nhật tiền công.
- **Method/Path:** `PUT /api/v1/labor-fees/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`; body một phần `NoiDung, DonGia`.
- **Validate chính:** body `.min(1)`; `DonGia >= 0`.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `409`.
- **Giải thích nghiệp vụ:** đảm bảo bảng giá tiền công luôn đúng thực tế vận hành.

### 5.5 `DELETE /api/v1/labor-fees/:id`
- **Mục đích:** xóa tiền công.
- **Method/Path:** `DELETE /api/v1/labor-fees/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id integer dương.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `409`.
- **Giải thích nghiệp vụ:** dọn danh mục tiền công lỗi/không còn dùng.

---

## 6) Parts (`/api/v1/parts`)

### 6.1 `POST /api/v1/parts`
- **Mục đích:** tạo vật tư/phụ tùng.
- **Method/Path:** `POST /api/v1/parts`
- **Auth/role:** bắt buộc.
- **Request:** body `TenVatTu, DonViTinh, GiaVon, DonGiaBan, MaNCC`.
- **Validate chính:** tên/đơn vị bắt buộc; `GiaVon`, `DonGiaBan >= 0`; `MaNCC` cho phép null hoặc số nguyên dương.
- **Response thành công:** `201`.
- **Lỗi thường gặp:** `400`, `404` nhà cung cấp không tồn tại, `409`.
- **Giải thích nghiệp vụ:** duy trì danh mục vật tư cho sửa chữa và nhập kho.

### 6.2 `GET /api/v1/parts`
- **Mục đích:** lấy danh sách vật tư.
- **Method/Path:** `GET /api/v1/parts`
- **Auth/role:** bắt buộc.
- **Request:** query `page, limit, search` + `MaVatTu, TenVatTu, DonViTinh, SoLuongTon, GiaVon, DonGiaBan, MaNCC, stockStatus(low|out_of_stock|in_stock)`.
- **Validate chính:** filter số/decimal/enum đúng kiểu.
- **Response thành công:** `200`, list + pagination.
- **Lỗi thường gặp:** `400`, `401/403`.
- **Giải thích nghiệp vụ:** theo dõi tồn kho và định giá vật tư.

### 6.3 `GET /api/v1/parts/:id`
- **Mục đích:** lấy chi tiết vật tư.
- **Method/Path:** `GET /api/v1/parts/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id integer dương.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`.
- **Giải thích nghiệp vụ:** phục vụ màn hình chi tiết/chỉnh sửa vật tư.

### 6.4 `PUT /api/v1/parts/:id`
- **Mục đích:** cập nhật vật tư.
- **Method/Path:** `PUT /api/v1/parts/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`; body cập nhật một phần các trường vật tư.
- **Validate chính:** body `.min(1)`; giá trị tiền không âm.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `409`.
- **Giải thích nghiệp vụ:** cập nhật giá/nhà cung cấp/thông tin vật tư theo vận hành thực tế.

### 6.5 `DELETE /api/v1/parts/:id`
- **Mục đích:** xóa vật tư.
- **Method/Path:** `DELETE /api/v1/parts/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id integer dương.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `409` do ràng buộc với chứng từ chi tiết.
- **Giải thích nghiệp vụ:** loại bỏ vật tư sai hoặc ngừng sử dụng.

---

## 7) Repair Order Details (`/api/v1/repair-order-details`)

### 7.1 `POST /api/v1/repair-order-details`
- **Mục đích:** tạo dòng chi tiết cho phiếu sửa chữa.
- **Method/Path:** `POST /api/v1/repair-order-details`
- **Auth/role:** bắt buộc.
- **Request:** body `MaPhieuSC, MaVatTu, MaTienCong, SoLuong, DonGiaVatTu, DonGiaTienCong`.
- **Validate chính:** các mã khóa ngoại và `SoLuong` là số nguyên dương; đơn giá `>= 0`.
- **Response thành công:** `201`.
- **Lỗi thường gặp:** `400`, `404` không tìm thấy phiếu/vật tư/tiền công, `409`.
- **Giải thích nghiệp vụ:** cho phép thao tác từng dòng chi tiết độc lập trong mô hình CRUD.

### 7.2 `GET /api/v1/repair-order-details`
- **Mục đích:** danh sách chi tiết phiếu sửa chữa.
- **Method/Path:** `GET /api/v1/repair-order-details`
- **Auth/role:** bắt buộc.
- **Request:** query `page, limit, search` + `MaCTSC, MaPhieuSC, MaVatTu, MaTienCong, SoLuong, DonGiaVatTu, DonGiaTienCong, ThanhTien`.
- **Validate chính:** filter number/decimal đúng kiểu.
- **Response thành công:** `200`, list + pagination.
- **Lỗi thường gặp:** `400`, `401/403`.
- **Giải thích nghiệp vụ:** phục vụ tra cứu, đối soát chi tiết sửa chữa theo phiếu.

### 7.3 `GET /api/v1/repair-order-details/:id`
- **Mục đích:** lấy chi tiết một dòng sửa chữa.
- **Method/Path:** `GET /api/v1/repair-order-details/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id integer dương.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`.
- **Giải thích nghiệp vụ:** hỗ trợ màn hình xem/sửa từng dòng chi tiết.

### 7.4 `PUT /api/v1/repair-order-details/:id`
- **Mục đích:** cập nhật một dòng chi tiết sửa chữa.
- **Method/Path:** `PUT /api/v1/repair-order-details/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`; body cập nhật một phần các trường chi tiết.
- **Validate chính:** body `.min(1)`; giữ ràng buộc kiểu số dương/không âm.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `409`.
- **Giải thích nghiệp vụ:** cho phép chỉnh sửa vật tư/tiền công/số lượng từng dòng.

### 7.5 `DELETE /api/v1/repair-order-details/:id`
- **Mục đích:** xóa dòng chi tiết sửa chữa.
- **Method/Path:** `DELETE /api/v1/repair-order-details/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id integer dương.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `409`.
- **Giải thích nghiệp vụ:** xử lý các dòng nhập sai trong phiếu sửa chữa.

---

## 8) Suppliers (`/api/v1/suppliers`)

### 8.1 `POST /api/v1/suppliers`
- **Mục đích:** tạo nhà cung cấp.
- **Method/Path:** `POST /api/v1/suppliers`
- **Auth/role:** bắt buộc.
- **Request:** body `TenNCC, DienThoai, Email, NguoiLienHe, DiaChi`.
- **Validate chính:** `TenNCC`, `DienThoai`, `DiaChi` bắt buộc; `Email` đúng format nếu có.
- **Response thành công:** `201`.
- **Lỗi thường gặp:** `400`, `409`, `401/403`.
- **Giải thích nghiệp vụ:** quản lý nguồn cung vật tư cho gara.

### 8.2 `GET /api/v1/suppliers`
- **Mục đích:** lấy danh sách nhà cung cấp.
- **Method/Path:** `GET /api/v1/suppliers`
- **Auth/role:** bắt buộc.
- **Request:** query `page, limit, search, MaNCC, TenNCC, DienThoai, Email, NguoiLienHe, DiaChi`.
- **Validate chính:** filter đúng kiểu string/number.
- **Response thành công:** `200`, list + pagination.
- **Lỗi thường gặp:** `400`, `401/403`.
- **Giải thích nghiệp vụ:** hỗ trợ tìm nhà cung cấp khi nhập kho.

### 8.3 `GET /api/v1/suppliers/:id`
- **Mục đích:** chi tiết nhà cung cấp.
- **Method/Path:** `GET /api/v1/suppliers/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id integer dương.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`.
- **Giải thích nghiệp vụ:** phục vụ xem/chỉnh hồ sơ từng nhà cung cấp.

### 8.4 `PUT /api/v1/suppliers/:id`
- **Mục đích:** cập nhật nhà cung cấp.
- **Method/Path:** `PUT /api/v1/suppliers/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`; body một phần `TenNCC, DienThoai, Email, NguoiLienHe, DiaChi`.
- **Validate chính:** body `.min(1)`; email chuẩn khi truyền.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `409`.
- **Giải thích nghiệp vụ:** đồng bộ thông tin liên hệ nhà cung cấp.

### 8.5 `DELETE /api/v1/suppliers/:id`
- **Mục đích:** xóa nhà cung cấp.
- **Method/Path:** `DELETE /api/v1/suppliers/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id integer dương.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `409` nếu đang được tham chiếu.
- **Giải thích nghiệp vụ:** dọn dữ liệu NCC không còn hoạt động.

---

## 9) Stock Receipts (`/api/v1/stock-receipts`)

### 9.1 `POST /api/v1/stock-receipts`
- **Mục đích:** tạo phiếu nhập kho (header).
- **Method/Path:** `POST /api/v1/stock-receipts`
- **Auth/role:** bắt buộc.
- **Request:** body `MaNCC, NgayNhap`.
- **Validate chính:** `MaNCC` số nguyên dương; `NgayNhap` date hợp lệ.
- **Response thành công:** `201`.
- **Lỗi thường gặp:** `400`, `404` nhà cung cấp không tồn tại, `409`.
- **Giải thích nghiệp vụ:** CRUD header riêng khi không dùng workflow atomic.

### 9.2 `GET /api/v1/stock-receipts`
- **Mục đích:** danh sách phiếu nhập kho.
- **Method/Path:** `GET /api/v1/stock-receipts`
- **Auth/role:** bắt buộc.
- **Request:** query `page, limit, search, MaPhieuNhap, MaNCC, NgayNhapFrom, NgayNhapTo, TongTien`.
- **Validate chính:** date range và decimal hợp lệ.
- **Response thành công:** `200`, list + pagination.
- **Lỗi thường gặp:** `400`, `401/403`.
- **Giải thích nghiệp vụ:** theo dõi lịch sử nhập kho và tổng tiền.

### 9.3 `GET /api/v1/stock-receipts/:id`
- **Mục đích:** chi tiết phiếu nhập.
- **Method/Path:** `GET /api/v1/stock-receipts/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id integer dương.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`.
- **Giải thích nghiệp vụ:** mở chi tiết header trước khi sửa hoặc đối soát.

### 9.4 `PUT /api/v1/stock-receipts/:id`
- **Mục đích:** cập nhật phiếu nhập (header).
- **Method/Path:** `PUT /api/v1/stock-receipts/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`; body một phần `MaNCC, NgayNhap`.
- **Validate chính:** body `.min(1)`.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `409`.
- **Giải thích nghiệp vụ:** chỉnh thông tin header nhập kho khi cần.

### 9.5 `DELETE /api/v1/stock-receipts/:id`
- **Mục đích:** xóa phiếu nhập.
- **Method/Path:** `DELETE /api/v1/stock-receipts/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id integer dương.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `409` khi còn chi tiết liên quan.
- **Giải thích nghiệp vụ:** xóa bản ghi header nhập kho sai.

---

## 10) Stock Receipt Details (`/api/v1/stock-receipt-details`)

### 10.1 `POST /api/v1/stock-receipt-details`
- **Mục đích:** tạo dòng chi tiết nhập kho.
- **Method/Path:** `POST /api/v1/stock-receipt-details`
- **Auth/role:** bắt buộc.
- **Request:** body `MaPhieuNhap, MaVatTu, SoLuong, DonGiaNhap`.
- **Validate chính:** mã tham chiếu + `SoLuong` là số nguyên dương; `DonGiaNhap >= 0`.
- **Response thành công:** `201`.
- **Lỗi thường gặp:** `400`, `404`, `409`.
- **Giải thích nghiệp vụ:** cho phép thao tác chi tiết nhập theo từng dòng độc lập.

### 10.2 `GET /api/v1/stock-receipt-details`
- **Mục đích:** danh sách chi tiết nhập kho.
- **Method/Path:** `GET /api/v1/stock-receipt-details`
- **Auth/role:** bắt buộc.
- **Request:** query `page, limit, search, MaCTPN, MaPhieuNhap, MaVatTu, SoLuong, DonGiaNhap, ThanhTien`.
- **Validate chính:** filter số/decimal đúng schema.
- **Response thành công:** `200`, list + pagination.
- **Lỗi thường gặp:** `400`, `401/403`.
- **Giải thích nghiệp vụ:** tra cứu dòng nhập theo phiếu/vật tư/giá trị.

### 10.3 `GET /api/v1/stock-receipt-details/:id`
- **Mục đích:** lấy chi tiết một dòng nhập.
- **Method/Path:** `GET /api/v1/stock-receipt-details/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id integer dương.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`.
- **Giải thích nghiệp vụ:** hiển thị một dòng nhập cụ thể để kiểm tra/chỉnh sửa.

### 10.4 `PUT /api/v1/stock-receipt-details/:id`
- **Mục đích:** cập nhật dòng nhập kho.
- **Method/Path:** `PUT /api/v1/stock-receipt-details/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`; body cập nhật một phần `MaPhieuNhap, MaVatTu, SoLuong, DonGiaNhap`.
- **Validate chính:** body `.min(1)` và giữ ràng buộc số dương/không âm.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `409`.
- **Giải thích nghiệp vụ:** điều chỉnh dòng nhập bị sai số lượng/đơn giá.

### 10.5 `DELETE /api/v1/stock-receipt-details/:id`
- **Mục đích:** xóa dòng chi tiết nhập kho.
- **Method/Path:** `DELETE /api/v1/stock-receipt-details/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id integer dương.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `409`.
- **Giải thích nghiệp vụ:** loại bỏ dòng nhập sai trước khi chốt dữ liệu.

---

## 11) Payment Receipts (`/api/v1/payment-receipts`)

### 11.1 `POST /api/v1/payment-receipts`
- **Mục đích:** tạo phiếu thu tiền.
- **Method/Path:** `POST /api/v1/payment-receipts`
- **Auth/role:** bắt buộc.
- **Request:** body `MaXe, MaNV, NgayThu, SoTienThu, PhuongThucThu, TrangThai, GhiChu`.
- **Validate chính:** `MaXe`, `NgayThu`, `SoTienThu` bắt buộc; `SoTienThu > 0`; enum `PhuongThucThu` = `TienMat|ChuyenKhoan`, `TrangThai` = `ChoXacNhan|DaThu|Huy`.
- **Response thành công:** `201`.
- **Lỗi thường gặp:** `400`, `404`, `409`, `401/403`.
- **Giải thích nghiệp vụ:** ghi nhận thu tiền theo xe trong mô hình CRUD management hiện public.

### 11.2 `GET /api/v1/payment-receipts`
- **Mục đích:** danh sách phiếu thu.
- **Method/Path:** `GET /api/v1/payment-receipts`
- **Auth/role:** bắt buộc.
- **Request:** query `page, limit, search` + `MaPhieuThu, MaXe, MaNV, NgayThuFrom, NgayThuTo, SoTienThu, PhuongThucThu, TrangThai, GhiChu, NgayTaoFrom, NgayTaoTo, NgayCapNhatFrom, NgayCapNhatTo`.
- **Validate chính:** enum hỗ trợ alias tìm kiếm cho `PhuongThucThu/TrangThai`; date range hợp lệ.
- **Response thành công:** `200`, list + pagination.
- **Lỗi thường gặp:** `400`, `401/403`.
- **Giải thích nghiệp vụ:** theo dõi trạng thái và lịch sử thu tiền.

### 11.3 `GET /api/v1/payment-receipts/:id`
- **Mục đích:** chi tiết phiếu thu.
- **Method/Path:** `GET /api/v1/payment-receipts/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id integer dương.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`.
- **Giải thích nghiệp vụ:** phục vụ xem lại chứng từ thu tiền cụ thể.

### 11.4 `PUT /api/v1/payment-receipts/:id`
- **Mục đích:** cập nhật phiếu thu.
- **Method/Path:** `PUT /api/v1/payment-receipts/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`; body cập nhật một phần các trường phiếu thu.
- **Validate chính:** body `.min(1)`; `SoTienThu > 0` khi truyền; enum hợp lệ.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `409`.
- **Giải thích nghiệp vụ:** điều chỉnh thông tin chứng từ thu tiền trong vòng đời xử lý.

### 11.5 `DELETE /api/v1/payment-receipts/:id`
- **Mục đích:** xóa phiếu thu.
- **Method/Path:** `DELETE /api/v1/payment-receipts/:id`
- **Auth/role:** bắt buộc.
- **Request:** params `id`.
- **Validate chính:** id integer dương.
- **Response thành công:** `200`.
- **Lỗi thường gặp:** `400`, `404`, `409`.
- **Giải thích nghiệp vụ:** xử lý bản ghi phiếu thu sai trong phạm vi quản trị dữ liệu.

---

## 12) Master Data XLSX (`/api/v1/master-data/xlsx`)

`entity` hợp lệ: `car-brands`, `customers`, `labor-fees`, `parts`, `suppliers`, `vehicles`, `repair-orders`, `repair-order-details`, `stock-receipts`, `stock-receipt-details`, `payment-receipts`.

### 12.1 `GET /api/v1/master-data/xlsx/:entity/template`
- **Mục đích:** tải file template `.xlsx` cho entity.
- **Method/Path:** `GET /api/v1/master-data/xlsx/:entity/template`
- **Auth/role:** bắt buộc.
- **Request:** params `entity`.
- **Validate chính:** `entity` phải thuộc whitelist trên; query/body rỗng.
- **Response thành công:** `200`, binary file `.xlsx`.
- **Lỗi thường gặp:** `400` entity không hợp lệ, `404` entity không hỗ trợ, `401/403`.
- **Giải thích nghiệp vụ:** chuẩn hóa mẫu nhập liệu trước khi import/sync/update.

### 12.2 `GET /api/v1/master-data/xlsx/:entity/export`
- **Mục đích:** export dữ liệu hiện có ra `.xlsx`.
- **Method/Path:** `GET /api/v1/master-data/xlsx/:entity/export`
- **Auth/role:** bắt buộc.
- **Request:** params `entity`.
- **Validate chính:** `entity` hợp lệ; query/body rỗng.
- **Response thành công:** `200`, file `.xlsx` export.
- **Lỗi thường gặp:** `400`, `404`, `401/403`, `500`.
- **Giải thích nghiệp vụ:** phục vụ backup/chỉnh sửa hàng loạt ngoài hệ thống.

### 12.3 `POST /api/v1/master-data/xlsx/:entity/import`
- **Mục đích:** import mới dữ liệu từ file `.xlsx`.
- **Method/Path:** `POST /api/v1/master-data/xlsx/:entity/import`
- **Auth/role:** bắt buộc.
- **Request:** params `entity`; `multipart/form-data` field `file` (.xlsx, tối đa 10MB).
- **Validate chính:** bắt buộc có file (`requireXlsxFile`), params entity đúng schema, body rỗng.
- **Response thành công:** `200`, thống kê kết quả import theo service.
- **Lỗi thường gặp:** `400` thiếu/sai file, `404` entity không hỗ trợ, `409` xung đột dữ liệu.
- **Giải thích nghiệp vụ:** dùng khi nạp dữ liệu hàng loạt ban đầu.

### 12.4 `PUT /api/v1/master-data/xlsx/:entity/sync`
- **Mục đích:** đồng bộ dữ liệu từ file `.xlsx`.
- **Method/Path:** `PUT /api/v1/master-data/xlsx/:entity/sync`
- **Auth/role:** bắt buộc.
- **Request:** params `entity`; multipart field `file`.
- **Validate chính:** tương tự import: entity whitelist + bắt buộc file + body rỗng.
- **Response thành công:** `200`, kết quả sync.
- **Lỗi thường gặp:** `400`, `404`, `409`, `500`.
- **Giải thích nghiệp vụ:** đồng bộ thay đổi hàng loạt giữa file và dữ liệu hệ thống.

### 12.5 `PUT /api/v1/master-data/xlsx/:entity/update`
- **Mục đích:** cập nhật dữ liệu hàng loạt từ file `.xlsx`.
- **Method/Path:** `PUT /api/v1/master-data/xlsx/:entity/update`
- **Auth/role:** bắt buộc.
- **Request:** params `entity`; multipart field `file`.
- **Validate chính:** tương tự sync/import.
- **Response thành công:** `200`, kết quả update hàng loạt.
- **Lỗi thường gặp:** `400`, `404`, `409`, `500`.
- **Giải thích nghiệp vụ:** áp dụng chỉnh sửa batch cho dữ liệu master/transaction theo entity được hỗ trợ.
