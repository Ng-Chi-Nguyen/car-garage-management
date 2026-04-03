const cleanText = (value) => String(value ?? "").trim();

const cleanQuickTags = (value) =>
  (Array.isArray(value) ? value : [])
    .map((item) => cleanText(item))
    .filter(Boolean);

export const buildIntakePayload = (form, vehicleId, customerId, employeeId = null) => {
  const quickTags = cleanQuickTags(form?.quickTags ?? form?.conditions);
  const note = cleanText(form?.note);

  return {
    MaKH: Number(customerId),
    MaXe: Number(vehicleId),
    MaNV: employeeId === null || employeeId === undefined ? null : Number(employeeId),
    NgayTiepNhan: new Date(Date.now()).toISOString(),
    TrangThai: form?.TrangThai ?? "TiepNhan",
    NoiDungLoi: note || quickTags.join(", ") || "Khách hàng không ghi chú",
    quickTags,
    note: note || null,
  };
};
