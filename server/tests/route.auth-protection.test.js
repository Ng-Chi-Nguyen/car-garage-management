import test from "node:test";
import assert from "node:assert/strict";

import Routes from "../src/routes/index.route.js";

test("Routes mount auth route riêng và bảo vệ toàn bộ route management", () => {
  const calls = [];
  const app = {
    use(...args) {
      calls.push(args);
    },
  };

  Routes(app);

  const authCall = calls.find(([path]) => path === "/api/v1/auth");
  assert.ok(authCall, "auth route should be mounted");
  assert.equal(authCall.length, 2, "auth route should not be wrapped by management role middleware");

  const protectedManagementPaths = [
    "/api/v1/customers",
    "/api/v1/car-brands",
    "/api/v1/vehicles",
    "/api/v1/repair-orders",
    "/api/v1/labor-fees",
    "/api/v1/parts",
    "/api/v1/repair-order-details",
    "/api/v1/suppliers",
    "/api/v1/stock-receipts",
    "/api/v1/stock-receipt-details",
    "/api/v1/payment-receipts",
  ];

  for (const path of protectedManagementPaths) {
    const routeCall = calls.find(([routePath]) => routePath === path);
    assert.ok(routeCall, `${path} should be mounted`);
    assert.equal(routeCall.length, 4, `${path} should include auth and role middleware before router`);
  }
});
