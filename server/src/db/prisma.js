import "dotenv/config";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to initialize Prisma client.");
}

const buildDatabaseUrlWithSafePoolParams = (rawUrl) => {
  const parsed = new URL(rawUrl);

  if (!parsed.searchParams.has("connectTimeout")) {
    parsed.searchParams.set("connectTimeout", "60000");
  }

  if (!parsed.searchParams.has("acquireTimeout")) {
    parsed.searchParams.set("acquireTimeout", "60000");
  }

  if (!parsed.searchParams.has("connectionLimit")) {
    parsed.searchParams.set("connectionLimit", "10");
  }

  return parsed.toString();
};

const adapter = new PrismaMariaDb(buildDatabaseUrlWithSafePoolParams(databaseUrl));
const prisma = new PrismaClient({ adapter });

export async function connectDB() {
  try {
    await prisma.$connect();
    await prisma.$queryRawUnsafe("SELECT 1");
    console.log("Database: Đã kết nối thành công với MySQL!");
  } catch (error) {
    console.error("Database: LỖI KẾT NỐI CSDL:", error.message);
  }
}

export default prisma;
