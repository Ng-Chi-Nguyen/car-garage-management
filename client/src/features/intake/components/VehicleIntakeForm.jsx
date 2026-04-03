import { useMemo, useState } from "react";
import { useCarBrandsQuery } from "../../settings/useSettingsQuery.js";
import { useCustomersMutations } from "../../customers/useCustomersMutations.js";
import { useCustomersQuery } from "../../customers/useCustomersQuery.js";
import { resolveVehicleByPlate } from "../intakeVehicleResolver.api.js";
import { useCreateIntakeMutation } from "../useIntakeMutation.js";
import { submitIntakeFlow } from "../intakeSubmissionFlow.js";
import { useVehicleCatalogQuery } from "../useVehicleCatalogQuery.js";

const initialForm = {
  phone: "",
  ownerName: "",
  address: "",
  licensePlate: "",
  brand: "",
  model: "",
  note: "",
};

const quickTagOptions = ["Xước nhẹ", "Móp méo", "Hỏng đèn", "Nứt kính", "Bẩn nội thất"];

function Field({ label, required, children }) {
  return (
    <label className="space-y-2">
      <div className="text-sm font-semibold text-slate-700">
        {label}
        {required ? <span className="text-rose-600"> *</span> : null}
      </div>
      {children}
    </label>
  );
}

export function VehicleIntakeForm({ onSuccess, onCancel, variant = "page" }) {
  const [form, setForm] = useState(initialForm);
  const [selectedQuickTags, setSelectedQuickTags] = useState(["Xước nhẹ"]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const createIntakeMutation = useCreateIntakeMutation();
  const { createCustomer } = useCustomersMutations();
  const cleanSearch = customerSearch?.trim() || "";
  const { data: customersResult } = useCustomersQuery(
    { search: cleanSearch, limit: 5 },
    { enabled: Boolean(cleanSearch) },
  );
  const { data: carBrands } = useCarBrandsQuery();
  const { data: vehicleCatalog } = useVehicleCatalogQuery();

  const brandOptions = useMemo(() => {
    const backendBrands = Array.isArray(carBrands) ? carBrands.map((brand) => brand.name).filter(Boolean) : [];
    return backendBrands.length ? backendBrands : Object.keys(vehicleCatalog ?? {});
  }, [carBrands, vehicleCatalog]);

  const modelOptions = useMemo(() => {
    const models = vehicleCatalog?.[form.brand] ?? [];
    return Array.isArray(models) ? models : [];
  }, [form.brand, vehicleCatalog]);

  const customerResults = customersResult?.data ?? [];

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    if (["phone", "ownerName", "address"].includes(field)) {
      setSelectedCustomer(null);
    }
  };

  const handleQuickTagToggle = (tag) => {
    setSelectedQuickTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setForm((current) => ({
      ...current,
      phone: customer.phone ?? current.phone,
      ownerName: customer.name ?? current.ownerName,
      address: customer.address ?? current.address,
    }));
    setCustomerSearch(customer.phone ?? customer.name ?? "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      await submitIntakeFlow({
        form,
        selectedQuickTags,
        selectedCustomer,
        resolveVehicleByPlate,
        createCustomer,
        createIntakeMutation,
        setSelectedCustomer,
      });
      onSuccess?.();
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || error?.message || "Không thể tiếp nhận xe.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 lg:p-8">
      <section className="grid gap-4 md:grid-cols-2">
        <Field label="Tra cứu khách hàng">
          <input
            value={customerSearch}
            onChange={(event) => setCustomerSearch(event.target.value)}
            placeholder="Nhập số điện thoại hoặc tên"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
          />
        </Field>
        <Field label="Biển số xe" required>
          <input
            value={form.licensePlate}
            onChange={handleChange("licensePlate")}
            placeholder="51G-123.45"
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
          />
        </Field>
        <Field label="Họ và tên" required>
          <input
            value={form.ownerName}
            onChange={handleChange("ownerName")}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
          />
        </Field>
        <Field label="Số điện thoại" required>
          <input
            value={form.phone}
            onChange={handleChange("phone")}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
          />
        </Field>
        <Field label="Địa chỉ">
          <input
            value={form.address}
            onChange={handleChange("address")}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
          />
        </Field>
        <Field label="Hãng xe">
          <select
            value={form.brand}
            onChange={(event) => {
              const brand = event.target.value;
              setForm((current) => ({ ...current, brand, model: vehicleCatalog?.[brand]?.[0] ?? "" }));
            }}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
          >
            <option value="">Chọn hãng xe</option>
            {brandOptions.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Model / Dòng xe">
          <select
            value={form.model}
            onChange={handleChange("model")}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
          >
            <option value="">Chọn model</option>
            {modelOptions.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </Field>
      </section>

      <section className="space-y-3">
        <div className="text-sm font-semibold text-slate-700">Ghi chú nhanh</div>
        <div className="flex flex-wrap gap-2">
          {quickTagOptions.map((tag) => (
            <button key={tag} type="button" onClick={() => handleQuickTagToggle(tag)} className="rounded-full border px-3 py-2 text-sm">
              {selectedQuickTags.includes(tag) ? "☑" : "☐"} {tag}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <Field label="Ghi chú thêm">
          <textarea
            rows={4}
            value={form.note}
            onChange={handleChange("note")}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
          />
        </Field>
      </section>

      {customerResults.length > 0 ? (
        <section className="space-y-2">
          <div className="text-sm font-semibold text-slate-700">Khách hàng gợi ý</div>
          <div className="grid gap-2 md:grid-cols-2">
            {customerResults.map((customer) => (
              <button
                key={customer.id}
                type="button"
                onClick={() => handleSelectCustomer(customer)}
                className="rounded-2xl border border-slate-200 p-3 text-left"
              >
                <div className="font-semibold">{customer.name}</div>
                <div className="text-sm text-slate-500">{customer.phone}</div>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}

      <div className="flex gap-3">
        {onCancel ? (
          <button type="button" onClick={onCancel} className="rounded-2xl border px-4 py-3 text-sm">
            Hủy
          </button>
        ) : null}
        <button type="submit" disabled={createIntakeMutation.isPending} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {createIntakeMutation.isPending ? "Đang lưu..." : variant === "modal" ? "Xác nhận lập phiếu" : "Lưu phiếu tiếp nhận"}
        </button>
      </div>
    </form>
  );
}
