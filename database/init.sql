-- Reseed dữ liệu mẫu tiếng Việt cho schema đã được tạo sẵn bằng Prisma migrations.
-- Lưu file này bằng UTF-8 và import bằng client dùng utf8mb4.
-- Script này chỉ reseed dữ liệu cho schema hiện có, không thay đổi schema.

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

-- Phase DML: reset và nạp lại dữ liệu mẫu.
START TRANSACTION;
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM `CT_PHIEU_SUA_CHUA`;
DELETE FROM `CT_PHIEU_NHAP`;
DELETE FROM `PHIEU_THU_TIEN`;
DELETE FROM `PHIEU_SUA_CHUA`;
DELETE FROM `PHIEU_NHAP_KHO`;
DELETE FROM `XE`;
DELETE FROM `VAT_TU`;
DELETE FROM `TIEN_CONG`;
DELETE FROM `NHA_CUNG_CAP`;
DELETE FROM `KHACH_HANG`;
DELETE FROM `HIEU_XE`;

DROP TEMPORARY TABLE IF EXISTS seq_1_300;
CREATE TEMPORARY TABLE seq_1_300 (
    n INT PRIMARY KEY
);

INSERT INTO seq_1_300 (n)
WITH RECURSIVE cte AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1
    FROM cte
    WHERE n < 300
)
SELECT n
FROM cte;

INSERT INTO `HIEU_XE` (`MaHieuXe`, `TenHieuXe`, `Logo`) VALUES
(1,  'Toyota',     '/logos/toyota.png'),
(2,  'Honda',      '/logos/honda.png'),
(3,  'Ford',       '/logos/ford.png'),
(4,  'Kia',        '/logos/kia.png'),
(5,  'Mazda',      '/logos/mazda.png'),
(6,  'Hyundai',    '/logos/hyundai.png'),
(7,  'Mitsubishi', '/logos/mitsubishi.png'),
(8,  'Chevrolet',  '/logos/chevrolet.png'),
(9,  'Nissan',     '/logos/nissan.png'),
(10, 'Suzuki',     '/logos/suzuki.png');

INSERT INTO `KHACH_HANG`
(`MaKH`, `TenChuXe`, `DienThoai`, `DiaChi`, `Avatar`, `ChucVu`, `Email`, `MatKhau`,
 `NgayCapNhat`, `NgayTao`, `TrangThai`, `TokenDatLaiMatKhau`, `TokenDatLaiMatKhauHetHanLuc`, `TokenDatLaiMatKhauDaDungLuc`)
VALUES
(1, 'Quản trị hệ thống', '0901000001', '1 Nguyễn Huệ, Quận 1, TP.HCM', '/avatars/admin.png', 'Admin', 'admin@garage.local',
 '$2b$10$adminhashdemo', '2026-03-01 08:00:00.000', '2026-03-01 08:00:00.000', 'HoatDong', NULL, NULL, NULL),
(2, 'Nguyễn Văn Minh', '0901000002', '12 Lê Lợi, Quận 1, TP.HCM', '/avatars/nv-minh.png', 'NhanVien', 'minh@garage.local',
 '$2b$10$nhanvienminh', '2026-03-01 08:05:00.000', '2026-03-01 08:05:00.000', 'HoatDong', NULL, NULL, NULL),
(3, 'Trần Thị Hạnh', '0901000003', '55 Võ Văn Tần, Quận 3, TP.HCM', '/avatars/nv-hanh.png', 'NhanVien', 'hanh@garage.local',
 '$2b$10$nhanvienhanh', '2026-03-01 08:10:00.000', '2026-03-01 08:10:00.000', 'HoatDong', NULL, NULL, NULL),
(4, 'Lê Quốc Bảo', '0901000004', '88 Cộng Hòa, Tân Bình, TP.HCM', '/avatars/nv-bao.png', 'NhanVien', 'bao@garage.local',
 '$2b$10$nhanvienbao', '2026-03-01 08:15:00.000', '2026-03-01 08:15:00.000', 'HoatDong', NULL, NULL, NULL),
