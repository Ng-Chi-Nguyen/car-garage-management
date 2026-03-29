import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import {
  loadCreateDashboardRoute,
  startTestServer,
  stopTestServer,
} from "./helpers/dashboard.test-helpers.js";

test(
  "default dashboard route tra 401 khi thieu token",
  { concurrency: false },
  async () => {
  const createDashboardRoute = await loadCreateDashboardRoute();
  let controllerCalled = false;

  const router = createDashboardRoute({
    controller: {
      getRevenueSummary: async (req, res) => {
        controllerCalled = true;
        return res.status(200).json({
          success: true,
          data: {
            summary: {},
          },
        });
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);

  try {
    const response = await fetch(`${baseUrl}/api/v1/dashboard/revenue-summary`);

    assert.equal(response.status, 401);
    assert.equal(controllerCalled, false);
  } finally {
    await stopTestServer(server);
  }
  },
);

test(
  "default dashboard route tra 403 khi role sai",
  { concurrency: false },
  async () => {
  const originalJwtSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "test-secret";
  try {
    const createDashboardRoute = await loadCreateDashboardRoute();
    let controllerCalled = false;

    const router = createDashboardRoute({
      controller: {
        getRevenueSummary: async (req, res) => {
          controllerCalled = true;
          return res.status(200).json({
            success: true,
            data: {
              summary: {},
            },
          });
        },
      },
    });

    const token = jwt.sign(
      { MaNV: 7, ChucVu: "KhachHang" },
      process.env.JWT_SECRET,
    );
    const { server, baseUrl } = await startTestServer(router);

    try {
      const response = await fetch(`${baseUrl}/api/v1/dashboard/revenue-summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      assert.equal(response.status, 403);
      assert.equal(controllerCalled, false);
    } finally {
      await stopTestServer(server);
    }
  } finally {
    if (originalJwtSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalJwtSecret;
    }
  }
  },
);
