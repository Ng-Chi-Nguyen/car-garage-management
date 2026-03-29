import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import jwt from "jsonwebtoken";
import authMiddleware from "../src/middleware/auth/auth.middleware.js";
import {
  loadCreateDashboardRoute,
  stopTestServer,
} from "./helpers/dashboard.test-helpers.js";

const managementRoles = ["Admin", "NhanVien"];

const startProtectedDashboardServer = async (router) => {
  const app = express();
  app.use(express.json());
  app.use(
    "/api/v1/dashboard",
    authMiddleware.requireAuth,
    authMiddleware.requireRoles(managementRoles),
    router,
  );

  return await new Promise((resolve) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${port}`,
      });
    });
  });
};

test(
  "dashboard route tra 401 khi thieu token o index-level auth wrapper",
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

  const { server, baseUrl } = await startProtectedDashboardServer(router);

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
  "dashboard route tra 403 khi role sai o index-level role guard",
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
    const { server, baseUrl } = await startProtectedDashboardServer(router);

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
