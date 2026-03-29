import express from "express";

const ensureTestDatabaseUrl = () => {
  process.env.DATABASE_URL ??= "mysql://tester:secret@127.0.0.1:3306/garage_test";
};

const loadCreateRepairReportRoute = async () => {
  ensureTestDatabaseUrl();
  const module = await import("../../src/routes/report/repairReport.route.js");
  return module.createRepairReportRoute;
};

const startTestServer = async (router) => {
  const app = express();
  app.use(express.json());
  app.use("/api/v1/reports/repair-report", router);

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

const stopTestServer = async (server) =>
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });

export {
  ensureTestDatabaseUrl,
  loadCreateRepairReportRoute,
  startTestServer,
  stopTestServer,
};
