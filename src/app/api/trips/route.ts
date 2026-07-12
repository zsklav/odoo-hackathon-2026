import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "@/generated/prisma/client";
import { TripStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth/jwt";
import { createOrganizationNotification } from "@/lib/notifications";

const VEHICLE_SUMMARY = {
  select: { id: true, registrationNumber: true, name: true, maxLoadCapacity: true, status: true },
} as const;
const DRIVER_SUMMARY = {
  select: { id: true, name: true, licenseNumber: true, status: true },
} as const;

async function requireSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  return user;
}

export async function GET(request: Request) {
  const user = await requireSession();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const vehicleId = searchParams.get("vehicleId");
  const driverId = searchParams.get("driverId");

  const where: Prisma.TripWhereInput = {};
  if (
    status &&
    Object.values(TripStatus).includes(status as (typeof TripStatus)[keyof typeof TripStatus])
  ) {
    where.status = status as (typeof TripStatus)[keyof typeof TripStatus];
  }
  if (vehicleId) where.vehicleId = vehicleId;
  if (driverId) where.driverId = driverId;

  const trips = await prisma.trip.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { vehicle: VEHICLE_SUMMARY, driver: DRIVER_SUMMARY },
  });

  return NextResponse.json(trips);
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

  const { source, destination, vehicleId, driverId, cargoWeight, plannedDistance } =
    body as Record<string, unknown>;

  if (typeof source !== "string" || !source.trim()) {
    return NextResponse.json({ error: "Source is required." }, { status: 400 });
  }
  if (typeof destination !== "string" || !destination.trim()) {
    return NextResponse.json({ error: "Destination is required." }, { status: 400 });
  }
  if (typeof vehicleId !== "string" || !vehicleId.trim()) {
    return NextResponse.json({ error: "A vehicle must be selected." }, { status: 400 });
  }
  if (typeof driverId !== "string" || !driverId.trim()) {
    return NextResponse.json({ error: "A driver must be selected." }, { status: 400 });
  }
  if (typeof cargoWeight !== "number" || !Number.isFinite(cargoWeight) || cargoWeight <= 0) {
    return NextResponse.json({ error: "Cargo weight must be a positive number." }, { status: 400 });
  }
  if (typeof plannedDistance !== "number" || !Number.isFinite(plannedDistance) || plannedDistance <= 0) {
    return NextResponse.json(
      { error: "Planned distance must be a positive number." },
      { status: 400 }
    );
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) {
    return NextResponse.json({ error: "Selected vehicle does not exist." }, { status: 400 });
  }
  const driver = await prisma.driver.findUnique({ where: { id: driverId } });
  if (!driver) {
    return NextResponse.json({ error: "Selected driver does not exist." }, { status: 400 });
  }

  // Core business rule: cargo cannot exceed the vehicle's load capacity.
  if (cargoWeight > vehicle.maxLoadCapacity) {
    return NextResponse.json(
      {
        error: `Cargo weight (${cargoWeight}) exceeds the vehicle's capacity (${vehicle.maxLoadCapacity}).`,
      },
      { status: 400 }
    );
  }

  const trip = await prisma.trip.create({
    data: {
      source,
      destination,
      vehicleId,
      driverId,
      cargoWeight,
      plannedDistance,
      createdById: user.id,
    },
    include: { vehicle: VEHICLE_SUMMARY, driver: DRIVER_SUMMARY },
  });

  await createOrganizationNotification({
    actorId: user.id,
    type: "trip",
    title: "Trip scheduled",
    message: `A trip from ${trip.source} to ${trip.destination} was scheduled.`,
  });

  return NextResponse.json(trip, { status: 201 });
}
