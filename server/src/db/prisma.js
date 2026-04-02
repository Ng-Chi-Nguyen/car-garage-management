try {
  await import("dotenv/config");
} catch (error) {
  if (error?.code !== "ERR_MODULE_NOT_FOUND") {
    throw error;
  }
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to initialize Prisma client.");
}

const buildDatabaseUrlWithSafePoolParams = (rawUrl) => {
  const parsed = new URL(rawUrl);

  if (!parsed.searchParams.has("connectTimeout")) {
    parsed.searchParams.set("connectTimeout", "5000");
  }

  if (!parsed.searchParams.has("acquireTimeout")) {
    parsed.searchParams.set("acquireTimeout", "5000");
  }

  if (!parsed.searchParams.has("connectionLimit")) {
    parsed.searchParams.set("connectionLimit", "10");
  }

  return parsed.toString();
};

const createPrismaFallback = () =>
  new Proxy(
    {},
    {
      get: (_, property) => {
        if (property === "$connect") {
          return async () => {};
        }

        if (property === "$queryRawUnsafe") {
          return async () => null;
        }

        return () => {
          throw new Error(`Prisma client is unavailable for ${String(property)}.`);
        };
      },
    },
  );

let prisma = createPrismaFallback();

try {
  const [{ PrismaMariaDb }, prismaClientPkg] = await Promise.all([
    import("@prisma/adapter-mariadb"),
    import("@prisma/client"),
  ]);
  const { PrismaClient } = prismaClientPkg;
  const adapter = new PrismaMariaDb(buildDatabaseUrlWithSafePoolParams(databaseUrl));
  prisma = new PrismaClient({ adapter });
} catch (error) {
  if (error?.code !== "ERR_MODULE_NOT_FOUND") {
    throw error;
  }
}

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
