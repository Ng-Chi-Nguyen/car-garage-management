import React from "react";

export function StateShell({
  children,
  className = "",
  query,
  isLoading = false,
  isError = false,
  error = null,
  loadingFallback = null,
  errorFallback = null,
  loadingComponent = null,
  errorComponent = null,
  centered = false,
}) {
  const queryLoading = Boolean(
    query?.isLoading || query?.isPending || query?.isFetching,
  );
  const queryError = Boolean(query?.isError || query?.error);

  const resolvedLoadingFallback =
    loadingFallback ??
    loadingComponent ?? (
      <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-slate-200/60 bg-slate-50/50 p-6 text-sm text-slate-500">
        Đang tải dữ liệu...
      </div>
    );

  const resolvedErrorFallback =
    errorFallback ??
    errorComponent ?? (
      <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-rose-100 bg-rose-50/30 p-6 text-sm text-rose-700">
        Không thể tải dữ liệu. Vui lòng thử lại.
      </div>
    );

  if (isLoading || queryLoading) {
    return resolvedLoadingFallback;
  }

  if (isError || queryError || error) {
    return resolvedErrorFallback;
  }

  const content =
    typeof children === "function"
      ? children({
          data: query?.data,
          query,
          isLoading: isLoading || queryLoading,
          isError: isError || queryError || Boolean(error),
          error: error ?? query?.error ?? null,
        })
      : children;
  const baseClass = centered
    ? "flex min-h-[300px] w-full flex-col items-center justify-center rounded-xl border border-slate-200/60 bg-slate-50/50 p-8 text-center"
    : "w-full space-y-8";

  return <div className={`${baseClass} ${className}`}>{content}</div>;
}