(5, 'Phạm Ngọc Lan', '0901000005', '9 Điện Biên Phủ, Bình Thạnh, TP.HCM', '/avatars/nv-lan.png', 'NhanVien', 'lan@garage.local',
 '$2b$10$nhanvienlan', '2026-03-01 08:20:00.000', '2026-03-01 08:20:00.000', 'HoatDong', NULL, NULL, NULL);

INSERT INTO `KHACH_HANG`
(`MaKH`, `TenChuXe`, `DienThoai`, `DiaChi`, `Avatar`, `ChucVu`, `Email`, `MatKhau`,
 `NgayCapNhat`, `NgayTao`, `TrangThai`, `TokenDatLaiMatKhau`, `TokenDatLaiMatKhauHetHanLuc`, `TokenDatLaiMatKhauDaDungLuc`)
SELECT
    s.n + 5 AS MaKH,
    CONCAT(
        CASE (s.n MOD 12)
            WHEN 0 THEN 'Nguyễn'
            WHEN 1 THEN 'Trần'
            WHEN 2 THEN 'Lê'
            WHEN 3 THEN 'Phạm'
            WHEN 4 THEN 'Hoàng'
            WHEN 5 THEN 'Võ'
            WHEN 6 THEN 'Đặng'
            WHEN 7 THEN 'Bùi'
            WHEN 8 THEN 'Đỗ'
            WHEN 9 THEN 'Hồ'
            WHEN 10 THEN 'Dương'
            ELSE 'Phan'
        END,
        ' ',
        CASE (s.n MOD 10)
            WHEN 0 THEN 'Minh'
            WHEN 1 THEN 'Anh'
            WHEN 2 THEN 'Hùng'
            WHEN 3 THEN 'Lan'
            WHEN 4 THEN 'Khánh'
            WHEN 5 THEN 'Thảo'
            WHEN 6 THEN 'Tuấn'
            WHEN 7 THEN 'My'
            WHEN 8 THEN 'Quân'
            ELSE 'Trang'
        END,
        ' ',
        LPAD(s.n, 3, '0')
    ) AS TenChuXe,
    CONCAT('09', LPAD(20000000 + s.n, 8, '0')) AS DienThoai,
    CONCAT(
        10 + (s.n MOD 190), ' ',
        CASE (s.n MOD 8)
            WHEN 0 THEN 'Nguyễn Trãi'
            WHEN 1 THEN 'Lê Lợi'
            WHEN 2 THEN 'Hai Bà Trưng'
            WHEN 3 THEN 'Phan Xích Long'
            WHEN 4 THEN 'Trường Chinh'
            WHEN 5 THEN 'Võ Văn Tần'
            WHEN 6 THEN 'Cách Mạng Tháng 8'
            ELSE 'Nguyễn Văn Linh'
        END,
        ', ',
        CASE (s.n MOD 6)
            WHEN 0 THEN 'Quận 1'
            WHEN 1 THEN 'Quận 3'
            WHEN 2 THEN 'Quận 7'
            WHEN 3 THEN 'Tân Bình'
            WHEN 4 THEN 'Gò Vấp'
            ELSE 'Thủ Đức'
        END,
        ', TP.HCM'
    ) AS DiaChi,
    CONCAT('/avatars/customer-', (s.n MOD 12) + 1, '.png') AS Avatar,
    'KhachHang' AS ChucVu,
    CONCAT('kh', LPAD(s.n, 3, '0'), '@mail.local') AS Email,
    CONCAT('$2b$10$khachhang', LPAD(s.n, 3, '0')) AS MatKhau,
    TIMESTAMP('2026-03-01 09:00:00') + INTERVAL s.n MINUTE AS NgayCapNhat,
    TIMESTAMP('2026-03-01 09:00:00') + INTERVAL s.n MINUTE AS NgayTao,
    'HoatDong' AS TrangThai,
    NULL, NULL, NULL
FROM seq_1_300 s
WHERE s.n BETWEEN 1 AND 60;

