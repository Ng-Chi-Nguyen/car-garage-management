import React from 'react';

export function DataTable({ columns, data, headers, children }) {
  const normalizedColumns = columns ?? headers?.map((header) => ({ header })) ?? [];
  const hasStructuredData = Array.isArray(columns) && Array.isArray(data);
  const hasLegacyRows = React.Children.count(children) > 0;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            {normalizedColumns.map((col, idx) => (
              <th key={idx} className="px-6 py-4 text-[0.75rem] font-medium text-slate-500 uppercase tracking-[0.05em]">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hasStructuredData
            ? data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors duration-150">
                  {normalizedColumns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 text-[0.875rem] text-slate-900 whitespace-nowrap">
                      {col.cell ? col.cell(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            : children}
          {hasStructuredData && data.length === 0 && (
            <tr>
              <td colSpan={Math.max(normalizedColumns.length, 1)} className="px-6 py-8 text-center text-slate-500 text-[0.875rem]">
                Không có dữ liệu
              </td>
            </tr>
          )}
          {!hasStructuredData && !hasLegacyRows && (
            <tr>
              <td colSpan={Math.max(normalizedColumns.length, 1)} className="px-6 py-8 text-center text-slate-500 text-[0.875rem]">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
