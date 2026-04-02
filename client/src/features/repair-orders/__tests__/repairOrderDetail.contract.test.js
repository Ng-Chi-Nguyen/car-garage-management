import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("repair order detail unpacks nested response and maps detail labels", () => {
  const source = fs.readFileSync(path.join(__dirname, "../components/RepairOrderDetail.jsx"), "utf8");

  assert.match(source, /detailsResponse\?\.data\?\.data\?\.repairOrderDetails/);
  assert.match(source, /row\.TenVatTu/);
  assert.match(source, /row\.TenTienCong/);
});
