import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("VehicleIntake page does not contain static quota banner text", () => {
  const componentFile = path.join(__dirname, "../VehicleIntake.jsx");
  const content = fs.readFileSync(componentFile, "utf-8");

  assert.ok(!content.includes("Hạn mức tiếp nhận"), "Quota banner title should be removed");
  assert.ok(!content.includes("Chỉ còn 03 lượt tiếp nhận miễn phí hôm nay."), "Quota banner description should be removed");
  assert.ok(content.includes("📅"), "Date chip should be kept intact");
});
