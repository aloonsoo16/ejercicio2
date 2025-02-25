"use server";

import prisma from "@/lib/prisma";

export async function getAllBookings() {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        user: true,
        service: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return reservations;
  } catch (error) {
    console.error("Error al obtener las reservas", error);
    throw new Error("No se han podido obtener las reservas");
  }
}
