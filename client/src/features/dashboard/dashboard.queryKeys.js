export const dashboardKeys = {
  all: ['dashboard'],
  metrics: () => [...dashboardKeys.all, 'metrics'],
  metricByRange: (range) => [...dashboardKeys.metrics(), { range }],
  recentOrders: () => [...dashboardKeys.all, 'recent-orders'],
  revenueTrend: () => [...dashboardKeys.all, 'revenue-trend'],
  revenueTrendByRange: (range) => [...dashboardKeys.revenueTrend(), { range }],
};
