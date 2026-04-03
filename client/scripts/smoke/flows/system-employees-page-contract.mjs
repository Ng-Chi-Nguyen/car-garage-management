import fs from "node:fs/promises";
import path from "node:path";

export default async function run() {
  console.log("Running system-employees-page-contract smoke flow...");

  const assertFileIncludes = async (relPath, substrings) => {
    const fullPath = path.resolve(process.cwd(), relPath);
    const content = await fs.readFile(fullPath, "utf-8");
    for (const str of substrings) {
      if (!content.includes(str)) {
        throw new Error(`File ${relPath} missing expected string: "${str}"`);
      }
    }
  };

  const assertFileExcludes = async (relPath, substrings) => {
    const fullPath = path.resolve(process.cwd(), relPath);
    const content = await fs.readFile(fullPath, "utf-8");
    for (const str of substrings) {
      if (content.includes(str)) {
        throw new Error(`File ${relPath} contains forbidden string: "${str}"`);
      }
    }
  };

  await assertFileExcludes("src/features/adminUsers/components/AdminUsersTable.jsx", [
    "pagination.totalPages || 1",
    "pagination.totalPages === 0 ? 1 : pagination.totalPages"
  ]);

  await assertFileIncludes("src/pages/admin/AdminUsersPage.jsx", [
    "AdminUsersHeader",
    "AdminUsersStats",
    "AdminUsersFilters",
    "AdminUsersTable",
    "useAdminUsersQuery",
    "onSubmit={handleSearchSubmit}",
    "e.preventDefault()",
    "}, [searchParams]);",
    "role: queryParams.role",
    "status: queryParams.status"
  ]);

  await assertFileExcludes("src/pages/admin/AdminUsersPage.jsx", [
    "search: queryParams.search",
    "user.ChucVu !== queryParams.role",
    "user.TrangThai !== queryParams.status"
  ]);

  await assertFileIncludes("src/features/adminUsers/components/AdminUsersTable.jsx", [
    "useUpdateAdminUserMutation",
    "useResetPasswordAdminUserMutation",
    "onSubmit={handleResetPassword}",
    "Reset mật khẩu",
    "MatKhauMoi",
    "XacNhanMatKhauMoi",
    "ChucVu",
    "TrangThai",
    "bg-surface-container-low",
    "text-on-surface",
    "border-outline-variant"
  ]);

  await assertFileIncludes("src/features/adminUsers/useAdminUsersMutation.js", [
    "invalidateQueries({ queryKey: [\"adminUsers\"] })",
    "useResetPasswordAdminUserMutation",
    "resetPasswordAdminUser"
  ]);

  await assertFileIncludes("src/index.css", [
    "background-color: var(--color-surface-container-low);",
    "color: var(--color-on-surface);"
  ]);

  console.log("All contract markers found.");
}
