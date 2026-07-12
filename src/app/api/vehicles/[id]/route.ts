import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "@/generated/prisma/client";
import { VehicleStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth/jwt";
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

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/vehicles/[id]">
) {
  const user = await requireSession();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) {
    return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });
  }

  return NextResponse.json(vehicle);
}

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/vehicles/[id]">
) {
  const { response } = await requireRole(["FLEET_MANAGER"]); if (response) return response;

  const { id } = await ctx.params;
  const existing = await prisma.vehicle.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });
  }

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

  const data: Prisma.VehicleUpdateInput = {};

  if (registrationNumber !== undefined) {
    if (typeof registrationNumber !== "string" || !registrationNumber.trim()) {
      return NextResponse.json({ error: "Registration number cannot be empty." }, { status: 400 });
    }
    if (registrationNumber !== existing.registrationNumber) {
      const taken = await prisma.vehicle.findUnique({ where: { registrationNumber } });
      if (taken) {
        return NextResponse.json(
          { error: "A vehicle with that registration number already exists." },
          { status: 409 }
        );
      }
    }
    data.registrationNumber = registrationNumber;
  }

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
    }
    data.name = name;
  }

  if (type !== undefined) {
    if (typeof type !== "string" || !type.trim()) {
      return NextResponse.json({ error: "Type cannot be empty." }, { status: 400 });
    }
    data.type = type;
  }

  if (region !== undefined) {
    if (typeof region !== "string" || !region.trim()) {
      return NextResponse.json({ error: "Region cannot be empty." }, { status: 400 });
    }
    data.region = region;
  }

  if (maxLoadCapacity !== undefined) {
    if (typeof maxLoadCapacity !== "number" || !Number.isFinite(maxLoadCapacity) || maxLoadCapacity <= 0) {
      return NextResponse.json(
        { error: "Max load capacity must be a positive number." },
        { status: 400 }
      );
    }
    data.maxLoadCapacity = maxLoadCapacity;
  }

  if (acquisitionCost !== undefined) {
    if (typeof acquisitionCost !== "number" || !Number.isFinite(acquisitionCost) || acquisitionCost <= 0) {
      return NextResponse.json(
        { error: "Acquisition cost must be a positive number." },
        { status: 400 }
      );
    }
    data.acquisitionCost = acquisitionCost;
  }

  if (odometer !== undefined) {
    if (typeof odometer !== "number" || !Number.isFinite(odometer) || odometer < 0) {
      return NextResponse.json({ error: "Odometer must be a non-negative number." }, { status: 400 });
    }
    data.odometer = odometer;
  }

  if (status !== undefined) {
    const validStatuses = Object.values(VehicleStatus);
    if (!validStatuses.includes(status as (typeof VehicleStatus)[keyof typeof VehicleStatus])) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    data.status = status as (typeof VehicleStatus)[keyof typeof VehicleStatus];
  }

  const vehicle = await prisma.vehicle.update({ where: { id }, data });
  return NextResponse.json(vehicle);
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/vehicles/[id]">
) {
  const { response } = await requireRole(["FLEET_MANAGER"]); if (response) return response;

  const { id } = await ctx.params;
  const existing = await prisma.vehicle.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });
  }

  try {
    await prisma.vehicle.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2003" || error.code === "P2014")
    ) {
      return NextResponse.json(
        {
          error:
            "Cannot delete a vehicle with existing trip, maintenance, fuel, or expense records.",
        },
        { status: 409 }
      );
    }
    throw error;
  }

  return NextResponse.json({ ok: true });
}
