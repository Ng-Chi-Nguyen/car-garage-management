import { buildIntakePayload } from "./intakePayloadBuilder.js";

const clean = (value) => String(value ?? "").trim();
const isDuplicateVehicleError = (error) => {
  const status = error?.response?.status;
  const message = String(error?.response?.data?.message || error?.message || "").toLowerCase();
  return status === 409 || message.includes("đã tồn tại") || message.includes("duplicate");
};

export async function submitIntakeFlow({
  form,
  selectedQuickTags,
  selectedCustomer,
  selectedVehicle,
  resolveVehicleByPlate,
  createVehicle,
  resolveBrandId,
  createCustomer,
  createIntakeMutation,
  setSelectedCustomer,
  buildPayload = buildIntakePayload,
}) {
  let vehicle = selectedVehicle?.MaXe ? selectedVehicle : null;

  if (!vehicle) {
    try {
      vehicle = await resolveVehicleByPlate(form.licensePlate);
    } catch (error) {
      if (!clean(form.ownerName) || !clean(form.phone)) {
        throw error;
      }
      vehicle = null;
    }
  }

  const customer = selectedCustomer?.id
    ? selectedCustomer
    : await createCustomer.mutateAsync({
        TenChuXe: clean(form.ownerName),
        DienThoai: clean(form.phone),
        DiaChi: clean(form.address),
      });

  const normalizedCustomer = selectedCustomer?.id
    ? selectedCustomer
    : {
        id: customer.MaKH,
        name: customer.TenChuXe,
        phone: customer.DienThoai,
        address: customer.DiaChi,
      };

  if (!selectedCustomer?.id) {
    setSelectedCustomer(normalizedCustomer);
  }

  if (!vehicle?.MaXe) {
    const brandId = Number(resolveBrandId?.(form.brand));
    if (!Number.isInteger(brandId) || brandId <= 0) {
      throw new Error("Không xác định được hãng xe để tạo xe mới.");
    }

    try {
      const createVehicleFn = typeof createVehicle === "function" ? createVehicle : createVehicle?.mutateAsync;
      const createdVehicle = await createVehicleFn({
        BienSo: clean(form.licensePlate),
        MauXe: clean(form.model) || null,
        MaHieuXe: brandId,
        MaKH: Number(normalizedCustomer.id),
      });
      vehicle = createdVehicle;
    } catch (error) {
      if (!isDuplicateVehicleError(error)) {
        throw error;
      }
      vehicle = await resolveVehicleByPlate(form.licensePlate);
    }
  }

  const intakePayload = buildPayload(
    {
      note: form.note,
      quickTags: selectedQuickTags,
      TrangThai: "TiepNhan",
    },
    vehicle.MaXe,
    normalizedCustomer.id,
    null,
  );

  await createIntakeMutation.mutateAsync(intakePayload);
}
