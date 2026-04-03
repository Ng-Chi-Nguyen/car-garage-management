import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/ui/page-header";
import { useWorkshopQuery } from "../../features/workshop/useWorkshopQuery";
import { WorkshopKpiSection, WorkshopQueueSection } from "./workshop-sections";
import { getWorkshopRouteTarget } from "../../features/workshop/workshop.interactions";
import { StateShell } from "../../components/ui/state-shell";
import { LoadingState } from "../../components/ui/loading-state";

export default function WorkshopStatusPage() {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    filters,
    updateFilters,
    refetch,
  } = useWorkshopQuery();

  const onRetry = () => refetch();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Trạng thái Xưởng"
        description="Quản lý và theo dõi tiến độ sửa chữa xe trong xưởng"
      />
      <StateShell
        isLoading={isLoading}
        loadingFallback={<LoadingState message="Đang tải dữ liệu xưởng..." />}
      >
        <WorkshopKpiSection
          data={data}
          isLoading={isLoading}
          isError={isError}
        />

        <WorkshopQueueSection
          data={data}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          filters={filters}
          updateFilters={updateFilters}
          onRetry={onRetry}
        />
      </StateShell>
    </div>
  );
}
