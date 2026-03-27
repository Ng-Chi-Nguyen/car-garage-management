import "dotenv/config";

import { defineConfig } from "prisma/config";

const runtime = globalThis as typeof globalThis & {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: runtime.process?.env?.DATABASE_URL ?? "",
  },
});
