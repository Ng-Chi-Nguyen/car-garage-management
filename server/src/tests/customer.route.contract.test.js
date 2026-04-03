import express from "express";
import test from "node:test";
import assert from "node:assert/strict";

const loadCreateCustomerRoute = async () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
  const module = await import("../routes/management/customer.route.js");
  return module.createCustomerRoute;
};

const startTestServer = async (router) => {
  const app = express();
  app.use(express.json());
  app.use("/api/v1/customers", router);

  return await new Promise((resolve) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
};

const stopTestServer = async (server) =>
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });

test("customer route stats is matched before byId", async () => {
  const createCustomerRoute = await loadCreateCustomerRoute();
  const calls = [];

  const router = createCustomerRoute({
    controller: {
      getCustomerStats: async (req, res) => {
        calls.push("stats");
        return res.status(200).json({ success: true, data: { stats: { totalCustomers: 1, vipCustomers: 0, totalOutstandingDebt: 0, monthlyRepairOrders: 0 } } });
      },
      getCustomerById: async (req, res) => {
        calls.push("byId");
        return res.status(200).json({ success: true, data: { customer: { MaKH: Number(req.params.id) } } });
      },
      getCustomerList: async (req, res) => res.status(200).json({ success: true, data: { customers: [], pagination: {} } }),
      createCustomer: async (req, res) => res.status(200).json({ success: true, data: { customer: {} } }),
      updateCustomer: async (req, res) => res.status(200).json({ success: true, data: { customer: {} } }),
      deleteCustomer: async (req, res) => res.status(200).json({ success: true, data: { customer: {} } }),
    },
    schema: {
      stats: {
        query: {
          validate(query) {
            return { error: undefined, value: query };
          },
        },
      },
    },
  });

  const { server, baseUrl } = await startTestServer(router);

  try {
    const statsResponse = await fetch(`${baseUrl}/api/v1/customers/stats`);
    const statsPayload = await statsResponse.json();
    const byIdResponse = await fetch(`${baseUrl}/api/v1/customers/123`);
    const byIdPayload = await byIdResponse.json();

    assert.equal(statsResponse.status, 200);
    assert.equal(statsPayload.success, true);
    assert.equal(byIdResponse.status, 200);
    assert.equal(byIdPayload.data.customer.MaKH, 123);
    assert.deepEqual(calls, ["stats", "byId"]);
  } finally {
    await stopTestServer(server);
  }
});
