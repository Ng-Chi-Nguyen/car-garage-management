import "dotenv/config";
import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const execFileAsync = promisify(execFile);
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(currentDir, "..");

const parseMysqlUrl = (databaseUrl) => {
  const parsedUrl = new URL(databaseUrl);

  assert.equal(parsedUrl.protocol, "mysql:", "DATABASE_URL phải dùng giao thức mysql://");

  return {
    host: parsedUrl.hostname || "127.0.0.1",
    port: Number(parsedUrl.port || 3306),
    user: decodeURIComponent(parsedUrl.username),
    password: decodeURIComponent(parsedUrl.password),
    database: parsedUrl.pathname.replace(/^\//, ""),
  };
};

const buildDatabaseUrl = (databaseUrl, databaseName) => {
  const parsedUrl = new URL(databaseUrl);
  parsedUrl.pathname = `/${databaseName}`;
  return parsedUrl.toString();
};

const runPrismaMigrateDeploy = async (databaseUrl) => {
  const sharedOptions = {
    cwd: serverRoot,
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
    },
    timeout: 120000,
  };

  if (process.platform === "win32") {
    return execFileAsync("cmd.exe", ["/d", "/s", "/c", "npm exec prisma migrate deploy"], sharedOptions);
  }

  return execFileAsync("npm", ["exec", "prisma", "migrate", "deploy"], sharedOptions);
};

const assertCurrentSchemaApplied = async (adminConnection, databaseName) => {
  const [tables] = await adminConnection.query(
    `SELECT TABLE_NAME
     FROM information_schema.tables
     WHERE table_schema = ?
       AND TABLE_NAME IN ('KHACH_HANG', 'HIEU_XE', 'XE')`,
    [databaseName],
  );

  assert.equal(tables.length, 3, "Thiếu bảng cốt lõi sau khi migrate deploy");

  const [customerColumns] = await adminConnection.query(
    `SELECT COLUMN_NAME
     FROM information_schema.columns
     WHERE table_schema = ?
       AND table_name = 'KHACH_HANG'
       AND COLUMN_NAME IN ('TokenDatLaiMatKhau', 'TokenDatLaiMatKhauHetHanLuc', 'TokenDatLaiMatKhauDaDungLuc')`,
    [databaseName],
  );

  assert.equal(customerColumns.length, 3, "Thiếu cột reset password trên bảng KHACH_HANG");

  const [brandLogoColumn] = await adminConnection.query(
    `SELECT COLUMN_NAME
     FROM information_schema.columns
     WHERE table_schema = ?
       AND table_name = 'HIEU_XE'
       AND COLUMN_NAME = 'Logo'`,
    [databaseName],
  );

  assert.equal(brandLogoColumn.length, 1, "Thiếu cột Logo trên bảng HIEU_XE");
};

test("prisma migrate deploy khoi tao duoc schema tren database MySQL sach", async (t) => {
  if (!process.env.DATABASE_URL) {
    t.skip("Thiếu DATABASE_URL để chạy integration test Prisma migrate");
    return;
  }

  const adminConnectionConfig = parseMysqlUrl(process.env.DATABASE_URL);
  const temporaryDatabase = `garage_migrate_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
  const adminConnection = await mysql.createConnection({
    host: adminConnectionConfig.host,
    port: adminConnectionConfig.port,
    user: adminConnectionConfig.user,
    password: adminConnectionConfig.password,
  });

  try {
    await adminConnection.query(
      `CREATE DATABASE \`${temporaryDatabase}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );

    try {
      await runPrismaMigrateDeploy(buildDatabaseUrl(process.env.DATABASE_URL, temporaryDatabase));
    } catch (error) {
      const stdout = error.stdout ?? "";
      const stderr = error.stderr ?? "";
      const details = error.message ?? String(error);
      assert.fail(`prisma migrate deploy failed\nERROR:\n${details}\nSTDOUT:\n${stdout}\nSTDERR:\n${stderr}`);
    }

    await assertCurrentSchemaApplied(adminConnection, temporaryDatabase);
  } finally {
    await adminConnection.query(`DROP DATABASE IF EXISTS \`${temporaryDatabase}\``);
    await adminConnection.end();
  }
});

test("prisma migrate deploy van chay duoc khi database da co schema va thieu ban ghi migration init", async (t) => {
  if (!process.env.DATABASE_URL) {
    t.skip("Thiếu DATABASE_URL để chạy integration test Prisma migrate");
    return;
  }

  const adminConnectionConfig = parseMysqlUrl(process.env.DATABASE_URL);
  const temporaryDatabase = `garage_migrate_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
  const adminConnection = await mysql.createConnection({
    host: adminConnectionConfig.host,
    port: adminConnectionConfig.port,
    user: adminConnectionConfig.user,
    password: adminConnectionConfig.password,
  });

  try {
    await adminConnection.query(
      `CREATE DATABASE \`${temporaryDatabase}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );

    const temporaryDatabaseUrl = buildDatabaseUrl(process.env.DATABASE_URL, temporaryDatabase);
    await runPrismaMigrateDeploy(temporaryDatabaseUrl);

    await adminConnection.query(
      `DELETE FROM \`${temporaryDatabase}\`._prisma_migrations WHERE migration_name = '20260320120000_init_schema'`,
    );

    try {
      await runPrismaMigrateDeploy(temporaryDatabaseUrl);
    } catch (error) {
      const stdout = error.stdout ?? "";
      const stderr = error.stderr ?? "";
      const details = error.message ?? String(error);
      assert.fail(`prisma migrate deploy failed khi migration init bi thieu ban ghi\nERROR:\n${details}\nSTDOUT:\n${stdout}\nSTDERR:\n${stderr}`);
    }

    await assertCurrentSchemaApplied(adminConnection, temporaryDatabase);
  } finally {
    await adminConnection.query(`DROP DATABASE IF EXISTS \`${temporaryDatabase}\``);
    await adminConnection.end();
  }
});
