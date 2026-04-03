import axiosClient from "../../lib/axiosClient.js";
import { authStorage } from "../auth/auth.storage.js";
import { normalizeWorkshopData } from "./workshop.mappers.js";
import {
  getValidRange,
  WORKSHOP_RANGE,
  buildQueryString,
} from "./workshop.filters.js";

function toDateRange(rangeType) {
  const end = new Date();
  const start = new Date();
  const validRange = getValidRange(rangeType);

  if (validRange === WORKSHOP_RANGE.TODAY) {
    start.setHours(0, 0, 0, 0);
  } else if (validRange === WORKSHOP_RANGE.LAST_7_DAYS) {
    start.setDate(end.getDate() - 7);
  } else if (validRange === WORKSHOP_RANGE.LAST_30_DAYS) {
    start.setDate(end.getDate() - 30);
  } else if (validRange === WORKSHOP_RANGE.LAST_90_DAYS) {
    start.setDate(end.getDate() - 90);
  } else if (validRange === WORKSHOP_RANGE.THIS_MONTH) {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  } else if (validRange === WORKSHOP_RANGE.ALL_TIME) {
    start.setFullYear(2000, 0, 1);
  } else {
    start.setDate(end.getDate() - 7);
  }

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
}

export async function fetchWorkshopData(filters = {}) {
  const { page = 1, limit = 10, status, search, range } = filters;

  const { startDate, endDate } = toDateRange(range);

  const repairOrderParams = {
    page,
    limit,
    search,
    NgayTaoFrom: startDate,
    NgayTaoTo: endDate,
  };

  if (status === "waiting") {
    repairOrderParams.TrangThai = "TiepNhan";
  } else if (status === "in_progress") {
    repairOrderParams.TrangThai = "DangSua";
  } else if (status === "completed") {
    repairOrderParams.TrangThai = ["HoanTat", "Huy"];
  }

  const metricParams = {
    search,
    limit: 1,
    NgayTaoFrom: startDate,
    NgayTaoTo: endDate,
  };

  const [roResponse, waitingRes, inProgressRes, completedRes] =
    await Promise.all([
      axiosClient.get(
        `/api/v1/repair-orders?${buildQueryString(repairOrderParams)}`,
      ),
      axiosClient
        .get(
          `/api/v1/repair-orders?${buildQueryString({ ...metricParams, TrangThai: "TiepNhan" })}`,
        )
        .catch(() => null),
      axiosClient
        .get(
          `/api/v1/repair-orders?${buildQueryString({ ...metricParams, TrangThai: "DangSua" })}`,
        )
        .catch(() => null),
      axiosClient
        .get(
          `/api/v1/repair-orders?${buildQueryString({ ...metricParams, TrangThai: ["HoanTat", "Huy"] })}`,
        )
        .catch(() => null),
    ]);

  const repairOrders = roResponse.data?.data?.repairOrders || [];
  const pagination = roResponse.data?.data?.pagination || {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  };

  const globalMetrics = {
    waiting: waitingRes?.data?.data?.pagination?.totalItems || 0,
    in_progress: inProgressRes?.data?.data?.pagination?.totalItems || 0,
    completed: completedRes?.data?.data?.pagination?.totalItems || 0,
  };
  globalMetrics.total =
    globalMetrics.waiting + globalMetrics.in_progress + globalMetrics.completed;

  const vehicleIds = [
    ...new Set(repairOrders.map((ro) => ro.MaXe).filter(Boolean)),
  ];

  let vehicles = [];
  let staffById = {};
  if (vehicleIds.length > 0) {
    const vehiclePromises = vehicleIds.map((id) =>
      axiosClient.get(`/api/v1/vehicles/${id}`).catch(() => null),
    );
    const vehicleResults = await Promise.all(vehiclePromises);
    vehicles = vehicleResults
      .filter((res) => res && res.data?.data?.vehicle)
      .map((res) => res.data.data.vehicle);

    // Enrich vehicle brand name from car-brands API because vehicle detail payload only has MaHieuXe
    const brandIds = [
      ...new Set(vehicles.map((v) => v.MaHieuXe).filter(Boolean)),
    ];
    if (brandIds.length > 0) {
      const brandPromises = brandIds.map((id) =>
        axiosClient.get(`/api/v1/car-brands/${id}`).catch(() => null),
      );
      const brandResults = await Promise.all(brandPromises);
      const brandMap = new Map(
        brandResults
          .filter((res) => res && res.data?.data?.carBrand)
          .map((res) => {
            const brand = res.data.data.carBrand;
            return [brand.MaHieuXe, brand.TenHieuXe];
          }),
      );

      vehicles = vehicles.map((vehicle) => ({
        ...vehicle,
        TenHieuXe: brandMap.get(vehicle.MaHieuXe) || vehicle.TenHieuXe || "",
      }));
    }
  }

  const currentUserRole = authStorage.getUser()?.ChucVu;
  if (currentUserRole === "Admin") {
    try {
      const usersRes = await axiosClient.get(
        `/api/v1/admin/users?${buildQueryString({ role: "NhanVien", limit: 200 })}`,
      );
      const users = usersRes?.data?.data?.users || [];
      staffById = Object.fromEntries(
        users
          .filter((user) => user?.MaKH)
          .map((user) => [Number(user.MaKH), user.TenChuXe || `NV #${user.MaKH}`]),
      );
    } catch {
      staffById = {};
    }
  }

  const rawData = {
    vehicles,
    repairOrders,
    staffById,
    pagination,
    globalMetrics,
  };

  return normalizeWorkshopData(rawData);
}