INSERT INTO `NHA_CUNG_CAP`
(`MaNCC`, `TenNCC`, `DienThoai`, `DiaChi`, `Email`, `NguoiLienHe`)
VALUES
(1, 'Công ty Phụ tùng Sài Gòn', '02873000001', '120 Quốc lộ 13, Thủ Đức, TP.HCM', 'contact@phutungsaigon.vn', 'Ngô Văn Phúc'),
(2, 'Auto Parts Miền Nam', '02873000002', '45 Nguyễn Văn Linh, Quận 7, TP.HCM', 'sales@autopartsmiennam.vn', 'Lê Thị Mỹ Dung'),
(3, 'Ắc quy Việt Nhật', '02873000003', '9 Khu công nghiệp Tân Bình, TP.HCM', 'kinhdoanh@acquyvietnhat.vn', 'Phạm Đức Long'),
(4, 'Đèn xe Chính Hãng 247', '02873000004', '200 Lũy Bán Bích, Tân Phú, TP.HCM', 'support@denxe247.vn', 'Trần Gia Hưng'),
(5, 'Kho Dầu Nhớt Miền Đông', '02873000005', '17 Xa lộ Hà Nội, Thủ Đức, TP.HCM', 'sales@daunhotmiendong.vn', 'Huỳnh Quang Đạt'),
(6, 'Linh kiện Ô tô Toàn Phát', '02873000006', '66 Tô Ký, Quận 12, TP.HCM', 'cs@toanphatparts.vn', 'Đặng Thành Công');

INSERT INTO `TIEN_CONG` (`MaTienCong`, `NoiDung`, `DonGia`) VALUES
(1, 'Thay lọc nhớt', 250000.00),
(2, 'Châm hoặc thay dầu động cơ', 80000.00),
(3, 'Thay má phanh trước', 400000.00),
(4, 'Thay ắc quy', 150000.00),
(5, 'Thay bugi', 200000.00),
(6, 'Thay đèn pha', 180000.00),
(7, 'Vệ sinh kim phun', 350000.00),
(8, 'Bảo dưỡng điều hòa', 450000.00);

INSERT INTO `VAT_TU`
(`MaVatTu`, `TenVatTu`, `DonViTinh`, `SoLuongTon`, `GiaVon`, `DonGiaBan`, `MaNCC`)
VALUES
(1,  'Lọc nhớt động cơ',         'Cái',  0,  80000.00,   120000.00, 1),
(2,  'Dầu động cơ 5W30',         'Lít',  0,  90000.00,   130000.00, 5),
(3,  'Má phanh trước',           'Bộ',   0,  450000.00,  650000.00, 2),
(4,  'Ắc quy 12V 60Ah',          'Bình', 0,  1200000.00, 1500000.00, 3),
(5,  'Bugi Iridium',             'Cái',  0,  180000.00,  260000.00, 2),
(6,  'Đèn pha LED H4',           'Bộ',   0,  700000.00,  950000.00, 4),
(7,  'Lọc gió động cơ',          'Cái',  0,  150000.00,  220000.00, 1),
(8,  'Lọc gió điều hòa',         'Cái',  0,  120000.00,  180000.00, 1),
(9,  'Nước làm mát',             'Lít',  0,  70000.00,   110000.00, 5),
(10, 'Dầu phanh',                'Lít',  0,  100000.00,  150000.00, 5),
(11, 'Dây curoa tổng',           'Sợi',  0,  350000.00,  520000.00, 6),
(12, 'Cầu chì và bóng đèn phụ',  'Bộ',   0,  50000.00,   90000.00,  6);

INSERT INTO `XE`
(`MaXe`, `BienSo`, `MaHieuXe`, `MaKH`, `TienNoHienTai`)
SELECT
    s.n AS MaXe,
    CONCAT(
        LPAD(10 + FLOOR((s.n - 1) / 10), 2, '0'),
        CHAR(65 + ((s.n - 1) MOD 26)),
        '-',
        LPAD(10000 + s.n, 5, '0')
    ) AS BienSo,
    ((s.n - 1) MOD 10) + 1 AS MaHieuXe,
    6 + ((s.n - 1) MOD 60) AS MaKH,
    0.00 AS TienNoHienTai
