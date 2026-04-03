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

  await assertFileIncludes("client/src/pages/admin/AdminUsersPage.jsx", [
    "AdminUsersHeader",
    "AdminUsersStats",
    "AdminUsersFilters",
    "AdminUsersTable",
    "useAdminUsersQuery"
  ]);

  await assertFileIncludes("client/src/features/adminUsers/components/AdminUsersTable.jsx", [
    "useUpdateAdminUserMutation",
    "ChucVu",
    "TrangThai",
    "bg-surface-container-low",
    "text-on-surface",
    "border-outline-variant"
  ]);

  await assertFileIncludes("client/src/features/adminUsers/useAdminUsersMutation.js", [
    "invalidateQueries({ queryKey: [\"adminUsers\"] })"
  ]);

  await assertFileIncludes("client/src/index.css", [
    "background-color: var(--color-surface-container-low);",
    "color: var(--color-on-surface);"
  ]);

  console.log("All contract markers found.");
}
