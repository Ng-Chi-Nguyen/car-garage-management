import React, { useState, useEffect } from "react";
import { StateShell } from "../../../components/ui/state-shell";
import { useSystemParametersQuery } from "../useSettingsQuery";
import { useUpdateSystemParametersMutation } from "../useSettingsMutation";

export function SystemParameters() {
  const query = useSystemParametersQuery();
  const mutation = useUpdateSystemParametersMutation();
  const [localData, setLocalData] = useState(null);

  useEffect(() => {
    if (query.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalData(query.data);
    }
  }, [query.data]);

  const handleChange = (key, value) => {
    setLocalData((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const handleSave = () => {
    if (localData) {
      mutation.mutate(localData);
    }
  };

  return (
    <StateShell query={query}>
      {() => {
        if (!localData) return null;
        
        return (
          <div className="space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 group hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary-container rounded-lg text-on-primary-container">
                  <span className="material-symbols-outlined">directions_car</span>
                </div>
                <span className="text-xs font-medium text-slate-400">Giới hạn ngày</span>
              </div>
              <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                Số xe tối đa tiếp nhận
              </h3>
              <div className="flex items-baseline gap-2">
                <input
                  className="text-4xl font-bold text-on-surface bg-transparent border-none p-0 w-24 focus:ring-0"
                  type="number"
                  value={localData.maxCarsPerDay}
                  onChange={(e) => handleChange("maxCarsPerDay", e.target.value)}
                />
                <span className="text-slate-400 font-medium">xe/ngày</span>
              </div>
              <div className="mt-4 h-1 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary w-2/3 rounded-full"></div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10 group hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-tertiary-container rounded-lg text-on-tertiary-container">
                  <span className="material-symbols-outlined">percent</span>
                </div>
                <span className="text-xs font-medium text-slate-400">Tỉ lệ lợi nhuận</span>
              </div>
              <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                Tỉ lệ lãi suất vật tư
              </h3>
              <div className="flex items-baseline gap-2">
                <input
                  className="text-4xl font-bold text-on-surface bg-transparent border-none p-0 w-24 focus:ring-0"
                  type="number"
                  value={localData.materialProfitMargin}
                  onChange={(e) => handleChange("materialProfitMargin", e.target.value)}
                />
                <span className="text-slate-400 font-medium">%</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                Áp dụng cho giá bán lẻ vật tư phụ tùng
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10 mt-8">
              <div className="text-xs text-slate-500">
                Lần cập nhật cuối: <span className="font-semibold">{localData.lastUpdated}</span> bởi{" "}
                <span className="font-semibold">{localData.updatedBy}</span>
              </div>
              <div className="flex gap-3">
                <button
                  className="px-6 py-2.5 rounded-xl border border-outline text-on-surface font-semibold text-sm hover:bg-slate-50 transition-colors"
                  onClick={() => setLocalData(query.data)}
                >
                  Hủy thay đổi
                </button>
                <button
                  className="px-8 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
                  onClick={handleSave}
                  disabled={mutation.isPending}
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  {mutation.isPending ? "Đang lưu..." : "Lưu cấu hình"}
                </button>
              </div>
            </div>
          </div>
        );
      }}
    </StateShell>
  );
}
