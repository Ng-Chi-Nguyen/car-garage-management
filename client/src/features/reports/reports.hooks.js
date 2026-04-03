import { useQuery } from '@tanstack/react-query';
import { fetchInventoryReport, fetchRepairReport, fetchRevenueReport } from './reports.api';
import { reportKeys } from './reports.queries';

export function useInventoryReportQuery(params) {
  return useQuery({
    queryKey: reportKeys.inventory(params),
    queryFn: () => fetchInventoryReport(params),
    enabled: !!params?.from && !!params?.to,
  });
}

export function useRepairReportQuery(params) {
  return useQuery({
    queryKey: reportKeys.repair(params),
    queryFn: () => fetchRepairReport(params),
    enabled: !!params?.from && !!params?.to,
  });
}

export function useRevenueReportQuery(params) {
  return useQuery({
    queryKey: reportKeys.revenue(params),
    queryFn: () => fetchRevenueReport(params),
    enabled: !!params?.from && !!params?.to && !!params?.granularity,
  });
}
