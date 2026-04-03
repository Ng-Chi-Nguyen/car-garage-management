import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("settings controller co defense-in-depth chi cho Admin", async () => {
  const source = await readFile(new URL("../src/controllers/settings.controller.js", import.meta.url), "utf8");

  assert.match(source, /const forbidden = \(res\) =>/u);
  assert.match(source, /const assertAdmin = \(req, res\) => req\.user\?\.ChucVu === "Admin";/u);
  assert.match(source, /if \(!assertAdmin\(req, res\)\) \{\s*return forbidden\(res\);\s*\}/u);
  assert.match(source, /if \(!assertAdmin\(req, res\)\) \{\s*return forbidden\(res\);\s*\}/u);
});
