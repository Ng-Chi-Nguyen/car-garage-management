import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("VehicleIntakeForm has customer dropdown UX and vehicle autofill", () => {
  const formFile = path.join(__dirname, "../components/VehicleIntakeForm.jsx");
  const content = fs.readFileSync(formFile, "utf-8");

  // Step 1: Replace customer suggestion cards with dropdown list bound to search results
  assert.ok(content.includes("showCustomerDropdown"), "Must control customer dropdown visibility");
  assert.ok(!content.includes("Khách hàng gợi ý"), "Must not use static suggestion cards section anymore");

  // Step 2: Show CTA to open AddCustomerModal if search has no result
  assert.ok(content.includes("AddCustomerModal"), "Must include AddCustomerModal component");
  assert.ok(content.includes("Thêm khách hàng mới"), "Must have CTA to add new customer");

  // Step 3: Vehicle plate lookup to autofill
  assert.ok(content.includes("handlePlateBlur"), "Must have onBlur handler for license plate");
  assert.ok(content.includes("resolveVehicleByPlate("), "Must resolve vehicle by plate on blur");
  assert.ok(content.includes("brand: vehicle.HieuXe?.TenHieuXe"), "Must map brand from resolved vehicle");

  // Step 4: Ensure selected customer/vehicle is source of truth and manual edits clear them
  assert.ok(content.includes("setSelectedCustomer(null)"), "Must clear selected customer on manual edit");
  assert.ok(content.includes("setSelectedVehicle(null)"), "Must clear selected vehicle on manual edit");
});
