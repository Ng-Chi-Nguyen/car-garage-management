import axiosClient from '../../lib/axiosClient';

export async function fetchReceivables(params = {}) {
  const response = await axiosClient.get("/api/v1/reports/finance/debtors", {
    params: {
      page: Number(params.page) > 0 ? Number(params.page) : 1,
      limit: params.limit || params.pageSize || 20,
      search: params.q || "",
      groupBy: params.groupBy || "vehicle",
    },
  });
  return response.data?.data || response.data;
}

export async function fetchFinanceSummary(params = {}) {
  const response = await axiosClient.get("/api/v1/reports/finance/summary", {
    params,
  });
  return response.data?.data || response.data;
}

export async function createReceivable(data) {
  const response = await axiosClient.post("/api/v1/payment-receipts", data);
  return response.data?.data || response.data;
}

export async function fetchReceiptHistory(params = {}) {
  // Harden params: whitelist allowed query params and prevent accidental override/unknown keys.
  const allowedParams = {
    MaXe: params.vehicleId ? Number(params.vehicleId) : undefined,
    page: params.page ? Number(params.page) : 1,
    limit: params.limit ? Number(params.limit) : 10,
  };
  
  // Strip out undefined values
  const cleanParams = Object.fromEntries(
    Object.entries(allowedParams).filter(([, v]) => v !== undefined)
  );

  const response = await axiosClient.get("/api/v1/payment-receipts", {
    params: cleanParams,
  });
  return response.data?.data || response.data;
}

export async function fetchSettlement(id) {
  const response = await axiosClient.get(`/api/v1/repair-orders/${id}`);
  return response.data?.data || response.data;
}