FROM seq_1_300 s
WHERE s.n BETWEEN 1 AND 90;

INSERT INTO `PHIEU_NHAP_KHO`
(`MaPhieuNhap`, `MaNCC`, `NgayNhap`, `TongTien`)
SELECT
    s.n AS MaPhieuNhap,
    ((s.n - 1) MOD 6) + 1 AS MaNCC,
    DATE('2026-01-01') + INTERVAL (s.n * 2) DAY AS NgayNhap,
    0.00 AS TongTien
FROM seq_1_300 s
WHERE s.n BETWEEN 1 AND 24;

INSERT INTO `CT_PHIEU_NHAP`
(`MaCTPN`, `MaPhieuNhap`, `MaVatTu`, `SoLuong`, `DonGiaNhap`, `ThanhTien`)
SELECT
    ROW_NUMBER() OVER (ORDER BY q.MaPhieuNhap, q.MaVatTu) AS MaCTPN,
    q.MaPhieuNhap,
    q.MaVatTu,
    q.SoLuong,
    v.GiaVon,
    q.SoLuong * v.GiaVon
FROM (
    SELECT MaPhieuNhap, ((MaPhieuNhap - 1) MOD 12) + 1 AS MaVatTu, 80 + ((MaPhieuNhap - 1) MOD 5) * 10 AS SoLuong
    FROM PHIEU_NHAP_KHO
    UNION ALL
    SELECT MaPhieuNhap, ((MaPhieuNhap + 3 - 1) MOD 12) + 1 AS MaVatTu, 60 + ((MaPhieuNhap - 1) MOD 4) * 10 AS SoLuong
    FROM PHIEU_NHAP_KHO
    UNION ALL
    SELECT MaPhieuNhap, ((MaPhieuNhap + 7 - 1) MOD 12) + 1 AS MaVatTu, 40 + ((MaPhieuNhap - 1) MOD 3) * 10 AS SoLuong
    FROM PHIEU_NHAP_KHO
) q
JOIN VAT_TU v ON v.MaVatTu = q.MaVatTu;

UPDATE PHIEU_NHAP_KHO p
JOIN (
    SELECT MaPhieuNhap, SUM(ThanhTien) AS TongTien
    FROM CT_PHIEU_NHAP
    GROUP BY MaPhieuNhap
) x ON x.MaPhieuNhap = p.MaPhieuNhap
SET p.TongTien = x.TongTien;

INSERT INTO `PHIEU_SUA_CHUA`
(`MaPhieuSC`, `MaXe`, `NgaySC`, `TrangThai`, `TongTien`, `GhiChu`, `MaNV`, `NgayCapNhat`, `NgayTao`, `NoiDungLoi`)
SELECT
    s.n AS MaPhieuSC,
    ((s.n - 1) MOD 90) + 1 AS MaXe,
    DATE('2026-03-01') + INTERVAL ((s.n - 1) MOD 28) DAY AS NgaySC,
    CASE
        WHEN s.n MOD 9 = 0 THEN 'TiepNhan'
        WHEN s.n MOD 7 = 0 THEN 'DangSua'
        ELSE 'HoanTat'
    END AS TrangThai,
    0.00 AS TongTien,
    CASE (s.n MOD 6)
        WHEN 0 THEN 'Bảo dưỡng định kỳ'
        WHEN 1 THEN 'Khách phản ánh xe rung nhẹ'
        WHEN 2 THEN 'Khách yêu cầu kiểm tra hệ thống phanh'
        WHEN 3 THEN 'Kiểm tra điện và hệ thống đề'
        WHEN 4 THEN 'Xử lý điều hòa hoạt động yếu'
        ELSE 'Kiểm tra tổng quát trước chuyến đi xa'
    END AS GhiChu,
    2 + ((s.n - 1) MOD 4) AS MaNV,
    TIMESTAMP(DATE('2026-03-01') + INTERVAL ((s.n - 1) MOD 28) DAY, '17:30:00') AS NgayCapNhat,
    TIMESTAMP(DATE('2026-03-01') + INTERVAL ((s.n - 1) MOD 28) DAY, '08:30:00') AS NgayTao,
    CASE (s.n MOD 8)
        WHEN 0 THEN 'Đến kỳ thay nhớt và lọc nhớt'
        WHEN 1 THEN 'Phanh trước mòn, cần thay thế'
        WHEN 2 THEN 'Ắc quy yếu, đề khó nổ'
        WHEN 3 THEN 'Bugi mòn, máy rung khi tăng ga'
        WHEN 4 THEN 'Đèn pha sáng yếu'
        WHEN 5 THEN 'Lọc gió bẩn, xe ì'
        WHEN 6 THEN 'Điều hòa mát kém'
        ELSE 'Khách yêu cầu bảo dưỡng tổng quát'
    END AS NoiDungLoi
