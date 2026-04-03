import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRepairOrderQuery } from '../useRepairOrderQuery';
import { useRepairOrderDetailsQuery } from '../useRepairOrderDetailsQuery';
import { useUpdateRepairOrderMutation } from '../useUpdateRepairOrderMutation';
import {
  useCreateRepairOrderDetailMutation,
  useUpdateRepairOrderDetailMutation,
  useDeleteRepairOrderDetailMutation
} from '../useRepairOrderDetailMutations';
import { useAdminUsersQuery } from '../../adminUsers/useAdminUsersQuery';
import { fetchParts, fetchLaborFees } from '../repairOrders.api';
import { StateShell } from '../../../components/ui/state-shell';
import { SectionCard } from '../../../components/ui/section-card';
import { DataTable } from '../../../components/ui/data-table';
import { StatusBadge } from '../../../components/ui/status-badge';

export function RepairOrderDetail({ id }) {
  const { data: orderResponse, isLoading: isLoadingOrder, error: orderError } = useRepairOrderQuery(id);
  const { data: detailsResponse, isLoading: isLoadingDetails, error: detailsError } = useRepairOrderDetailsQuery(id);
  const { data: usersResponse, isLoading: isLoadingUsers } = useAdminUsersQuery({ role: 'NhanVien', limit: 100 });

  const [parts, setParts] = useState([]);
  const [laborFees, setLaborFees] = useState([]);
  
  useEffect(() => {
    fetchParts().then(res => setParts(res.data?.parts || []));
    fetchLaborFees().then(res => setLaborFees(res.data?.laborFees || []));
  }, []);

  const updateOrderMutation = useUpdateRepairOrderMutation();
  const createDetailMutation = useCreateRepairOrderDetailMutation(id);
  const updateDetailMutation = useUpdateRepairOrderDetailMutation(id);
  const deleteDetailMutation = useDeleteRepairOrderDetailMutation(id);

  const order = orderResponse?.data?.repairOrder || null;
  const details = order?.ChiTietSuaChua || detailsResponse?.data?.repairOrderDetails || [];
  const employees = usersResponse?.users || [];
  const assignedEmployee = employees.find((emp) => Number(emp.MaKH) === Number(order?.MaNV));

  const [editOrderData, setEditOrderData] = useState({});
  const [isEditingOrder, setIsEditingOrder] = useState(false);

  useEffect(() => {
    if (order) {
      setEditOrderData({
        MaNV: order.MaNV || '',
        TrangThai: order.TrangThai || 'TiepNhan',
        NoiDungLoi: order.NoiDungLoi || '',
        GhiChu: order.GhiChu || ''
      });
    }
  }, [order]);

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      await updateOrderMutation.mutateAsync({
        id,
        payload: {
          MaNV: editOrderData.MaNV ? Number(editOrderData.MaNV) : null,
          TrangThai: editOrderData.TrangThai,
          NoiDungLoi: editOrderData.NoiDungLoi,
          GhiChu: editOrderData.GhiChu
        }
      });
      toast.success("Cập nhật phiếu sửa chữa thành công");
      setIsEditingOrder(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi cập nhật phiếu");
    }
  };

  const [newDetail, setNewDetail] = useState({
    MaVatTu: '',
    MaTienCong: '',
    SoLuong: 1,
    DonGiaVatTu: 0,
    DonGiaTienCong: 0
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddDetail = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        MaVatTu: Number(newDetail.MaVatTu),
        MaTienCong: Number(newDetail.MaTienCong),
        SoLuong: Number(newDetail.SoLuong)
      };

      payload.DonGiaVatTu = Number(newDetail.DonGiaVatTu);
      payload.DonGiaTienCong = Number(newDetail.DonGiaTienCong);

      await createDetailMutation.mutateAsync(payload);
      toast.success("Thêm chi tiết thành công");
      setNewDetail({
        MaVatTu: '',
        MaTienCong: '',
        SoLuong: 1,
        DonGiaVatTu: 0,
        DonGiaTienCong: 0
      });
      setIsAddModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi thêm chi tiết");
    }
  };

  const [editingRowId, setEditingRowId] = useState(null);
  const [editingRowData, setEditingRowData] = useState({});

  const startEditRow = (row) => {
    setEditingRowId(row.MaCTSC);
    setEditingRowData({
      SoLuong: row.SoLuong,
      DonGiaVatTu: row.DonGiaVatTu || row.VatTu?.DonGia || 0,
      DonGiaTienCong: row.DonGiaTienCong || row.TienCong?.DonGia || 0
    });
  };

  const saveEditRow = async (row) => {
    try {
      const payload = {
        SoLuong: Number(editingRowData.SoLuong),
      };
      if (row.MaVatTu) {
         payload.MaVatTu = row.MaVatTu;
         payload.DonGiaVatTu = Number(editingRowData.DonGiaVatTu);
      } else {
         payload.MaTienCong = row.MaTienCong;
         payload.DonGiaTienCong = Number(editingRowData.DonGiaTienCong);
      }
      
      await updateDetailMutation.mutateAsync({
        detailId: row.MaCTSC,
        payload
      });
      toast.success("Cập nhật chi tiết thành công");
      setEditingRowId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi cập nhật chi tiết");
    }
  };

  const handleDeleteDetail = async (detailId) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    try {
      await deleteDetailMutation.mutateAsync(detailId);
      toast.success("Xóa chi tiết thành công");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi xóa chi tiết");
    }
  };

  const resolvePartName = (row) => {
    if (!row?.MaVatTu) return '-';
    return row.VatTu?.TenVatTu || parts.find((p) => Number(p.MaVatTu) === Number(row.MaVatTu))?.TenVatTu || '-';
  };

  const resolveLaborName = (row) => {
    if (!row?.MaTienCong) return '-';
    return row.TienCong?.NoiDung || laborFees.find((t) => Number(t.MaTienCong) === Number(row.MaTienCong))?.NoiDung || '-';
  };

  const columns = [
    { header: "Loại", cell: (row) => row.MaVatTu ? 'Vật tư' : 'Nhân công' },
    { header: "Tên", cell: (row) => row.MaVatTu ? resolvePartName(row) : resolveLaborName(row) },
    { header: "Số lượng", cell: (row) => (
      editingRowId === row.MaCTSC ? 
        <input type="number" min="1" className="border rounded p-1 w-16" value={editingRowData.SoLuong} onChange={e => setEditingRowData({...editingRowData, SoLuong: e.target.value})} />
      : row.SoLuong
    )},
    { header: "Đơn giá", cell: (row) => {
       if (editingRowId === row.MaCTSC) {
          if (row.MaVatTu) {
             return <input type="number" className="border rounded p-1 w-24" value={editingRowData.DonGiaVatTu} onChange={e => setEditingRowData({...editingRowData, DonGiaVatTu: e.target.value})} />;
          } else {
             return <input type="number" className="border rounded p-1 w-24" value={editingRowData.DonGiaTienCong} onChange={e => setEditingRowData({...editingRowData, DonGiaTienCong: e.target.value})} />;
          }
       }
       return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(row.DonGiaVatTu || row.DonGiaTienCong || row.DonGia || 0);
    }},
    { header: "Thành tiền", cell: (row) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(row.ThanhTien || 0) },
    { header: "Thao tác", cell: (row) => (
      <div className="space-x-2">
        {editingRowId === row.MaCTSC ? (
           <>
             <button onClick={() => saveEditRow(row)} className="text-green-600 hover:text-green-800 text-sm font-medium">Lưu</button>
             <button onClick={() => setEditingRowId(null)} className="text-gray-600 hover:text-gray-800 text-sm font-medium">Hủy</button>
           </>
        ) : (
           <>
             <button onClick={() => startEditRow(row)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Sửa</button>
             <button onClick={() => handleDeleteDetail(row.MaCTSC)} className="text-red-600 hover:text-red-800 text-sm font-medium">Xóa</button>
           </>
        )}
      </div>
    )}
  ];

  return (
    <StateShell
      isLoading={isLoadingOrder || isLoadingDetails || isLoadingUsers}
      isError={!!(orderError || detailsError)}
      error={orderError || detailsError}
      isEmpty={!order && !isLoadingOrder}
      emptyMessage="Không tìm thấy phiếu sửa chữa."
    >
      <div className="space-y-6">
        <SectionCard title="Thông tin chung">
          {order && (
            <div className="mb-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Phiếu SC: {order.MaPhieuSC} - Mã xe: {order.MaXe}</h3>
              {!isEditingOrder && (
                <button onClick={() => setIsEditingOrder(true)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium">
                  Chỉnh sửa
                </button>
              )}
            </div>
          )}
          {order && isEditingOrder ? (
            <form onSubmit={handleUpdateOrder} className="bg-slate-50 p-4 rounded-md space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Nhân viên phụ trách</label>
                  <select 
                    className="w-full border rounded p-2"
                    value={editOrderData.MaNV || ''} 
                    onChange={e => setEditOrderData({...editOrderData, MaNV: e.target.value})}
                  >
                    <option value="">-- Trống --</option>
                    {employees.map(emp => (
                      <option key={emp.MaKH} value={emp.MaKH}>{emp.TenChuXe} (#{emp.MaKH})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Trạng thái</label>
                  <select 
                    className="w-full border rounded p-2"
                    value={editOrderData.TrangThai} 
                    onChange={e => setEditOrderData({...editOrderData, TrangThai: e.target.value})}
                  >
                    <option value="TiepNhan">Tiếp nhận</option>
                    <option value="DangSua">Đang sửa</option>
                    <option value="HoanTat">Hoàn tất</option>
                    <option value="Huy">Hủy</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-500 mb-1">Nội dung lỗi</label>
                  <input 
                    type="text" 
                    className="w-full border rounded p-2"
                    value={editOrderData.NoiDungLoi} 
                    onChange={e => setEditOrderData({...editOrderData, NoiDungLoi: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm text-slate-500 mb-1">Ghi chú</label>
                  <input 
                    type="text" 
                    className="w-full border rounded p-2"
                    value={editOrderData.GhiChu} 
                    onChange={e => setEditOrderData({...editOrderData, GhiChu: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex space-x-2 pt-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                  Lưu thay đổi
                </button>
                <button type="button" onClick={() => setIsEditingOrder(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 font-medium">
                  Hủy
                </button>
              </div>
            </form>
          ) : order && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Trạng thái</p>
                <div className="mt-1">
                  <StatusBadge status={order.TrangThai} />
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500">Nhân viên phụ trách</p>
                <p className="font-medium">{assignedEmployee ? `${assignedEmployee.TenChuXe} (#${assignedEmployee.MaKH})` : 'Chưa phân công'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Nội dung lỗi</p>
                <p className="font-medium">{order.NoiDungLoi || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Tổng tiền</p>
                <p className="font-medium text-blue-600">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.TongTien || 0)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-slate-500">Ghi chú</p>
                <p className="font-medium">{order.GhiChu || '-'}</p>
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Chi tiết công việc và vật tư">
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="h-9 w-9 rounded-full bg-blue-600 text-white text-xl leading-none hover:bg-blue-700"
              aria-label="Thêm chi tiết mới"
              title="Thêm chi tiết mới"
            >
              +
            </button>
          </div>
          <DataTable columns={columns} data={details} />

          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
              <div className="w-full max-w-4xl rounded-xl bg-white p-5 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-lg font-semibold">Thêm chi tiết mới</h4>
                  <button
                    type="button"
                    className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Đóng
                  </button>
                </div>

                <form onSubmit={handleAddDetail} className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[220px]">
                <label className="block text-xs text-slate-500 mb-1">Vật tư</label>
                <select 
                  required 
                  className="border rounded p-2 w-full text-sm"
                  value={newDetail.MaVatTu}
                  onChange={e => {
                    const vt = parts.find(p => p.MaVatTu === Number(e.target.value));
                    setNewDetail({
                      ...newDetail,
                      MaVatTu: e.target.value,
                      DonGiaVatTu: vt?.DonGiaBan ?? vt?.DonGia ?? 0
                    });
                  }}
                >
                  <option value="">-- Chọn vật tư --</option>
                  {parts.map(p => <option key={p.MaVatTu} value={p.MaVatTu}>{p.TenVatTu}</option>)}
                </select>
              </div>

              <div className="flex-1 min-w-[220px]">
                <label className="block text-xs text-slate-500 mb-1">Nhân công</label>
                <select 
                  required 
                  className="border rounded p-2 w-full text-sm"
                  value={newDetail.MaTienCong}
                  onChange={e => {
                    const tc = laborFees.find(t => t.MaTienCong === Number(e.target.value));
                    setNewDetail({...newDetail, MaTienCong: e.target.value, DonGiaTienCong: tc?.DonGia || 0});
                  }}
                >
                  <option value="">-- Chọn nhân công --</option>
                  {laborFees.map(t => <option key={t.MaTienCong} value={t.MaTienCong}>{t.NoiDung}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Số lượng</label>
                <input 
                  type="number" required min="1"
                  className="border rounded p-2 w-20 text-sm"
                  value={newDetail.SoLuong}
                  onChange={e => setNewDetail({...newDetail, SoLuong: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Đơn giá</label>
                <div className="h-[38px] rounded border bg-slate-50 px-3 py-2 text-sm text-slate-700 min-w-[140px]">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    (Number(newDetail.DonGiaVatTu) || 0) + (Number(newDetail.DonGiaTienCong) || 0)
                  )}
                </div>
              </div>

              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium h-[38px]">
                Thêm
              </button>
                </form>
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </StateShell>
  );
}
