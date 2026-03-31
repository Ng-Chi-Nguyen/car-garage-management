import { test } from "node:test";
import assert from "node:assert";
import { SETTINGS_KEYS } from "../settings.queryKeys.js";
import { fetchSystemParameters, fetchServicePrices } from "../settings.api.js";

test("Settings Query Keys Contract", () => {
  assert.deepEqual(SETTINGS_KEYS.all, ["settings"]);
  assert.deepEqual(SETTINGS_KEYS.parameters(), ["settings", "parameters"]);
  assert.deepEqual(SETTINGS_KEYS.servicePrices(), ["settings", "servicePrices"]);
  assert.deepEqual(SETTINGS_KEYS.carBrands(), ["settings", "carBrands"]);
});

test("Settings API Contract", async () => {
  const params = await fetchSystemParameters();
  assert.ok(params.maxCarsPerDay !== undefined);
  
  const prices = await fetchServicePrices();
  assert.ok(Array.isArray(prices));
});
