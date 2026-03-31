import React from "react";
import { StateShell } from "../../../components/ui/state-shell";
import { useCarBrandsQuery } from "../useSettingsQuery";

export function CarBrandsManagement() {
  const query = useCarBrandsQuery();

  return (
    <div className="bg-surface-container-low rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-container rounded-lg text-on-primary-container">
          <span className="material-symbols-outlined">garage</span>
        </div>
        <h3 className="text-lg text-on-surface font-semibold">
          Quản lý Hãng xe & Model xe
        </h3>
      </div>
      
      <StateShell query={query}>
        {({ data }) => (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {data.map((brand) => (
              <div
                key={brand.id}
                className="bg-surface-container-lowest p-4 rounded-xl shadow-sm hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-on-surface">{brand.name}</div>
                  <span className="text-[10px] bg-success-container text-on-success-container px-2 py-0.5 rounded-full font-bold">
                    {brand.modelCount} MODELS
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant truncate">
                  {brand.description}
                </p>
              </div>
            ))}
            
            <div className="border-2 border-dashed border-outline-variant/40 p-4 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary hover:border-primary/40 transition-all group cursor-pointer">
              <span className="material-symbols-outlined">add_circle</span>
              <span className="text-xs font-semibold">Thêm hãng xe</span>
            </div>
          </div>
        )}
      </StateShell>
    </div>
  );
}
