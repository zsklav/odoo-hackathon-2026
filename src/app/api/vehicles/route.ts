import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "@/generated/prisma/client";
import { VehicleStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth/jwt";
import { createOrganizationNotification } from "@/lib/notifications";
import { requireRole } from "@/lib/auth/roles";

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
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const region = searchParams.get("region");

  const where: Prisma.VehicleWhereInput = {};
  if (type) where.type = type;
  if (status && Object.values(VehicleStatus).includes(status as (typeof VehicleStatus)[keyof typeof VehicleStatus])) {
    where.status = status as (typeof VehicleStatus)[keyof typeof VehicleStatus];
  }
  if (region) where.region = region;

  const vehicles = await prisma.vehicle.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(vehicles);
}

export async function POST(request: Request) {
  const { user, response } = await requireRole(["FLEET_MANAGER"]); if (response) return response;

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const {
    registrationNumber,
    name,
    type,
    maxLoadCapacity,
    odometer,
    acquisitionCost,
    status,
    region,
  } = body as Record<string, unknown>;

  if (typeof registrationNumber !== "string" || !registrationNumber.trim()) {
    return NextResponse.json({ error: "Registration number is required." }, { status: 400 });
  }
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (typeof type !== "string" || !type.trim()) {
    return NextResponse.json({ error: "Type is required." }, { status: 400 });
  }
  if (typeof region !== "string" || !region.trim()) {
    return NextResponse.json({ error: "Region is required." }, { status: 400 });
  }
  if (typeof maxLoadCapacity !== "number" || !Number.isFinite(maxLoadCapacity) || maxLoadCapacity <= 0) {
    return NextResponse.json(
      { error: "Max load capacity must be a positive number." },
      { status: 400 }
    );
  }
  if (typeof acquisitionCost !== "number" || !Number.isFinite(acquisitionCost) || acquisitionCost <= 0) {
    return NextResponse.json(
      { error: "Acquisition cost must be a positive number." },
      { status: 400 }
    );
  }
  if (
    odometer !== undefined &&
    (typeof odometer !== "number" || !Number.isFinite(odometer) || odometer < 0)
  ) {
    return NextResponse.json({ error: "Odometer must be a non-negative number." }, { status: 400 });
  }
  const validStatuses = Object.values(VehicleStatus);
  if (status !== undefined && !validStatuses.includes(status as (typeof VehicleStatus)[keyof typeof VehicleStatus])) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const existing = await prisma.vehicle.findUnique({ where: { registrationNumber } });
  if (existing) {
    return NextResponse.json(
      { error: "A vehicle with that registration number already exists." },
      { status: 409 }
    );
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      registrationNumber,
      name,
      type,
      maxLoadCapacity,
      odometer: odometer ?? 0,
      acquisitionCost,
      status: (status as (typeof VehicleStatus)[keyof typeof VehicleStatus]) ?? VehicleStatus.AVAILABLE,
      region,
    },
  });

  await createOrganizationNotification({
    actorId: user.id,
    type: "vehicle",
    title: "Vehicle added",
    message: `${vehicle.name} (${vehicle.registrationNumber}) was added to the fleet.`,
  });

  return NextResponse.json(vehicle, { status: 201 });
}
