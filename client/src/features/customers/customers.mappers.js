export function formatCurrency(amount) {
  if (!amount && amount !== 0) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function mapCustomerSummary(c) {
  let visitCount = 0;
  let totalSpent = 0;
  let totalDebt = 0;
  let lastVisitDate = null;
  let carsSummary = [];

  (c.Xe || []).forEach(xe => {
    carsSummary.push(xe.BienSo);
    totalDebt += Number(xe.TienNoHienTai || 0);
    
    (xe.PhieuSuaChua || []).forEach(phieu => {
      visitCount++;
      totalSpent += Number(phieu.TongTien || 0);
      
      const phieuDate = new Date(phieu.NgaySC || phieu.NgayTao);
      if (!lastVisitDate || phieuDate > lastVisitDate) {
        lastVisitDate = phieuDate;
      }
    });
  });

  return {
    id: c.MaKH,
    rawId: c.MaKH, // useful for linking
    initials: c.TenChuXe ? c.TenChuXe.split(' ').pop().substring(0, 2).toUpperCase() : 'KH',
    name: c.TenChuXe,
    phone: c.DienThoai,
    email: c.Email,
    address: c.DiaChi,
    carsCount: c.Xe?.length || 0,
    carsSummary: carsSummary.length > 0 ? (carsSummary.length > 1 ? `${carsSummary[0]}...` : carsSummary[0]) : 'Chưa có xe',
    visitCount,
    totalSpent: formatCurrency(totalSpent),
    totalDebt: totalDebt, // unformatted
    debt: totalDebt > 0 ? formatCurrency(totalDebt) : null,
    rank: totalSpent > 50000000 ? 'VIP' : totalSpent > 10000000 ? 'Thân thiết' : totalSpent > 0 ? 'Thường xuyên' : 'Mới',
    lastVisit: lastVisitDate ? lastVisitDate.toLocaleDateString('vi-VN') : 'Chưa có',
    avatarColor: ['primary', 'secondary', 'tertiary', 'error'][c.MaKH % 4]
  };
}

export function mapCustomerStats(data) {
  return {
    totalCustomers: data.totalCustomers || 0,
    vipCustomers: data.vipCustomers || 0,
    totalOutstandingDebt: formatCurrency(data.totalOutstandingDebt || 0),
    monthlyRepairOrders: data.monthlyRepairOrders || 0
  };
}
