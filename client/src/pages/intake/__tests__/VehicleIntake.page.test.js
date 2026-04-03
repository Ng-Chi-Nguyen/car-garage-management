import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("VehicleIntake page removes the quota banner copy", () => {
  const content = fs.readFileSync(path.join(__dirname, "../VehicleIntake.jsx"), "utf8");

  assert.ok(!content.includes("Hạn mức tiếp nhận"));
  assert.ok(!content.includes("Chỉ còn 03 lượt tiếp nhận miễn phí hôm nay."));
});
