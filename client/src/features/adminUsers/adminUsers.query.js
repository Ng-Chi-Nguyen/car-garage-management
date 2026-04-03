export function parseAdminUsersQuery(searchParams) {
  const page = parseInt(searchParams.get("page"), 10) || 1;
  const limit = parseInt(searchParams.get("limit"), 10) || 10;
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";
  const status = searchParams.get("status") || "";

  return { page, limit, search, role, status };
}

export function buildAdminUsersQuery(params) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.role) searchParams.set("role", params.role);
  if (params.status) searchParams.set("status", params.status);
  return searchParams;
}
