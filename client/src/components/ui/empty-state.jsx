import React from 'react';
import { StateShell } from './state-shell';

export function EmptyState({ title = 'Không có dữ liệu', message = 'Không tìm thấy kết quả nào phù hợp.', icon = 'inbox', action }) {
  return (
    <StateShell>
      <span className="material-symbols-outlined mb-4 text-4xl text-slate-300">{icon}</span>
      <h3 className="mb-1 font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </StateShell>
  );
}
