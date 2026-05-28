import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function makeClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "";
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: url }),
  });
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma = global.prismaGlobal ?? makeClient();

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}
