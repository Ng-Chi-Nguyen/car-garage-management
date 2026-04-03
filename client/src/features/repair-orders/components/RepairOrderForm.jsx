import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { SectionCard } from "../../../components/ui/section-card";
import { useCreateRepairOrderMutation } from "../useCreateRepairOrderMutation";
import { fetchVehicles, fetchParts, fetchLaborFees, createRepairOrderDetail, updateRepairOrderDetail, deleteRepairOrderDetail } from "../repairOrders.api";

export function RepairOrderForm() {
  const navigate = useNavigate();
  const { mutateAsync: createRepairOrder, isPending } = useCreateRepairOrderMutation();

  const { data: vehiclesData } = useQuery({
    queryKey: ["vehicles"],
    queryFn: fetchVehicles
  });
  const vehicles = vehiclesData?.data?.vehicles || [];

  const { data: partsData } = useQuery({
    queryKey: ["parts"],
    queryFn: fetchParts
  });
  const parts = partsData?.data?.parts || [];

  const { data: laborFeesData, isError: isLaborFeeError } = useQuery({
    queryKey: ["laborFees"],
    queryFn: fetchLaborFees,
    retry: false
  });
  const laborFees = laborFeesData?.data?.laborFees || [];

  const [header, setHeader] = useState({
    MaXe: "",
    NoiDungLoi: "",
    GhiChu: ""
  });

  const [rows, setRows] = useState([]);

  const addRow = () => {
    setRows([...rows, { id: Date.now(), MaVatTu: "", MaTienCong: "", SoLuong: 1, DonGiaVatTu: 0, DonGiaTienCong: 0, mode: 'new', serverId: null }]);
  };

  const updateRow = (id, field, value) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const newRow = { ...row, [field]: value, mode: row.serverId ? 'editing' : 'new' };
        if (field === 'MaVatTu') {
          const selectedPart = parts.find(p => p.MaVatTu === Number(value));
          if (selectedPart) {
            newRow.DonGiaVatTu = selectedPart.DonGiaBan;
          } else {
            newRow.DonGiaVatTu = 0;
          }
        }
        if (field === 'MaTienCong') {
          const selectedLabor = laborFees.find(l => l.MaTienCong === Number(value));
          if (selectedLabor) {
            newRow.DonGiaTienCong = selectedLabor.TienCong;
          } else if (!isLaborFeeError) {
            newRow.DonGiaTienCong = 0;
          }
        }
        return newRow;
      }
      return row;
    }));
  };

  const saveRow = async (row) => {
    let currentMaPBS = header.MaPBS;

    if (!currentMaPBS) {
      if (!header.MaXe) {
        toast.error("Vui lòng chọn xe trước khi lưu chi tiết");
        return;
      }
      try {
        const payload = {
          repairOrder: {
            MaXe: Number(header.MaXe),
            MaNV: null,
            NgaySC: new Date().toISOString(),
            TrangThai: "TiepNhan",
            NoiDungLoi: header.NoiDungLoi,
            GhiChu: header.GhiChu
          },
          details: []
        };
        const res = await createRepairOrder(payload);
        currentMaPBS = res.data?.repairOrder?.MaPhieuSC || res.data?.MaPhieuSC;
        setHeader(prev => ({ ...prev, MaPBS: currentMaPBS }));
      } catch (error) {
        toast.error("Lỗi khi tạo phiếu tự động: " + (error.response?.data?.message || error.message));
        return;
      }
    }

    try {
      const payload = {
        MaPhieuSC: currentMaPBS,
        MaVatTu: Number(row.MaVatTu),
        MaTienCong: Number(row.MaTienCong),
        SoLuong: Number(row.SoLuong),
        DonGiaVatTu: Number(row.DonGiaVatTu),
        DonGiaTienCong: Number(row.DonGiaTienCong)
      };
      if (row.serverId) {
        await updateRepairOrderDetail(row.serverId, payload);
        toast.success("Cập nhật chi tiết thành công");
        setRows(prevRows => prevRows.map(r => r.id === row.id ? { ...r, mode: 'saved' } : r));
      } else {
        const res = await createRepairOrderDetail(payload);
        toast.success("Thêm chi tiết thành công");
        const serverId = res.data?.repairOrderDetail?.MaCTSC || res.data?.MaCTSC;
        setRows(prevRows => prevRows.map(r => r.id === row.id ? { ...r, mode: 'saved', serverId } : r));
      }
    } catch (error) {
      toast.error("Lỗi khi lưu chi tiết: " + (error.response?.data?.message || error.message));
    }
  };

  const removeRow = async (id) => {
    const row = rows.find(r => r.id === id);
    if (row && row.serverId) {
      try {
        await deleteRepairOrderDetail(row.serverId);
        toast.success("Xóa chi tiết thành công");
      } catch (error) {
        toast.error("Lỗi khi xóa chi tiết: " + (error.response?.data?.message || error.message));
        return;
      }
    }
    setRows(rows.filter(r => r.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!header.MaXe) {
      toast.error("Vui lòng chọn xe");
      return;
    }
    try {
      if (header.MaPBS) {
        const unsavedRows = rows.filter(r => r.mode !== 'saved');
        for (const row of unsavedRows) {
           await saveRow(row);
        }
        toast.success("Hoàn tất phiếu sửa chữa thành công!");
        navigate("/repair-orders");
        return;
      }

      const payload = {
        repairOrder: {
          MaXe: Number(header.MaXe),
          MaNV: null,
          NgaySC: new Date().toISOString(),
          TrangThai: "TiepNhan",
          NoiDungLoi: header.NoiDungLoi,
          GhiChu: header.GhiChu
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
      <SectionCard title="Thông tin chung">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground block">Xe</label>
            <select
              className="w-full border border-border rounded-lg p-2 bg-surface text-foreground"
              value={header.MaXe}
              onChange={(e) => setHeader({ ...header, MaXe: e.target.value })}
              required
            >
              <option value="">Chọn xe</option>
              {vehicles.map(v => (
                <option key={v.MaXe} value={v.MaXe}>{v.BienSo} - {v.TenHieuXe}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground block">Nội dung lỗi</label>
            <input
              type="text"
              className="w-full border border-border rounded-lg p-2 bg-surface text-foreground"
              value={header.NoiDungLoi}
              onChange={(e) => setHeader({ ...header, NoiDungLoi: e.target.value })}
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-medium text-foreground block">Ghi chú</label>
            <input
              type="text"
              className="w-full border border-border rounded-lg p-2 bg-surface text-foreground"
              value={header.GhiChu}
              onChange={(e) => setHeader({ ...header, GhiChu: e.target.value })}
            />
          </div>
        </div>
      </SectionCard>

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
                <th className="px-4 py-3 font-medium rounded-l-lg">Vật tư</th>
                <th className="px-4 py-3 font-medium">Tiền công</th>
                <th className="px-4 py-3 font-medium">Số lượng</th>
                <th className="px-4 py-3 font-medium">Đơn giá VT</th>
                <th className="px-4 py-3 font-medium">Phí TC</th>
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
                      <select
                        className="w-full border border-border rounded p-1.5 bg-surface text-foreground"
                        value={row.MaVatTu}
                        onChange={(e) => updateRow(row.id, 'MaVatTu', e.target.value)}
                        required
                      >
                        <option value="">Chọn vật tư</option>
                        {parts.map(p => (
                          <option key={p.MaVatTu} value={p.MaVatTu}>{p.TenVatTu}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {isLaborFeeError ? (
                        <input
                          type="number"
                          className="w-full border border-border rounded p-1.5 bg-surface text-foreground"
                          value={row.MaTienCong}
                          onChange={(e) => updateRow(row.id, 'MaTienCong', e.target.value)}
                          min="1"
                          step="1"
                          required
                          placeholder="Mã tiền công"
                        />
                      ) : (
                        <select
                          className="w-full border border-border rounded p-1.5 bg-surface text-foreground"
                          value={row.MaTienCong}
                          onChange={(e) => updateRow(row.id, 'MaTienCong', e.target.value)}
                          required
                        >
                          <option value="">Chọn tiền công</option>
                          {laborFees.map(l => (
                            <option key={l.MaTienCong} value={l.MaTienCong}>{l.TenTienCong}</option>
                          ))}
                        </select>
                      )}
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
                        disabled={!!row.MaVatTu}
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
                        disabled={!!row.MaTienCong && !isLaborFeeError}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {amount.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      {(row.mode === 'editing' || (row.mode === 'new' && header.MaPBS)) && (
                        <button
                          type="button"
                          onClick={() => saveRow(row)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Lưu
                        </button>
                      )}
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
