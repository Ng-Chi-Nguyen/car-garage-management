export function normalizeDashboardData(rawData) {
    const { 
        customers = [], 
        vehicles = [], 
        repairOrders = [], 
        paymentReceipts = [],
        customerCount,
        vehicleCount,
        repairOrderCount
    } = rawData;

    const totalCustomers = customerCount !== undefined ? customerCount : customers.length;
    const totalVehicles = vehicleCount !== undefined ? vehicleCount : vehicles.length;
    const totalRepairOrders = repairOrderCount !== undefined ? repairOrderCount : repairOrders.length;

    const totalRevenue = paymentReceipts.reduce((sum, pr) => sum + Number(pr.SoTienThu || 0), 0);

    const waitingCount = repairOrders.filter(ro => ro.TrangThai === 'TiepNhan').length;
    const repairingCount = repairOrders.filter(ro => ro.TrangThai === 'DangSua').length;
    const completedCount = repairOrders.filter(ro => ro.TrangThai === 'HoanTat').length;

    const vehicleMap = new Map(vehicles.map(v => [v.MaXe, v]));
    const customerMap = new Map(customers.map(c => [c.MaKH, c]));

    const recentOrders = repairOrders.slice(0, 5).map(ro => {
        const vehicle = vehicleMap.get(ro.MaXe);
        const customer = vehicle ? customerMap.get(vehicle.MaKH) : null;
        
        return {
            id: ro.MaPhieuSC,
            licensePlate: vehicle?.BienSo || 'Không rõ',
            vehicleModel: vehicle?.HieuXe?.TenHieuXe || (vehicle?.MaHieuXe ? `Hãng xe ${vehicle.MaHieuXe}` : 'Không rõ'),
            customerName: customer?.TenChuXe || 'Không rõ',
            createdAt: ro.NgayTao || new Date().toISOString(),
            status: ro.TrangThai
        };
    });

    const revenueByDate = {};
    paymentReceipts.forEach(pr => {
        const dateRaw = pr.NgayThu || pr.NgayTao;
        if (!dateRaw) return;
        const dateStr = dateRaw.split('T')[0];
        const amt = Number(pr.SoTienThu || 0);
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
            totalRevenue,
            waitingCount,
            repairingCount,
            completedCount
        },
        recentOrders,
        trendSeries
    };
}
