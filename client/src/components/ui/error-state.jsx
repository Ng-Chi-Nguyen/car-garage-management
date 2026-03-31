import React from 'react';
import { StateShell } from './state-shell';

export function ErrorState({ title = 'Đã có lỗi xảy ra', message = 'Không thể tải dữ liệu. Vui lòng thử lại sau.', action }) {
  return (
    <StateShell centered className="bg-rose-50/30 border-rose-100">
      <span className="material-symbols-outlined mb-4 text-4xl text-rose-400">error</span>
      <h3 className="mb-1 font-semibold text-rose-900">{title}</h3>
      <p className="text-sm text-rose-600/80 max-w-sm">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </StateShell>
  );
}
