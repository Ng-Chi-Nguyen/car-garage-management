import React from 'react';
import { StateShell } from './state-shell';

export function LoadingState({ message = 'Đang tải dữ liệu...' }) {
  return (
    <StateShell>
      <span className="material-symbols-outlined mb-4 animate-spin text-4xl text-slate-400">progress_activity</span>
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </StateShell>
  );
}
