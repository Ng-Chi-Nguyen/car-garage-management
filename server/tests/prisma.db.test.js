import test from "node:test";
import assert from "node:assert/strict";

const loadPrismaModule = async () => {
  const moduleUrl = new URL(`../src/db/prisma.js?test=${Date.now()}`, import.meta.url);
  return import(moduleUrl.href);
};

test("prisma module khoi tao duoc client khi co DATABASE_URL", async () => {
  const previousDatabaseUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = "mysql://root:@localhost:3306/garage_db";

  try {
    const prismaModule = await loadPrismaModule();

    assert.equal(typeof prismaModule.connectDB, "function");
    assert.ok(prismaModule.default);
  } finally {
    if (previousDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = previousDatabaseUrl;
    }
  }
});
