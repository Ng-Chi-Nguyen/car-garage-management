import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/ui/page-header";
import { useWorkshopQuery } from "../../features/workshop/useWorkshopQuery";
import { WorkshopKpiSection, WorkshopQueueSection } from "./workshop-sections";
import { getWorkshopRouteTarget } from "../../features/workshop/workshop.interactions";
import { StateShell } from "../../components/ui/state-shell";
import { LoadingState } from "../../components/ui/loading-state";

export default function WorkshopStatusPage() {
  const { data, isLoading, isFetching, isError, filters, updateFilters, refetch } =
    useWorkshopQuery();
  const navigate = useNavigate();

  const onRetry = () => refetch();

  const topActions = (
    <>
      <button
        onClick={() => navigate(getWorkshopRouteTarget("view_repair_orders"))}
        className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-sm font-semibold rounded-lg transition-colors"
      >
        Danh sách phiếu
      </button>
      <button
        onClick={() => navigate(getWorkshopRouteTarget("create_repair_order"))}
        className="px-4 py-2 bg-secondary hover:bg-secondary-container text-white hover:text-on-secondary-container text-sm font-semibold rounded-lg transition-colors"
      >
        Tạo phiếu SC
      </button>
      <button
        onClick={() => navigate(getWorkshopRouteTarget("create_intake"))}
        className="px-4 py-2 bg-primary hover:bg-primary-container text-white hover:text-on-primary-container text-sm font-semibold rounded-lg transition-colors"
      >
        Tiếp nhận xe
      </button>
    </>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Trạng thái Xưởng"
        description="Quản lý và theo dõi tiến độ sửa chữa xe trong xưởng"
        actions={topActions}
      />
      <StateShell
        isLoading={isLoading}
        loadingFallback={<LoadingState message="Đang tải dữ liệu xưởng..." />}
      >
        <WorkshopKpiSection data={data} isLoading={isLoading} isError={isError} />

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
