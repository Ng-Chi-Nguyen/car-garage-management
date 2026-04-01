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
  assert.ok(content.includes("FINANCE_KEYS.history()"), "Must invalidate history key");
});

test("Finance query keys include history correctly", async () => {
  const keysFile = path.join(__dirname, "../finance.queryKeys.js");
  const content = fs.readFileSync(keysFile, "utf-8");
  assert.ok(content.includes("history: (filters) =>"), "Must have history key helper");
});

test("Finance api includes hardened fetchReceiptHistory", async () => {
  const apiFile = path.join(__dirname, "../finance.api.js");
  const content = fs.readFileSync(apiFile, "utf-8");
  assert.ok(content.includes("fetchReceiptHistory"), "Must export fetchReceiptHistory");
  assert.ok(content.includes("allowedParams"), "Must harden params by whitelisting");
});

test("Finance components exist", () => {
  const formFile = path.join(__dirname, "../components/ReceivablesForm.jsx");
  assert.ok(fs.existsSync(formFile), "ReceivablesForm should exist");

  const invoiceFile = path.join(__dirname, "../components/SettlementInvoice.jsx");
  assert.ok(fs.existsSync(invoiceFile), "SettlementInvoice should exist");
});

test("ReceivablesForm uses URL for state truth", () => {
  const formFile = path.join(__dirname, "../components/ReceivablesForm.jsx");
  const content = fs.readFileSync(formFile, "utf-8");
  assert.ok(content.includes('searchParams.get("vehicleId")'), "Must read vehicleId from URL");
  assert.ok(content.includes('setSearchParams('), "Must update searchParams on vehicle select");
  assert.ok(!content.includes('const [selectedVehicle, setSelectedVehicle] = useState(null)'), "Should not use useState for selected vehicle");
  assert.ok(content.includes("ReceiptHistoryPanel"), "Must use ReceiptHistoryPanel component");
});

test("Receivables query compatibility prefers search and falls back to q", () => {
  const apiFile = path.join(__dirname, "../finance.api.js");
  const content = fs.readFileSync(apiFile, "utf-8");
  assert.ok(content.includes("search: params.search || params.q ||"), "Must prefer params.search over params.q");
});

test("Receivables form emits search deterministically", () => {
  const formFile = path.join(__dirname, "../components/ReceivablesForm.jsx");
  const content = fs.readFileSync(formFile, "utf-8");
  assert.ok(content.includes("searchParams.get(\"search\") || searchParams.get(\"q\")"), "Must read both search and q");
  assert.ok(content.includes("prev.set('search', e.target.value)"), "Must emit search to URL");
  assert.ok(content.includes("prev.delete('q')"), "Must cleanup q from URL");
});

test("fetchFinanceSummary guard contract asserts exactly", () => {
  const apiFile = path.join(__dirname, "../finance.api.js");
  const apiContent = fs.readFileSync(apiFile, "utf-8");
  
  assert.ok(apiContent.includes('!params.from'), "Must check from param");
  assert.ok(apiContent.includes('!params.to'), "Must check to param");
  assert.ok(apiContent.includes('!params.granularity'), "Must check granularity param");
  assert.ok(apiContent.includes('throw new Error("Missing required params: from,to,granularity")'), "Must throw exact error message");
});
