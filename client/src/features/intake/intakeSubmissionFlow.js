import { buildIntakePayload } from "./intakePayloadBuilder.js";

const clean = (value) => String(value ?? "").trim();

export async function submitIntakeFlow({
  form,
  selectedQuickTags,
  selectedCustomer,
  resolveVehicleByPlate,
  createCustomer,
  createIntakeMutation,
  setSelectedCustomer,
  buildPayload = buildIntakePayload,
}) {
  let vehicle;
  try {
    vehicle = await resolveVehicleByPlate(form.licensePlate);
  } catch (error) {
    if (!clean(form.ownerName) || !clean(form.phone)) {
      throw error;
    }
    vehicle = { MaXe: null };
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
