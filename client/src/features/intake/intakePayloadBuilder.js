const cleanText = (value) => String(value ?? "").trim();

const cleanQuickTags = (value) =>
  (Array.isArray(value) ? value : [])
    .map((item) => cleanText(item))
    .filter(Boolean);

export const buildIntakePayload = (form, vehicleId, customerId, employeeId = null, extras = null) => {
  const quickTags = cleanQuickTags(form?.quickTags ?? form?.conditions);
  const note = cleanText(form?.note);
  const payload = {
    MaKH: customerId === null || customerId === undefined ? null : Number(customerId),
    MaXe: vehicleId === null || vehicleId === undefined ? null : Number(vehicleId),
    MaNV: employeeId === null || employeeId === undefined ? null : Number(employeeId),
    NgayTiepNhan: new Date(Date.now()).toISOString(),
    TrangThai: form?.TrangThai ?? "TiepNhan",
    NoiDungLoi: note || "Khách hàng không mô tả lỗi",
    quickTags,
    note: note || null,
  };

  if (extras && typeof extras === "object") {
    if (extras.BienSo !== undefined) {
      payload.BienSo = cleanText(extras.BienSo);
    }
    if (extras.customer !== undefined) {
      payload.customer = extras.customer;
    }
    if (extras.vehicle !== undefined) {
      payload.vehicle = extras.vehicle;
    }
  }

  return payload;
};
