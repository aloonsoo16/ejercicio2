import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { serviceId } = params;
  const { name, startTime, email } = await req.json();

  if (!serviceId || !name || !email || !startTime) {
    return NextResponse.json(
      {
        success: false,
        message: "Faltan datos obligatorios",
      },
      { status: 400 }
    );
  }

  try {
    const startDateTime = new Date(startTime);

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({ data: { name, email } });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { duration: true },
    });

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Servicio no encontrado",
        },
        { status: 404 }
      );
    }

    const endDateTime = new Date(
      startDateTime.getTime() + service.duration * 60000
    );

    const userConflict = await prisma.reservation.findFirst({
      where: {
        userId: user.id,
        OR: [
          { startTime: { lte: endDateTime }, endTime: { gte: startDateTime } },
        ],
      },
    });

    if (userConflict) {
      return NextResponse.json(
        {
          success: false,
          message: "El usuario ya tiene otra reserva en este horario",
        },
        { status: 400 }
      );
    }

    const serviceConflict = await prisma.reservation.findFirst({
      where: {
        serviceId,
        OR: [
          { startTime: { lte: endDateTime }, endTime: { gte: startDateTime } },
        ],
      },
    });

    if (serviceConflict) {
      return NextResponse.json(
        {
          success: false,
          message: "Ya hay una reserva para este servicio en este horario",
        },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId: user.id,
        serviceId,
        name,
        email,
        startTime: startDateTime,
        endTime: endDateTime,
      },
    });

    return NextResponse.json(
      { success: true, message: "Reserva creada con exito", reservation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear la reserva", error);
    return NextResponse.json(
      { success: false, message: "Error interno en el servidor" },
      { status: 500 }
    );
  }
}
