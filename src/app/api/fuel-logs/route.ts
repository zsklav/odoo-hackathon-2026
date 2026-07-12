import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth/jwt";
import { createOrganizationNotification } from "@/lib/notifications";

const VEHICLE_SUMMARY = {
  select: { id: true, registrationNumber: true, name: true, region: true, status: true },
} as const;

async function requireSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload) return null;
  return prisma.user.findUnique({ where: { id: payload.userId } });
}

function parseDate(value: unknown) {
  if (value === undefined) return undefined;
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function GET(request: Request) {
  const user = await requireSession();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get("vehicleId");

  const where: Prisma.FuelLogWhereInput = {};
  if (vehicleId) where.vehicleId = vehicleId;

  const fuelLogs = await prisma.fuelLog.findMany({
    where,
    orderBy: { date: "desc" },
    include: { vehicle: VEHICLE_SUMMARY },
  });

  return NextResponse.json(fuelLogs);
}

export async function POST(request: Request) {
  const user = await requireSession();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { vehicleId, liters, cost, date } = body as Record<string, unknown>;

  if (typeof vehicleId !== "string" || !vehicleId.trim()) {
    return NextResponse.json({ error: "A vehicle must be selected." }, { status: 400 });
  }
  if (typeof liters !== "number" || !Number.isFinite(liters) || liters <= 0) {
    return NextResponse.json({ error: "Liters must be a positive number." }, { status: 400 });
  }
  if (typeof cost !== "number" || !Number.isFinite(cost) || cost <= 0) {
    return NextResponse.json({ error: "Cost must be a positive number." }, { status: 400 });
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) {
    return NextResponse.json({ error: "Selected vehicle does not exist." }, { status: 400 });
  }

  const parsedDate = parseDate(date);
  if (parsedDate === null) {
    return NextResponse.json({ error: "Date must be a valid date." }, { status: 400 });
  }

  const fuelLog = await prisma.fuelLog.create({
    data: {
      vehicleId,
      liters,
      cost,
      ...(parsedDate ? { date: parsedDate } : {}),
    },
    include: { vehicle: VEHICLE_SUMMARY },
  });

  await createOrganizationNotification({
    actorId: user.id,
    type: "fuel",
    title: "Fuel log recorded",
    message: `${fuelLog.liters} L of fuel was recorded for ${fuelLog.vehicle.registrationNumber}.`,
  });

  return NextResponse.json(fuelLog, { status: 201 });
}
