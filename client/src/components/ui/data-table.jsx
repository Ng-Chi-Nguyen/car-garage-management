import React from 'react';

function renderHeaderCell(header, idx) {
  if (typeof header === 'string') {
    return (
      <th key={idx} className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 first:rounded-l-2xl last:rounded-r-2xl">
        {header}
      </th>
    );
  }

  return (
    <th key={header.key ?? idx} className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 first:rounded-l-2xl last:rounded-r-2xl">
      {header.label ?? header.header ?? ''}
    </th>
  );
}

export function DataTable({ headers, children, columns = [], data = [] }) {
  const resolvedHeaders = headers ?? columns;
  const hasStaticRows = children !== undefined;

  return (
    <div className="overflow-x-auto rounded-[24px] border border-slate-200/80 bg-white">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/90">
            {resolvedHeaders.map((header, idx) => renderHeaderCell(header, idx))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/80 bg-white">
          {hasStaticRows
            ? children
            : data.map((row, idx) => (
                <tr key={idx} className="transition-colors hover:bg-slate-50/70">
                  {columns.map((col, colIdx) => (
                    <td key={col.key ?? col.accessor ?? colIdx} className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-700">
                      {col.cell ? col.cell(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
          {!hasStaticRows && data.length === 0 && (
            <tr>
              <td colSpan={resolvedHeaders.length} className="px-6 py-10 text-center text-sm font-medium text-slate-400">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
