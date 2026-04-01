import React from "react";
import { useNavigate } from "react-router-dom";
import { VehicleIntakeForm } from "../../features/intake/components/VehicleIntakeForm";

export default function IntakeModalPage() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">
            Lập phiếu tiếp nhận mới
          </h2>
          <button type="button" onClick={() => navigate('/intake')} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <VehicleIntakeForm variant="modal" onCancel={() => navigate('/intake')} onSuccess={() => navigate('/intake')} />
      </div>
    </div>
  );
}
