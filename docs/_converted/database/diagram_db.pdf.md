# Source
docs/database/diagram_db.pdf

# Conversion method
pdftotext

_prisma_migrations
id VARCHAR(36)

nha_cung_cap

phieu_nhap_k…

checksum VARCHAR(64)

MaPhieuNhap INT

MaNCC INT

finished_at DATETIME(3)

MaNCC INT

TenNCC VARCHAR(100)

migration_name VARCHAR(255)

NgayNhap DATE

DienThoai VARCHAR(20)

logs TEXT

TongTien DECIMAL(15,2)

DiaChi VARCHAR(255)

rolled_back_at DATETIME(3)

Indexes

Indexes

tien_cong
MaTienCong INT
NoiDung VARCHAR(25…
DonGia DECIMAL(15,2)
Indexes

started_at DATETIME(3)
applied_steps_count INT
Indexes

ct_phieu_sua_chua
ct_phieu_nhap

vat_tu

MaCTSC INT

MaCTPN INT

MaVatTu INT

MaPhieuSC INT

MaPhieuNhap INT

TenVatTu VARCHAR(255)

MaVatTu INT

MaVatTu INT

DonViTinh VARCHAR(50)

MaTienCong INT

SoLuong INT

SoLuongTon INT

SoLuong INT

DonGiaNhap DECIMAL(15,…

GiaVon DECIMAL(15,2)

DonGiaVatTu DECIMAL(15,2)

ThanhTien DECIMAL(15,2)

DonGiaBan DECIMAL(15,…

DonGiaTienCong DECIMAL(15,…

Indexes

Indexes

ThanhTien DECIMAL(15,2)
Indexes

khach_hang
xe

MaKH INT

phieu_sua_ch…

TenChuXe VARCHAR(10…

MaXe INT

MaPhieuSC INT

DienThoai VARCHAR(20)

BienSo VARCHAR(20)

MaXe INT

DiaChi VARCHAR(255)

MaHieuXe INT

NgaySC DATE

MaKH INT

TrangThai VARCHAR(50)

Indexes

TienNoHienTai DECIMAL(15,…
Indexes

TongTien DECIMAL(15,2)
Indexes

phieu_thu_tien
hieu_xe

MaPhieuThu INT

MaHieuXe INT

MaXe INT

TenHieuXe VARCHAR(10…

NgayThu DATE

Indexes

SoTienThu DECIMAL(15,…
GhiChu VARCHAR(255)
Indexes

