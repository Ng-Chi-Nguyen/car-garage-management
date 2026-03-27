export function normalizeDashboardData(rawData) {
    const { customers = [], vehicles = [], repairOrders = [], paymentReceipts = [] } = rawData;

    // Calculate KPIs
    const totalCustomers = customers.length;
    const totalVehicles = vehicles.length;
    const totalRepairOrders = repairOrders.length;
    
    // Revenue from paymentReceipts
    const totalRevenue = paymentReceipts.reduce((sum, pr) => sum + Number(pr.amount || 0), 0);

    // Recent orders: take top 5
    const recentOrders = repairOrders.slice(0, 5);

    // Trend series (Revenue by date)
    const revenueByDate = {};
    paymentReceipts.forEach(pr => {
        if (!pr.createdAt) return;
        const dateStr = pr.createdAt.split('T')[0];
        const amt = Number(pr.amount || 0);
        revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + amt;
    });

    const sortedDates = Object.keys(revenueByDate).sort();
    const trendSeries = {
        dates: sortedDates,
        revenues: sortedDates.map(d => revenueByDate[d])
    };

    return {
        kpis: {
            totalCustomers,
            totalVehicles,
            totalRepairOrders,
            totalRevenue
        },
        recentOrders,
        trendSeries
    };
}
