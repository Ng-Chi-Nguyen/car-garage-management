import React from 'react';

export function DataTable({ columns, data, headers, children }) {
  const normalizedColumns = columns ?? headers?.map((header) => ({ header })) ?? [];
  const hasStructuredData = Array.isArray(columns) && Array.isArray(data);
  const hasLegacyRows = React.Children.count(children) > 0;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-y border-gray-200">
            {normalizedColumns.map((col, idx) => (
              <th key={idx} className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {hasStructuredData
            ? data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  {normalizedColumns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {col.cell ? col.cell(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            : children}
          {hasStructuredData && data.length === 0 && (
            <tr>
              <td colSpan={normalizedColumns.length} className="px-6 py-8 text-center text-gray-500 text-sm">
                Không có dữ liệu
              </td>
            </tr>
          )}
          {!hasStructuredData && !hasLegacyRows && (
            <tr>
              <td colSpan={Math.max(normalizedColumns.length, 1)} className="px-6 py-8 text-center text-gray-500 text-sm">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
