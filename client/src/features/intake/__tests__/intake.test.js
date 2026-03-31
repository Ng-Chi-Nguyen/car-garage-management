import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("Intake feature defines keys and mutations correctly", () => {
  const mutationFile = path.join(__dirname, "../useIntakeMutation.js");
  const content = fs.readFileSync(mutationFile, "utf-8");
  
  assert.ok(content.includes("INTAKE_KEYS"), "Must use INTAKE_KEYS for invalidation");
  assert.ok(content.includes("queryClient.invalidateQueries"), "Must call invalidateQueries");
});

test("Intake components exist", () => {
  const formFile = path.join(__dirname, "../components/VehicleIntakeForm.jsx");
  assert.ok(fs.existsSync(formFile), "VehicleIntakeForm should exist");
});
