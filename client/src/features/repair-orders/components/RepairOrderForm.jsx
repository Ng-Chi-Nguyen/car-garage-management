import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SectionCard } from "../../../components/ui/section-card";
import { useCreateRepairOrderMutation } from "../useCreateRepairOrderMutation";

export function RepairOrderForm() {
  const navigate = useNavigate();
  const { mutateAsync: createRepairOrder, isPending } = useCreateRepairOrderMutation();

  const [rows, setRows] = useState([
    { id: 1, MaVatTu: 1, MaTienCong: 1, SoLuong: 1, DonGiaVatTu: 250000, DonGiaTienCong: 50000 },
    { id: 2, MaVatTu: 2, MaTienCong: 2, SoLuong: 4, DonGiaVatTu: 120000, DonGiaTienCong: 0 }
  ]);

  const addRow = () => {
    setRows([...rows, { id: Date.now(), MaVatTu: "", MaTienCong: "", SoLuong: 1, DonGiaVatTu: 0, DonGiaTienCong: 0 }]);
  };

  const updateRow = (id, field, value) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const removeRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        repairOrder: {
          MaXe: 1, // Hardcoded for demo
          MaNV: null,
          NgaySC: new Date().toISOString(),
          TrangThai: "TiepNhan",
          NoiDungLoi: "Khám định kỳ",
          GhiChu: "Demo"
        },
        details: rows.map(row => ({
          MaVatTu: Number(row.MaVatTu),
          MaTienCong: Number(row.MaTienCong),
          SoLuong: Number(row.SoLuong),
          DonGiaVatTu: Number(row.DonGiaVatTu),
          DonGiaTienCong: Number(row.DonGiaTienCong)
        }))
      };
      
      await createRepairOrder(payload);
      toast.success("Hoàn tất phiếu sửa chữa thành công!");
      navigate("/repair-orders");
    } catch (error) {
      toast.error("Lỗi khi tạo phiếu: " + (error.response?.data?.message || error.message));
    }
  };

  const totalAmount = rows.reduce((sum, row) => sum + (Number(row.SoLuong) * Number(row.DonGiaVatTu)) + Number(row.DonGiaTienCong), 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SectionCard title="Chi tiết vật tư & phụ tùng">
        <div className="flex justify-end mb-4 -mt-10">
          <button
            type="button"
            onClick={addRow}
            className="text-sm bg-secondary/10 text-secondary px-3 py-1.5 rounded-lg font-medium hover:bg-secondary/20"
          >
            + Thêm dòng mới
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium rounded-l-lg">Mã vật tư</th>
                <th className="px-4 py-3 font-medium">Mã tiền công</th>
                <th className="px-4 py-3 font-medium">Số lượng</th>
                <th className="px-4 py-3 font-medium">Đơn giá VT</th>
                <th className="px-4 py-3 font-medium">Tiền công</th>
                <th className="px-4 py-3 font-medium">Thành tiền</th>
                <th className="px-4 py-3 font-medium rounded-r-lg">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map(row => {
                const amount = (Number(row.SoLuong) * Number(row.DonGiaVatTu)) + Number(row.DonGiaTienCong);
                return (
                  <tr key={row.id}>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        className="w-full border border-border rounded p-1.5 bg-surface text-foreground"
                        value={row.MaVatTu}
                        onChange={(e) => updateRow(row.id, 'MaVatTu', e.target.value)}
                        required
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        className="w-full border border-border rounded p-1.5 bg-surface text-foreground"
                        value={row.MaTienCong}
                        onChange={(e) => updateRow(row.id, 'MaTienCong', e.target.value)}
                        required
                      />
                    </td>
                    <td className="px-4 py-3 w-24">
                      <input
                        type="number"
                        className="w-full border border-border rounded p-1.5 bg-surface text-foreground"
                        value={row.SoLuong}
                        onChange={(e) => updateRow(row.id, 'SoLuong', e.target.value)}
                        min="1"
                        required
                      />
                    </td>
                    <td className="px-4 py-3 w-32">
                      <input
                        type="number"
                        className="w-full border border-border rounded p-1.5 bg-surface text-foreground"
                        value={row.DonGiaVatTu}
                        onChange={(e) => updateRow(row.id, 'DonGiaVatTu', e.target.value)}
                        min="0"
                        required
                      />
                    </td>
                    <td className="px-4 py-3 w-32">
                      <input
                        type="number"
                        className="w-full border border-border rounded p-1.5 bg-surface text-foreground"
                        value={row.DonGiaTienCong}
                        onChange={(e) => updateRow(row.id, 'DonGiaTienCong', e.target.value)}
                        min="0"
                        required
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {amount.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-muted font-semibold">
                <td
                  colSpan="5"
                  className="px-4 py-3 text-right text-muted-foreground rounded-l-lg"
                >
                  Tổng cộng:
                </td>
                <td colSpan="2" className="px-4 py-3 text-primary rounded-r-lg">
                  {totalAmount.toLocaleString('vi-VN')} ₫
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </SectionCard>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate('/repair-orders')}
          className="px-5 py-2.5 rounded-xl border border-border text-muted-foreground font-medium hover:bg-muted"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isPending || rows.length === 0}
          className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Đang lưu..." : "Hoàn tất phiếu sửa chữa"}
        </button>
      </div>
    </form>
  );
}
