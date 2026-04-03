import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildIntakePayload } from "../intakePayloadBuilder.js";
import { submitIntakeFlow } from "../intakeSubmissionFlow.js";

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
  const flowFile = path.join(__dirname, "../intakeSubmissionFlow.js");
  const catalogQueryFile = path.join(__dirname, "../useVehicleCatalogQuery.js");
  const catalogApiFile = path.join(__dirname, "../intakeVehicleCatalog.api.js");
  const content = fs.readFileSync(formFile, "utf-8");
  const flowContent = fs.readFileSync(flowFile, "utf-8");
  const catalogQueryContent = fs.readFileSync(catalogQueryFile, "utf-8");
  const catalogApiContent = fs.readFileSync(catalogApiFile, "utf-8");

  assert.ok(fs.existsSync(formFile), "VehicleIntakeForm should exist");
  assert.ok(content.includes("submitIntakeFlow"), "Submit must use the intake submission flow");
  assert.ok(flowContent.indexOf("const vehicle = await resolveVehicleByPlate") < flowContent.indexOf("createCustomer.mutateAsync"), "Vehicle must resolve before customer creation");
  assert.ok(content.includes("useCustomersQuery"), "Customer search must be wired in");
  assert.ok(content.includes("useCustomersMutations"), "Customer creation must be wired in");
  assert.ok(content.includes("useCarBrandsQuery"), "Car brand options must come from backend");
  assert.ok(content.includes("useVehicleCatalogQuery"), "Model options must come from local JSON");
  assert.ok(flowContent.includes("buildIntakePayload"), "Submit flow must use the payload builder");
  assert.ok(!content.includes("const carBrands = ["), "Hardcoded brand list must be removed");
  assert.ok(!content.includes("const carModels = ["), "Hardcoded model list must be removed");
  assert.ok(!content.includes("clean("), "Undefined clean function must be removed");
  assert.ok(content.includes("?.trim()"), "Search input should be sanitized locally");
  assert.ok(catalogQueryContent.includes("fetchIntakeVehicleCatalog"), "Vehicle catalog query must exist");
  assert.ok(catalogApiContent.includes("intakeVehicleCatalog.json"), "Model options must come from local JSON");
});

test("submitIntakeFlow does not create customer when vehicle resolve fails", async () => {
  let createCustomerCalls = 0;

  await assert.rejects(
    submitIntakeFlow({
      form: { licensePlate: "51G-123.45", note: "", ownerName: "", phone: "", address: "" },
      selectedQuickTags: ["Xước nhẹ"],
      selectedCustomer: null,
      resolveVehicleByPlate: async () => {
        throw new Error("Không tìm thấy xe.");
      },
      createCustomer: {
        mutateAsync: async () => {
          createCustomerCalls += 1;
          return { MaKH: 1 };
        },
      },
      createIntakeMutation: {
        mutateAsync: async () => {
          throw new Error("should not reach intake creation");
        },
      },
      setSelectedCustomer: () => {},
      buildPayload: () => ({}),
    }),
    /Không tìm thấy xe\./,
  );

  assert.equal(createCustomerCalls, 0);
});
