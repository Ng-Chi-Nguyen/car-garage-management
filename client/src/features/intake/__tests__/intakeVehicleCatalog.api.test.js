import { test } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchIntakeVehicleCatalog } from "../intakeVehicleCatalog.api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fallbackCatalog = JSON.parse(fs.readFileSync(path.join(__dirname, "../intakeVehicleCatalog.json"), "utf-8"));

test("fetchIntakeVehicleCatalog success path: loads /data/car_data.json and normalizes to brand->models map", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (url === "/data/car_data.json") {
      return {
        ok: true,
        json: async () => ({
          brands: {
            " Toyota ": ["Camry", "Corolla", "Camry"],
            "Honda": ["Civic", " ", null]
          },
          "Empty": [],
          "Invalid": "not an array"
        })
      };
    }
    throw new Error(`Unexpected URL fetch: ${url}`);
  };

  try {
    const catalog = await fetchIntakeVehicleCatalog();
    assert.deepStrictEqual(catalog, {
      Toyota: ["Camry", "Corolla"],
      Honda: ["Civic"]
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("fetchIntakeVehicleCatalog failure path: falls back to local JSON on fetch error", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("Network offline");
  };

  try {
    const catalog = await fetchIntakeVehicleCatalog();
    assert.deepStrictEqual(catalog, fallbackCatalog);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
