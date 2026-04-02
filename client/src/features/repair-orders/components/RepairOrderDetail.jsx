import React from 'react';
import { useRepairOrderQuery } from '../useRepairOrderQuery';
import { useRepairOrderDetailsQuery } from '../useRepairOrderDetailsQuery';
import { StateShell } from '../../../components/ui/state-shell';
import { SectionCard } from '../../../components/ui/section-card';
import { DataTable } from '../../../components/ui/data-table';

export function RepairOrderDetail({ id }) {
  const { data: orderResponse, isLoading: isLoadingOrder, error: orderError } = useRepairOrderQuery(id);
  const { data: detailsResponse, isLoading: isLoadingDetails, error: detailsError } = useRepairOrderDetailsQuery(id);

  const order = orderResponse?.data;
  const details = detailsResponse?.data?.data?.repairOrderDetails || detailsResponse?.data?.repairOrderDetails || [];

  const columns = [
    { header: "Nội dung", accessor: "NoiDung" },
    { header: "Loại", cell: (row) => row.MaVatTu ? 'Vật tư' : 'Nhân công' },
     { header: "Tên Vật Tư/Tiền công", cell: (row) => row.VatTu?.TenVatTu || row.TienCong?.TenTienCong || row.TenVatTu || row.TenTienCong || '-' },
    { header: "Số lượng", accessor: "SoLuong" },
    { header: "Đơn giá", cell: (row) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(row.DonGia || 0) },
    { header: "Thành tiền", cell: (row) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(row.ThanhTien || 0) }
  ];

  return (
    <StateShell
      isLoading={isLoadingOrder || isLoadingDetails}
      isError={!!(orderError || detailsError)}
      error={orderError || detailsError}
      isEmpty={!order && !isLoadingOrder}
      emptyMessage="Không tìm thấy phiếu sửa chữa."
    >
      <div className="space-y-6">
        <SectionCard title="Thông tin chung">
          {order && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Mã phiếu</p>
                <p className="font-medium">{order.MaPhieuSC}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Mã xe</p>
                <p className="font-medium">{order.MaXe}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Ngày sửa chữa</p>
                <p className="font-medium">
                  {order.NgaySC ? new Date(order.NgaySC).toLocaleDateString("vi-VN") : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Tổng tiền</p>
                <p className="font-medium">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.TongTien || 0)}
                </p>
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Chi tiết công việc và vật tư">
          <DataTable columns={columns} data={details} />
        </SectionCard>
      </div>
    </StateShell>
  );
}