FROM seq_1_300 s
WHERE s.n BETWEEN 1 AND 180;

INSERT INTO `CT_PHIEU_SUA_CHUA`
(`MaCTSC`, `MaPhieuSC`, `MaVatTu`, `MaTienCong`, `SoLuong`, `DonGiaVatTu`, `DonGiaTienCong`, `ThanhTien`)
SELECT
    ROW_NUMBER() OVER (ORDER BY p.MaPhieuSC, vt.MaVatTu, tc.MaTienCong) AS MaCTSC,
    p.MaPhieuSC,
    vt.MaVatTu,
    tc.MaTienCong,
    CASE
        WHEN vt.MaVatTu IN (2, 5, 9, 10) THEN 2 + (p.MaPhieuSC MOD 2)
        ELSE 1
    END AS SoLuong,
    vt.DonGiaBan,
    tc.DonGia,
    (
        CASE
            WHEN vt.MaVatTu IN (2, 5, 9, 10) THEN 2 + (p.MaPhieuSC MOD 2)
            ELSE 1
        END * vt.DonGiaBan
    ) + tc.DonGia AS ThanhTien
FROM PHIEU_SUA_CHUA p
JOIN XE x ON x.MaXe = p.MaXe
JOIN VAT_TU vt ON vt.MaVatTu = ((x.MaXe - 1) MOD 12) + 1
JOIN TIEN_CONG tc ON tc.MaTienCong = ((x.MaXe - 1) MOD 8) + 1;

INSERT INTO `CT_PHIEU_SUA_CHUA`
(`MaCTSC`, `MaPhieuSC`, `MaVatTu`, `MaTienCong`, `SoLuong`, `DonGiaVatTu`, `DonGiaTienCong`, `ThanhTien`)
SELECT
    1000 + ROW_NUMBER() OVER (ORDER BY p.MaPhieuSC, vt.MaVatTu, tc.MaTienCong) AS MaCTSC,
    p.MaPhieuSC,
    vt.MaVatTu,
    tc.MaTienCong,
    CASE
        WHEN vt.MaVatTu IN (2, 9, 10, 12) THEN 1 + (p.MaPhieuSC MOD 3)
        ELSE 1
    END AS SoLuong,
    vt.DonGiaBan,
    tc.DonGia,
    (
        CASE
            WHEN vt.MaVatTu IN (2, 9, 10, 12) THEN 1 + (p.MaPhieuSC MOD 3)
            ELSE 1
        END * vt.DonGiaBan
    ) + tc.DonGia AS ThanhTien
FROM PHIEU_SUA_CHUA p
JOIN XE x ON x.MaXe = p.MaXe
JOIN VAT_TU vt ON vt.MaVatTu = ((x.MaXe + 4 - 1) MOD 12) + 1
JOIN TIEN_CONG tc ON tc.MaTienCong = ((x.MaXe + 3 - 1) MOD 8) + 1;

UPDATE PHIEU_SUA_CHUA p
JOIN (
    SELECT MaPhieuSC, SUM(ThanhTien) AS TongTien
    FROM CT_PHIEU_SUA_CHUA
    GROUP BY MaPhieuSC
) x ON x.MaPhieuSC = p.MaPhieuSC
SET p.TongTien = x.TongTien;

