import React from "react";
import { WorkshopKpiGrid } from "../../features/workshop/components/WorkshopKpiGrid";
import { WorkshopStatusPanel } from "../../features/workshop/components/WorkshopStatusPanel";

export function WorkshopKpiSection({ data }) {
  return (
    <section className="mb-6">
      <WorkshopKpiGrid metrics={data?.metrics} />
    </section>
  );
}

export function WorkshopQueueSection({
  data,
  isFetching,
  filters,
  updateFilters,
}) {
  return (
    <section>
      <WorkshopStatusPanel
        data={data}
        isFetching={isFetching}
        filters={filters}
        updateFilters={updateFilters}
      />
    </section>
  );
}
