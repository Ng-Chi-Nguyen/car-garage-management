-- AlterTable
ALTER TABLE `PHIEU_SUA_CHUA`
    MODIFY `TrangThai` ENUM('TiepNhan', 'DangSua', 'HoanTat', 'Huy') NOT NULL DEFAULT 'TiepNhan',
    ADD COLUMN `NgayKetThuc` DATETIME(3) NULL;
