import React from "react";

export function PaginationControls({ page = 1, totalPages = 1, totalItems = 0, onPageChange, isLoading = false }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-slate-200/80 bg-slate-50/60">
      <p className="text-sm text-on-surface-variant">
        Trang <span className="font-semibold text-on-surface">{page}</span> /{" "}
        <span className="font-semibold text-on-surface">{totalPages}</span>
        {typeof totalItems === "number" && (
          <>
            {" "}• Tổng <span className="font-semibold text-on-surface">{totalItems}</span>
          </>
        )}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange?.(Math.max(1, page - 1))}
          disabled={isLoading || page <= 1}
          className="px-3 py-1.5 rounded-lg border border-outline-variant text-sm disabled:opacity-50"
        >
          Trước
        </button>
        <button
          type="button"
          onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
          disabled={isLoading || page >= totalPages}
          className="px-3 py-1.5 rounded-lg border border-outline-variant text-sm disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
}
