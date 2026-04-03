import { test } from "node:test";
import assert from "node:assert";
import { SETTINGS_KEYS } from "../settings.queryKeys.js";

globalThis.localStorage ??= {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const { default: axiosClient } = await import("../../../lib/axiosClient.js");
axiosClient.get = async (url) => {
  if (url === "/api/v1/settings/parameters") {
    return { data: { data: { parameters: { maxCarsPerDay: 20, materialProfitMargin: 15 } } } };
  }
  if (url === "/api/v1/settings/service-prices") {
    return { data: { data: { servicePrices: [{ id: 1, name: "Bảo dưỡng", duration: 60, price: 250000 }] } } };
  }
  throw new Error(`Unexpected request: ${url}`);
};

const { fetchSystemParameters, fetchServicePrices } = await import("../settings.api.js");

test("Settings Query Keys Contract", () => {
  assert.deepEqual(SETTINGS_KEYS.all, ["settings"]);
  assert.deepEqual(SETTINGS_KEYS.parameters(), ["settings", "parameters"]);
  assert.deepEqual(SETTINGS_KEYS.servicePrices(), ["settings", "servicePrices"]);
  assert.deepEqual(SETTINGS_KEYS.carBrands(), ["settings", "carBrands"]);
});

test("Settings API Contract", async () => {
  const params = await fetchSystemParameters();
  assert.ok(params.maxCarsPerDay !== undefined);
  assert.equal(typeof params.maxCarsPerDay, "number");
  assert.equal(typeof params.materialProfitMargin, "number");
  
  const prices = await fetchServicePrices();
  assert.ok(Array.isArray(prices));
  assert.ok(prices.length > 0);
  assert.equal(typeof prices[0].id, "number");
  assert.equal(typeof prices[0].name, "string");
  assert.equal(typeof prices[0].price, "number");
});
