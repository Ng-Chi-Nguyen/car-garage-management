import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("Finance feature defines keys and mutations correctly", () => {
  const mutationFile = path.join(__dirname, "../useFinanceMutation.js");
  const content = fs.readFileSync(mutationFile, "utf-8");
  
  assert.ok(content.includes("FINANCE_KEYS"), "Must use FINANCE_KEYS for invalidation");
  assert.ok(content.includes("queryClient.invalidateQueries"), "Must call invalidateQueries");
});

test("Finance components exist", () => {
  const formFile = path.join(__dirname, "../components/ReceivablesForm.jsx");
  assert.ok(fs.existsSync(formFile), "ReceivablesForm should exist");

  const invoiceFile = path.join(__dirname, "../components/SettlementInvoice.jsx");
  assert.ok(fs.existsSync(invoiceFile), "SettlementInvoice should exist");
});
