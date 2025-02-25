"use server";

import prisma from "@/lib/prisma";

export async function getServices() {
  return await prisma.service.findMany({
    select: {
      id: true,
      name: true,
      duration: true,
    },
  });
}