INSERT INTO `PHIEU_THU_TIEN`
(`MaXe`, `NgayThu`, `SoTienThu`, `GhiChu`, `MaNV`, `NgayCapNhat`, `NgayTao`, `PhuongThucThu`, `TrangThai`)
SELECT
    t.MaXe,
    DATE('2026-03-25') + INTERVAL (t.MaXe MOD 5) DAY AS NgayThu,
    CASE
        WHEN t.MaXe MOD 10 = 0 THEN ROUND(t.TongSua * 0.20, 2)
        WHEN t.MaXe MOD 6 = 0 THEN ROUND(t.TongSua * 0.40, 2)
        WHEN t.MaXe MOD 5 = 0 THEN ROUND(t.TongSua * 1.00, 2)
        WHEN t.MaXe MOD 5 = 1 THEN ROUND(t.TongSua * 0.70, 2)
        WHEN t.MaXe MOD 5 = 2 THEN ROUND(t.TongSua * 0.50, 2)
        WHEN t.MaXe MOD 5 = 3 THEN ROUND(t.TongSua * 0.30, 2)
        ELSE ROUND(t.TongSua * 0.60, 2)
    END AS SoTienThu,
    CASE
        WHEN t.MaXe MOD 10 = 0 THEN 'Phiếu thu đã hủy do khách đổi lịch thanh toán'
        WHEN t.MaXe MOD 6 = 0 THEN 'Đang chờ xác nhận giao dịch chuyển khoản'
        ELSE 'Khách thanh toán cho các phiếu sửa chữa đã phát sinh'
    END AS GhiChu,
    2 + ((t.MaXe - 1) MOD 4) AS MaNV,
    TIMESTAMP(DATE('2026-03-25') + INTERVAL (t.MaXe MOD 5) DAY, '16:30:00') AS NgayCapNhat,
    TIMESTAMP(DATE('2026-03-25') + INTERVAL (t.MaXe MOD 5) DAY, '15:30:00') AS NgayTao,
    CASE WHEN t.MaXe MOD 2 = 0 THEN 'ChuyenKhoan' ELSE 'TienMat' END AS PhuongThucThu,
    CASE
        WHEN t.MaXe MOD 10 = 0 THEN 'Huy'
        WHEN t.MaXe MOD 6 = 0 THEN 'ChoXacNhan'
        ELSE 'DaThu'
    END AS TrangThai
FROM (
    SELECT MaXe, SUM(TongTien) AS TongSua
    FROM PHIEU_SUA_CHUA
    GROUP BY MaXe
) t;

UPDATE VAT_TU vt
LEFT JOIN (
    SELECT MaVatTu, SUM(SoLuong) AS TongNhap
    FROM CT_PHIEU_NHAP
    GROUP BY MaVatTu
) n ON n.MaVatTu = vt.MaVatTu
LEFT JOIN (
    SELECT MaVatTu, SUM(SoLuong) AS TongXuat
    FROM CT_PHIEU_SUA_CHUA
    GROUP BY MaVatTu
) x ON x.MaVatTu = vt.MaVatTu
SET vt.SoLuongTon = COALESCE(n.TongNhap, 0) - COALESCE(x.TongXuat, 0);

UPDATE XE x
LEFT JOIN (
    SELECT MaXe, SUM(TongTien) AS TongSua
    FROM PHIEU_SUA_CHUA
    GROUP BY MaXe
) sc ON sc.MaXe = x.MaXe
LEFT JOIN (
    SELECT MaXe, SUM(SoTienThu) AS TongThu
    FROM PHIEU_THU_TIEN
    WHERE TrangThai = 'DaThu'
    GROUP BY MaXe
) tt ON tt.MaXe = x.MaXe
SET x.TienNoHienTai = COALESCE(sc.TongSua, 0) - COALESCE(tt.TongThu, 0);

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

DROP TEMPORARY TABLE IF EXISTS seq_1_300;
