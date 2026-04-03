import { test } from "node:test";
import assert from "node:assert";
import { resolveModelsForBrand } from "../intakeVehicleCatalog.resolve.js";

const mockCatalog = {
  Toyota: ["Camry", "Corolla"],
  Chevrolet: ["Cruze", "Malibu"],
  "Mercedes-Benz": ["C-Class", "E-Class"]
};

const mockFallback = {
  Toyota: ["Yaris"],
  Chevy: ["Spark"], // alias map scenario
  Mercedes: ["S-Class"]
};

test("resolveModelsForBrand returns exact match when brand is present in catalog", () => {
  const models = resolveModelsForBrand(mockCatalog, "Toyota", mockFallback);
  assert.deepStrictEqual(models, ["Camry", "Corolla"]);
});

test("resolveModelsForBrand returns normalized match (case-insensitive, trim) if exact match fails", () => {
  const models = resolveModelsForBrand(mockCatalog, " TOYOTA ", mockFallback);
  assert.deepStrictEqual(models, ["Camry", "Corolla"]);
});

test("resolveModelsForBrand returns alias match (e.g., Chevy -> Chevrolet, Mercedes -> Mercedes-Benz)", () => {
  const modelsChevy = resolveModelsForBrand(mockCatalog, "Chevy", mockFallback);
  assert.deepStrictEqual(modelsChevy, ["Cruze", "Malibu"]);

  const modelsMercedes = resolveModelsForBrand(mockCatalog, "Mercedes", mockFallback);
  assert.deepStrictEqual(modelsMercedes, ["C-Class", "E-Class"]);
});

test("resolveModelsForBrand returns per-brand fallback from local catalog if not found in main catalog", () => {
  // Let's say main catalog doesn't have "Chevy" or "Chevrolet", but fallback has "Chevy"
  const emptyCatalog = {};
  const models = resolveModelsForBrand(emptyCatalog, "Chevy", mockFallback);
  assert.deepStrictEqual(models, ["Spark"]);
});

test("resolveModelsForBrand returns empty array when nothing matches in catalog or fallback", () => {
  const models = resolveModelsForBrand(mockCatalog, "UnknownBrand", mockFallback);
  assert.deepStrictEqual(models, []);
});
