import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("VehicleIntakeForm customer search dropdown UX", () => {
  const formFile = path.join(__dirname, "../components/VehicleIntakeForm.jsx");
  const content = fs.readFileSync(formFile, "utf-8");

  // Step 1: Add failing interaction tests for customer search dropdown selection behavior.
  assert.ok(content.includes("showCustomerDropdown"), "Must manage dropdown visibility state for customer search");
  assert.ok(content.includes("onSelect={handleSelectCustomer}"), "Dropdown must trigger handleSelectCustomer on selection");
  assert.ok(content.includes("dropdown"), "Component must have a dropdown element for customers");

  // Step 2: Add failing test: when search returns no customers, user can open add-customer modal.
  assert.ok(content.includes("setIsAddCustomerModalOpen(true)"), "Must allow opening add-customer modal");
  assert.ok(content.includes("<AddCustomerModal"), "Must include AddCustomerModal component");
  assert.ok(content.includes("Không tìm thấy khách hàng"), "Must show no customers found message or option to add new");
});

test("VehicleIntakeForm vehicle lookup and autofill UX", () => {
  const formFile = path.join(__dirname, "../components/VehicleIntakeForm.jsx");
  const content = fs.readFileSync(formFile, "utf-8");

  // Step 3: Add failing test for vehicle lookup dropdown by license plate and autofill of brand/model/customer fields when existing vehicle selected.
  assert.ok(content.includes("useVehiclesQuery"), "Must fetch vehicles for license plate lookup");
  assert.ok(content.includes("showVehicleDropdown"), "Must manage dropdown visibility state for vehicle search");
  assert.ok(content.includes("handleSelectVehicle"), "Must have a handler for when a vehicle is selected");
  assert.ok(content.match(/setForm\(\(current\) => \(\{ \.\.\.current,.*brand:.*model:.*\}/), "Must autofill brand and model when vehicle is selected");
  assert.ok(content.includes("handleSelectCustomer"), "Must autofill or trigger customer selection when vehicle has an associated customer");
});
