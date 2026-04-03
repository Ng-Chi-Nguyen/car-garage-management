import fs from "node:fs/promises";
import path from "node:path";

export default async function run() {
  console.log("Running system-employees-pagination smoke flow...");

  const assertFileIncludes = async (relPath, substrings) => {
    const fullPath = path.resolve(process.cwd(), relPath);
    const content = await fs.readFile(fullPath, "utf-8");
    for (const str of substrings) {
      if (!content.includes(str)) {
        throw new Error(`File ${relPath} missing expected string: "${str}"`);
      }
    }
  };

  await assertFileIncludes("src/features/adminUsers/adminUsers.api.js", [
    "return {",
    "users: unwrap(response, \"users\"),",
    "pagination: unwrap(response, \"pagination\")"
  ]);

  await assertFileIncludes("src/features/adminUsers/adminUsers.query.js", [
    "page",
    "limit",
    "parseAdminUsersQuery",
    "buildAdminUsersQuery",
    "URLSearchParams"
  ]);

  await assertFileIncludes("src/pages/admin/AdminUsersPage.jsx", [
    "goNext",
    "goPrev",
    "pagination",
    "totalItems",
    "totalPages",
    "useSearchParams",
    "setSearchParams",
    "parseAdminUsersQuery",
    "buildAdminUsersQuery",
    "updateParams({ page: pagination.page + 1 })",
    "updateParams({ page: pagination.page - 1 })",
    "role: queryParams.role",
    "status: queryParams.status"
  ]);

  await assertFileIncludes("src/features/adminUsers/components/AdminUsersTable.jsx", [
    "goNext",
    "goPrev",
    "totalItems",
    "totalPages"
  ]);

  console.log("All pagination invariant markers found.");
}
