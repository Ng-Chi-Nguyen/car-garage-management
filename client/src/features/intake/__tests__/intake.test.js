import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildIntakePayload } from "../intakePayloadBuilder.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("buildIntakePayload only emits backend intake contract", () => {
  const originalNow = Date.now;
  Date.now = () => 1710000000000;

  try {
    const payload = buildIntakePayload(
      {
        note: "  Xước nhẹ  ",
        quickTags: ["Xước nhẹ", "  ", "Móp méo"],
      },
      12,
      34,
      5,
    );

    assert.deepStrictEqual(payload, {
      MaKH: 34,
      MaXe: 12,
      MaNV: 5,
      NgayTiepNhan: new Date(1710000000000).toISOString(),
      TrangThai: "TiepNhan",
      NoiDungLoi: "Xước nhẹ",
      quickTags: ["Xước nhẹ", "Móp méo"],
      note: "Xước nhẹ",
    });
  } finally {
    Date.now = originalNow;
  }
});

test("Intake feature defines keys and mutations correctly", () => {
  const mutationFile = path.join(__dirname, "../useIntakeMutation.js");
  const content = fs.readFileSync(mutationFile, "utf-8");
  
  assert.ok(content.includes("INTAKE_KEYS"), "Must use INTAKE_KEYS for invalidation");
  assert.ok(content.includes("queryClient.invalidateQueries"), "Must call invalidateQueries");
});

test("Intake components exist", () => {
  const formFile = path.join(__dirname, "../components/VehicleIntakeForm.jsx");
  const catalogQueryFile = path.join(__dirname, "../useVehicleCatalogQuery.js");
  const catalogApiFile = path.join(__dirname, "../intakeVehicleCatalog.api.js");
  const content = fs.readFileSync(formFile, "utf-8");
  const catalogQueryContent = fs.readFileSync(catalogQueryFile, "utf-8");
  const catalogApiContent = fs.readFileSync(catalogApiFile, "utf-8");

  assert.ok(fs.existsSync(formFile), "VehicleIntakeForm should exist");
  assert.ok(content.includes("resolveVehicleByPlate("), "Resolver must run before submit");
  assert.ok(content.includes("useCustomersQuery"), "Customer search must be wired in");
  assert.ok(content.includes("useCustomersMutations"), "Customer creation must be wired in");
  assert.ok(content.includes("useCarBrandsQuery"), "Car brand options must come from backend");
  assert.ok(content.includes("useVehicleCatalogQuery"), "Model options must come from local JSON");
  assert.ok(content.includes("buildIntakePayload"), "Submit must use the payload builder");
  assert.ok(!content.includes("const carBrands = ["), "Hardcoded brand list must be removed");
  assert.ok(!content.includes("const carModels = ["), "Hardcoded model list must be removed");
  assert.ok(catalogQueryContent.includes("fetchIntakeVehicleCatalog"), "Vehicle catalog query must exist");
  assert.ok(catalogApiContent.includes("intakeVehicleCatalog.json"), "Model options must come from local JSON");
});
