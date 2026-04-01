import axiosClient from '../../lib/axiosClient';

export async function fetchReceivables(params = {}) {
  const response = await axiosClient.get("/api/v1/reports/finance/debtors", {
    params: {
      page: params.page || 1,
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

export async function fetchSettlement(id) {
  const response = await axiosClient.get(`/api/v1/payment-receipts/${id}`);
  return response.data?.data || response.data;
}
