import React from "react";
import { WorkshopKpiGrid } from "../../features/workshop/components/WorkshopKpiGrid";
import { WorkshopStatusPanel } from "../../features/workshop/components/WorkshopStatusPanel";
import { WorkshopPerformancePanel } from "../../features/workshop/components/WorkshopPerformancePanel";

export function WorkshopKpiSection({ data, isLoading, isError }) {
  return (
    <section className="mb-6">
      <WorkshopKpiGrid metrics={data?.metrics} isLoading={isLoading} isError={isError} />
    </section>
  );
}

export function WorkshopQueueSection({
  data,
  isLoading,
  isFetching,
  isError,
  filters,
  updateFilters,
  onRetry,
  onResetFilters,
  hasActiveFilters,
}) {
  return (
    <section>
      <WorkshopStatusPanel
        data={data}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        filters={filters}
        updateFilters={updateFilters}
        onRetry={onRetry}
        onResetFilters={onResetFilters}
        hasActiveFilters={hasActiveFilters}
      />
      {!isLoading && !isError && <WorkshopPerformancePanel metrics={data?.metrics} />}
    </section>
  );
}
