import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("admin users controller co defense-in-depth chi cho Admin", async () => {
  const source = await readFile(new URL("../src/controllers/adminUsers.controller.js", import.meta.url), "utf8");

  assert.match(source, /const forbidden = \(res\) =>/u);
  assert.match(source, /const assertAdmin = \(req\) => req\.user\?\.ChucVu === "Admin";/u);
  assert.match(source, /if \(!assertAdmin\(req\)\) \{\s*return forbidden\(res\);\s*\}/u);
});
