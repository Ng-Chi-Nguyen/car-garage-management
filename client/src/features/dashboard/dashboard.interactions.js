export const handleQuickActionClick = (navigate, path) => {
  navigate(path);
};

export const computeTrendChartHeights = (revenues) => {
  if (!revenues || revenues.length === 0) return [];
  const maxRevenue = Math.max(...revenues, 1);
  return revenues.map(rev => Math.max((rev / maxRevenue) * 100, 5));
};
