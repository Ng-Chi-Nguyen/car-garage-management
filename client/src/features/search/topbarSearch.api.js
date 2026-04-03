import axiosClient from '../../lib/axiosClient.js';

const RESULT_LIMIT_PER_ENTITY = 5;

const normalizeCustomerResult = (customer) => ({
  id: `customer-${customer.MaKH}`,
  type: 'customer',
  title: customer.TenChuXe || `Khách hàng #${customer.MaKH}`,
  subtitle: customer.DienThoai || customer.Email || '',
  link: `/customers/detail?id=${customer.MaKH}`,
});

const normalizeVehicleResult = (vehicle) => ({
  id: `vehicle-${vehicle.MaXe}`,
  type: 'vehicle',
  title: vehicle.BienSo || `Xe #${vehicle.MaXe}`,
  subtitle: vehicle.KhachHang?.TenChuXe || vehicle.HieuXe?.TenHieuXe || '',
  link: vehicle.KhachHang?.MaKH
    ? `/customers/detail?id=${vehicle.KhachHang.MaKH}`
    : '/intake',
});

const normalizeRepairOrderResult = (repairOrder) => ({
  id: `repair-order-${repairOrder.MaPhieuSC}`,
  type: 'repair-order',
  title: `Lệnh sửa #${repairOrder.MaPhieuSC}`,
  subtitle: repairOrder.NoiDungLoi || repairOrder.TrangThai || '',
  link: `/repair-orders/${repairOrder.MaPhieuSC}`,
});

const normalizePartResult = (part) => ({
  id: `part-${part.MaVatTu}`,
  type: 'part',
  title: part.TenVatTu || `Vật tư #${part.MaVatTu}`,
  subtitle: part.DonViTinh || '',
  link: `/inventory/stock-card?id=${part.MaVatTu}`,
});

export async function searchTopbarEntities(searchTerm) {
  const normalizedTerm = String(searchTerm || '').trim();

  if (normalizedTerm.length < 2) {
    return [];
  }

  const params = {
    page: 1,
    limit: RESULT_LIMIT_PER_ENTITY,
    search: normalizedTerm,
  };

  const [customersResponse, vehiclesResponse, repairOrdersResponse, partsResponse] = await Promise.all([
    axiosClient.get('/api/v1/customers', { params }),
    axiosClient.get('/api/v1/vehicles', { params }),
    axiosClient.get('/api/v1/repair-orders', { params }),
    axiosClient.get('/api/v1/parts', { params }),
  ]);

  const customers = customersResponse.data?.data?.customers || [];
  const vehicles = vehiclesResponse.data?.data?.vehicles || [];
  const repairOrders = repairOrdersResponse.data?.data?.repairOrders || [];
  const parts = partsResponse.data?.data?.parts || [];

  return [
    ...customers.map(normalizeCustomerResult),
    ...vehicles.map(normalizeVehicleResult),
    ...repairOrders.map(normalizeRepairOrderResult),
    ...parts.map(normalizePartResult),
  ];
}
