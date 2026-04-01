import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import axiosClient from "../../../lib/axiosClient.js";
import { fetchReceivables, fetchFinanceSummary } from "../finance.api.js";
import { applyReceivablesSearchParams } from "../receivablesSearchParams.js";

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

test("fetchReceivables maps search with precedence over q at runtime", async () => {
  const originalGet = axiosClient.get;
  const calls = [];
  axiosClient.get = async (...args) => {
    calls.push(args);
    return { data: { data: { items: [] } } };
  };

  try {
    await fetchReceivables({ search: "canon", q: "legacy", page: 2, pageSize: 15 });
    await fetchReceivables({ q: "legacy-only" });

    assert.equal(calls.length, 2);
    assert.equal(calls[0][1].params.search, "canon", "search must override q");
    assert.equal(calls[1][1].params.search, "legacy-only", "q fallback must work");
  } finally {
    axiosClient.get = originalGet;
  }
});

test("fetchFinanceSummary throws exact error when required params are missing", async () => {
  const originalGet = axiosClient.get;
  let getCalled = false;
  axiosClient.get = async () => {
    getCalled = true;
    return { data: { data: {} } };
  };

  try {
    await assert.rejects(
      () => fetchFinanceSummary({ from: "2026-01-01", to: "2026-01-31" }),
      /Missing required params: from,to,granularity/
    );
    assert.equal(getCalled, false, "axiosClient.get must not be called when guard fails");
  } finally {
    axiosClient.get = originalGet;
  }
});

test("fetchFinanceSummary calls API when params are valid", async () => {
  const originalGet = axiosClient.get;
  const calls = [];
  axiosClient.get = async (...args) => {
    calls.push(args);
    return { data: { data: { totalOutstandingDebt: 0 } } };
  };

  try {
    await fetchFinanceSummary({ from: "2026-01-01", to: "2026-01-31", granularity: "day" });
    assert.equal(calls.length, 1);
    assert.equal(calls[0][0], "/api/v1/reports/finance/summary");
    assert.equal(calls[0][1].params.granularity, "day");
  } finally {
    axiosClient.get = originalGet;
  }
});

test("Receivables URL normalization helper enforces canonical search and clears q", () => {
  const initial = new URLSearchParams("q=old&page=9");
  const withValue = applyReceivablesSearchParams(initial, "new-keyword");
  assert.equal(withValue.get("search"), "new-keyword");
  assert.equal(withValue.get("q"), null);
  assert.equal(withValue.get("page"), "1");

  const cleared = applyReceivablesSearchParams(withValue, "");
  assert.equal(cleared.get("search"), null);
  assert.equal(cleared.get("q"), null);
  assert.equal(cleared.get("page"), "1");
});
