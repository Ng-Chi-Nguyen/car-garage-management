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

  await assertFileIncludes("client/src/features/adminUsers/adminUsers.query.js", [
    "page",
    "limit"
  ]);

  await assertFileIncludes("client/src/pages/admin/AdminUsersPage.jsx", [
    "goNext",
    "goPrev",
    "goToPage",
    "pagination",
    "buildAdminUsersQuery"
  ]);

  await assertFileIncludes("client/src/features/adminUsers/components/AdminUsersTable.jsx", [
    "goNext",
    "goPrev",
    "goToPage"
  ]);

  console.log("All pagination invariant markers found.");
}
