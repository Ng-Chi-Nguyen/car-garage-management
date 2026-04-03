export function parseAdminUsersQuery(searchParams) {
  let page = parseInt(searchParams.get("page"), 10);
  page = (!isNaN(page) && page > 0) ? page : 1;
  let limit = parseInt(searchParams.get("limit"), 10);
  limit = (!isNaN(limit) && limit > 0) ? limit : 10;
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
