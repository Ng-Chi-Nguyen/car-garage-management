const STATUS_MAP = {
  TiepNhan: { id: "waiting", badge: "secondary", label: "CHỜ" },
  DangSua: { id: "in_progress", badge: "primary", label: "ĐANG SỬA" },
  HoanTat: { id: "completed", badge: "success", label: "HOÀN TẤT" },
  Huy: { id: "cancelled", badge: "danger", label: "ĐÃ HỦY" },
};

const DEFAULT_STATUS = { id: "waiting", badge: "secondary", label: "Chưa rõ" };

function isValidDate(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function normalizeWorkshopData(rawData) {
  const {
    repairOrders = [],
    vehicles = [],
    staffById = {},
    pagination,
    globalMetrics,
  } = rawData;

  const metrics = globalMetrics || {
    waiting: 0,
    in_progress: 0,
    completed: 0,
    total: pagination?.totalItems ?? repairOrders.length,
  };

  const vehicleMap = new Map(vehicles.map((v) => [v.MaXe, v]));

  const activeRows = repairOrders.map((ro) => {
    const rawStatus = ro.TrangThai;
    const mappedStatus = STATUS_MAP[rawStatus] || DEFAULT_STATUS;

    // Use globalMetrics instead of counting local rows
    if (!globalMetrics) {
      metrics[mappedStatus.id]++;
    }

    let time = "-";
    if (isValidDate(ro.NgaySC)) {
      time = ro.NgaySC;
    } else if (isValidDate(ro.NgayTao)) {
      time = ro.NgayTao;
    }

    const vehicle = vehicleMap.get(ro.MaXe) || {};

    return {
      id: ro.MaPhieuSC,
      carId: ro.MaXe,
      licensePlate: vehicle.BienSo || "Không rõ",
      brand: vehicle.HieuXe?.TenHieuXe || vehicle.TenHieuXe || "",
      model: vehicle.MauXe || "",
      customerName: vehicle.KhachHang?.TenChuXe || "Chưa rõ",
      intakeStaffName: ro.MaNV
        ? staffById[Number(ro.MaNV)] || `NV #${ro.MaNV}`
        : "Chưa phân công",
      status: mappedStatus,
      time,
      actions: {
        view: `/repair-orders/${ro.MaPhieuSC}`,
        edit: `/repair-orders/${ro.MaPhieuSC}/edit`,
      },
    };
  });

  return {
    metrics,
    activeRows,
    pagination,
  };
}
