import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("index route mounts admin users with admin-only access", async () => {
  const source = await readFile(new URL("../src/routes/index.route.js", import.meta.url), "utf8");

  assert.match(source, /const requireAdminAccess = \[[^]*?authMiddleware\.requireAuth,[^]*?authMiddleware\.requireRoles\(\["Admin"\]\),[^]*?\];/u);
  assert.match(source, /app\.use\(`?\$\{apiPrefixV1\}\/admin\/users`?,\s*\.\.\.requireAdminAccess,\s*adminUsersRoute\);/u);
});
