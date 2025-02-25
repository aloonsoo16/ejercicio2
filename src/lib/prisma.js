import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

const globalForPrisma = global;

globalForPrisma.prismaGlobal = globalForPrisma.prismaGlobal || prismaClientSingleton();

const prisma = globalForPrisma.prismaGlobal;

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prismaGlobal = prisma;