export const buildIntakePayload = (form, vehicleId, customerId) => {
  return {
    MaKH: customerId,
    MaXe: vehicleId,
    NoiDungLoi: form.note || "Khách hàng không ghi chú",
    quickTags: form.conditions || [],
    NgayTiepNhan: new Date().toISOString(),
    note: form.note || null,
  };
};