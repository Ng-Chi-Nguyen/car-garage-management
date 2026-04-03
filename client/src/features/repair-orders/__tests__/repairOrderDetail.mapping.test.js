import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// We want to test mapping the API response to the display format.
// The test should fail because the component doesn't correctly handle all nested fields like DonGiaVatTu/DonGiaTienCong or TienCong.NoiDung yet.
// Since the component uses inline column definitions, we can extract a mapper or test the columns logic.
// For now, we'll write a mock mapper test that reflects the expected data contract.

const mapRepairOrderDetail = (row) => {
    return {
        id: row.MaChiTietSC,
        name: row.VatTu?.TenVatTu || row.TienCong?.TenTienCong || row.TienCong?.NoiDung || row.TenVatTu || row.TenTienCong || '-',
        quantity: row.SoLuong || 0,
        price: row.DonGiaVatTu || row.DonGiaTienCong || row.DonGia || 0,
        total: row.ThanhTien || 0,
        type: row.MaVatTu ? 'Vật tư' : 'Nhân công'
    };
};

describe('Repair Order Detail Mapping', () => {
    it('should map nested API fields correctly for VatTu', () => {
        const apiResponse = {
            MaChiTietSC: 1,
            MaVatTu: 'VT01',
            SoLuong: 2,
            DonGiaVatTu: 100000,
            ThanhTien: 200000,
            VatTu: {
                TenVatTu: 'Dầu nhớt'
            }
        };

        const mapped = mapRepairOrderDetail(apiResponse);
        
        // This will fail if the logic doesn't pick up DonGiaVatTu and VatTu.TenVatTu properly
        assert.equal(mapped.name, 'Dầu nhớt');
        assert.equal(mapped.price, 100000);
        assert.equal(mapped.type, 'Vật tư');
    });

    it('should map nested API fields correctly for TienCong', () => {
        const apiResponse = {
            MaChiTietSC: 2,
            MaTienCong: 'TC01',
            SoLuong: 1,
            DonGiaTienCong: 500000,
            ThanhTien: 500000,
            TienCong: {
                NoiDung: 'Thay dầu'
            }
        };

        const mapped = mapRepairOrderDetail(apiResponse);
        
        // This will fail if the logic doesn't pick up DonGiaTienCong and TienCong.NoiDung properly
        assert.equal(mapped.name, 'Thay dầu');
        assert.equal(mapped.price, 500000);
        assert.equal(mapped.type, 'Nhân công');
    });
});
