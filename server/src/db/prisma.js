import "dotenv/config";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to initialize Prisma client.");
}

const adapter = new PrismaMariaDb(databaseUrl);
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
