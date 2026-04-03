import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

import { SectionCard } from "../../../components/ui/section-card";
import { DataTable } from "../../../components/ui/data-table";
import { StateShell } from "../../../components/ui/state-shell";
import { useServicePricesQuery } from "../useSettingsQuery";
import {
  useCreateServicePriceMutation,
  useDeleteServicePriceMutation,
  useUpdateServicePriceMutation,
} from "../useSettingsMutation";

const initialForm = {
  name: "",
  price: "",
};

function ServicePriceModal({ mode, value, isPending, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: value?.name ?? initialForm.name,
    price: value?.price != null ? String(value.price) : initialForm.price,
  });

  const title = mode === "create" ? "Thêm hạng mục tiền công" : "Sửa hạng mục tiền công";
  const submitText = mode === "create" ? "Tạo dịch vụ" : "Lưu thay đổi";

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price),
    };

    if (!payload.name) {
      toast.error("Vui lòng nhập tên hạng mục.");
      return;
    }

    if (!Number.isFinite(payload.price) || payload.price < 0) {
      toast.error("Đơn giá phải là số lớn hơn hoặc bằng 0.");
      return;
    }

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xl w-full max-w-xl border border-outline-variant">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-on-surface">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Tên hạng mục</label>
            <input
              name="name"
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              required
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Ví dụ: Cân chỉnh thước lái"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Đơn giá (VNĐ)</label>
            <input
              type="number"
              min={0}
              step={1000}
              name="price"
              value={formData.price}
              onChange={(event) => setFormData((prev) => ({ ...prev, price: event.target.value }))}
              required
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Ví dụ: 350000"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isPending ? "Đang xử lý..." : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ServicePricesTable() {
  const query = useServicePricesQuery();
  const createMutation = useCreateServicePriceMutation();
  const updateMutation = useUpdateServicePriceMutation();
  const deleteMutation = useDeleteServicePriceMutation();

  const [modalMode, setModalMode] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const isModalOpen = modalMode === "create" || modalMode === "edit";
  const isMutating = createMutation.isPending || updateMutation.isPending;

  const priceHeaders = useMemo(
    () => ["Tên hạng mục", "Đơn giá (VNĐ)", "Thao tác"],
    [],
  );

  const handleOpenCreate = () => {
    setSelectedService(null);
    setModalMode("create");
  };

  const handleOpenEdit = (service) => {
    setSelectedService(service);
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    if (isMutating) {
      return;
    }

    setModalMode(null);
    setSelectedService(null);
  };

  const handleSubmitModal = (payload) => {
    if (modalMode === "create") {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Thêm hạng mục tiền công thành công.");
          handleCloseModal();
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Không thể thêm hạng mục tiền công.");
        },
      });
      return;
    }

    if (!selectedService) {
      return;
    }

    updateMutation.mutate(
      { id: Number(selectedService.id), data: payload },
      {
        onSuccess: () => {
          toast.success("Cập nhật hạng mục tiền công thành công.");
          handleCloseModal();
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Không thể cập nhật hạng mục tiền công.");
        },
      },
    );
  };

  const handleDelete = (serviceId) => {
    if (confirmDeleteId !== serviceId) {
      setConfirmDeleteId(serviceId);
      return;
    }

    deleteMutation.mutate(serviceId, {
      onSuccess: () => {
        toast.success("Đã xóa hạng mục tiền công.");
        setConfirmDeleteId(null);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Không thể xóa hạng mục tiền công.");
      },
    });
  };

  return (
    <>
      <SectionCard
        title="Bảng giá tiền công niêm yết"
        noPadding
        action={
          <button
            type="button"
            onClick={handleOpenCreate}
            className="text-primary text-xs font-semibold hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">add</span> Thêm dịch vụ
          </button>
        }
      >
        <StateShell query={query}>
          {({ data }) => (
            <DataTable headers={priceHeaders}>
              {data.map((service) => (
                <tr
                  key={service.id}
                  className="hover:bg-surface-container-low transition-colors group"
                >
                  <td className="py-4 px-6 text-sm font-medium text-on-surface">
                    {service.name}
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold text-right text-primary">
                    {Number(service.price).toLocaleString("vi-VN")}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(service)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(service.id)}
                        disabled={deleteMutation.isPending && confirmDeleteId === service.id}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                          confirmDeleteId === service.id
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "border border-red-200 text-red-600 hover:bg-red-50"
                        } disabled:opacity-60`}
                      >
                        {confirmDeleteId === service.id ? "Xác nhận xóa" : "Xóa"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    Không tìm thấy dữ liệu.
                  </td>
                </tr>
              )}
            </DataTable>
          )}
        </StateShell>
      </SectionCard>

      {isModalOpen ? (
        <ServicePriceModal
          mode={modalMode}
          value={selectedService}
          isPending={isMutating}
          onClose={handleCloseModal}
          onSubmit={handleSubmitModal}
        />
      ) : null}
    </>
  );
}
