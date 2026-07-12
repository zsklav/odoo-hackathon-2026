import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "@/generated/prisma/client";
import { TripStatus, VehicleStatus, DriverStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth/jwt";

const VEHICLE_SUMMARY = {
  select: { id: true, registrationNumber: true, name: true, maxLoadCapacity: true, status: true },
} as const;
const DRIVER_SUMMARY = {
  select: { id: true, name: true, licenseNumber: true, status: true },
} as const;

const TRIP_TRANSITIONS: Record<TripStatus, TripStatus[]> = {
  [TripStatus.DRAFT]: [TripStatus.DISPATCHED, TripStatus.CANCELLED],
  [TripStatus.DISPATCHED]: [TripStatus.COMPLETED, TripStatus.CANCELLED],
  [TripStatus.COMPLETED]: [],
  [TripStatus.CANCELLED]: [],
};

async function requireSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  return user;
}

export async function GET(_request: Request, ctx: RouteContext<"/api/trips/[id]">) {
  const user = await requireSession();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: { vehicle: VEHICLE_SUMMARY, driver: DRIVER_SUMMARY },
  });
  if (!trip) {
    return NextResponse.json({ error: "Trip not found." }, { status: 404 });
  }

  return NextResponse.json(trip);
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/trips/[id]">) {
  const user = await requireSession();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const existing = await prisma.trip.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Trip not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { status, actualOdometer, fuelConsumed } = body as Record<string, unknown>;

  // --- Status transition path (state machine + vehicle/driver availability sync) ---
  if (status !== undefined) {
    const validStatuses = Object.values(TripStatus);
    if (!validStatuses.includes(status as TripStatus)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    const next = status as TripStatus;
    const allowed = TRIP_TRANSITIONS[existing.status as TripStatus];
    if (!allowed.includes(next)) {
      return NextResponse.json(
        { error: `Cannot move a ${existing.status} trip to ${next}.` },
        { status: 409 }
      );
    }

    // DRAFT -> DISPATCHED: both vehicle and driver must be free, then mark them ON_TRIP.
    if (next === TripStatus.DISPATCHED) {
      const [vehicle, driver] = await Promise.all([
        prisma.vehicle.findUnique({ where: { id: existing.vehicleId } }),
        prisma.driver.findUnique({ where: { id: existing.driverId } }),
      ]);
      if (!vehicle || !driver) {
        return NextResponse.json(
          { error: "The vehicle or driver for this trip no longer exists." },
          { status: 409 }
        );
      }
      if (vehicle.status !== VehicleStatus.AVAILABLE) {
        return NextResponse.json(
          { error: `Vehicle ${vehicle.registrationNumber} is not available (currently ${vehicle.status}).` },
          { status: 409 }
        );
      }
      if (driver.status !== DriverStatus.AVAILABLE) {
        return NextResponse.json(
          { error: `Driver ${driver.name} is not available (currently ${driver.status}).` },
          { status: 409 }
        );
      }
      if (existing.cargoWeight > vehicle.maxLoadCapacity) {
        return NextResponse.json(
          { error: `Cargo weight (${existing.cargoWeight}) exceeds the vehicle's capacity (${vehicle.maxLoadCapacity}).` },
          { status: 409 }
        );
      }

      const [, , trip] = await prisma.$transaction([
        prisma.vehicle.update({ where: { id: vehicle.id }, data: { status: VehicleStatus.ON_TRIP } }),
        prisma.driver.update({ where: { id: driver.id }, data: { status: DriverStatus.ON_TRIP } }),
        prisma.trip.update({
          where: { id },
          data: { status: TripStatus.DISPATCHED },
          include: { vehicle: VEHICLE_SUMMARY, driver: DRIVER_SUMMARY },
        }),
      ]);
      return NextResponse.json(trip);
    }

    // DISPATCHED -> COMPLETED / (DRAFT|DISPATCHED) -> CANCELLED.
    // Free the vehicle and driver back to AVAILABLE only if they were reserved by dispatch.
    const wasDispatched = existing.status === TripStatus.DISPATCHED;
    const tripData: Prisma.TripUpdateInput = { status: next };

    if (next === TripStatus.COMPLETED) {
      if (actualOdometer !== undefined) {
        if (typeof actualOdometer !== "number" || !Number.isFinite(actualOdometer) || actualOdometer < 0) {
          return NextResponse.json(
            { error: "Actual odometer must be a non-negative number." },
            { status: 400 }
          );
        }
        tripData.actualOdometer = actualOdometer;
      }
      if (fuelConsumed !== undefined) {
        if (typeof fuelConsumed !== "number" || !Number.isFinite(fuelConsumed) || fuelConsumed < 0) {
          return NextResponse.json(
            { error: "Fuel consumed must be a non-negative number." },
            { status: 400 }
          );
        }
        tripData.fuelConsumed = fuelConsumed;
      }
    }

    const ops: Prisma.PrismaPromise<unknown>[] = [];
    if (wasDispatched) {
      ops.push(
        prisma.vehicle.update({
          where: { id: existing.vehicleId },
          data: { status: VehicleStatus.AVAILABLE },
        }),
        prisma.driver.update({
          where: { id: existing.driverId },
          data: { status: DriverStatus.AVAILABLE },
        })
      );
    }
    const updateTrip = prisma.trip.update({
      where: { id },
      data: tripData,
      include: { vehicle: VEHICLE_SUMMARY, driver: DRIVER_SUMMARY },
    });
    ops.push(updateTrip);

    const results = await prisma.$transaction(ops);
    return NextResponse.json(results[results.length - 1]);
  }

  // --- Field edit path: only permitted while the trip is still a DRAFT ---
  if (existing.status !== TripStatus.DRAFT) {
    return NextResponse.json(
      { error: `Only DRAFT trips can be edited. This trip is ${existing.status}.` },
      { status: 409 }
    );
  }

  const { source, destination, vehicleId, driverId, cargoWeight, plannedDistance } =
    body as Record<string, unknown>;

  const data: Prisma.TripUpdateInput = {};

  if (source !== undefined) {
    if (typeof source !== "string" || !source.trim()) {
      return NextResponse.json({ error: "Source cannot be empty." }, { status: 400 });
    }
    data.source = source;
  }
  if (destination !== undefined) {
    if (typeof destination !== "string" || !destination.trim()) {
      return NextResponse.json({ error: "Destination cannot be empty." }, { status: 400 });
    }
    data.destination = destination;
  }
  if (plannedDistance !== undefined) {
    if (typeof plannedDistance !== "number" || !Number.isFinite(plannedDistance) || plannedDistance <= 0) {
      return NextResponse.json({ error: "Planned distance must be a positive number." }, { status: 400 });
    }
    data.plannedDistance = plannedDistance;
  }

  // Determine the effective vehicle & cargo to re-check the capacity rule.
  const nextVehicleId = typeof vehicleId === "string" && vehicleId.trim() ? vehicleId : existing.vehicleId;
  const nextCargoWeight =
    cargoWeight !== undefined ? cargoWeight : existing.cargoWeight;

  if (cargoWeight !== undefined) {
    if (typeof cargoWeight !== "number" || !Number.isFinite(cargoWeight) || cargoWeight <= 0) {
      return NextResponse.json({ error: "Cargo weight must be a positive number." }, { status: 400 });
    }
    data.cargoWeight = cargoWeight;
  }

  if (vehicleId !== undefined) {
    if (typeof vehicleId !== "string" || !vehicleId.trim()) {
      return NextResponse.json({ error: "A vehicle must be selected." }, { status: 400 });
    }
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      return NextResponse.json({ error: "Selected vehicle does not exist." }, { status: 400 });
    }
    data.vehicle = { connect: { id: vehicleId } };
  }
  if (driverId !== undefined) {
    if (typeof driverId !== "string" || !driverId.trim()) {
      return NextResponse.json({ error: "A driver must be selected." }, { status: 400 });
    }
    const driver = await prisma.driver.findUnique({ where: { id: driverId } });
    if (!driver) {
      return NextResponse.json({ error: "Selected driver does not exist." }, { status: 400 });
    }
    data.driver = { connect: { id: driverId } };
  }

  if (cargoWeight !== undefined || vehicleId !== undefined) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: nextVehicleId } });
    if (vehicle && (nextCargoWeight as number) > vehicle.maxLoadCapacity) {
      return NextResponse.json(
        { error: `Cargo weight (${nextCargoWeight}) exceeds the vehicle's capacity (${vehicle.maxLoadCapacity}).` },
        { status: 400 }
      );
    }
  }

  const trip = await prisma.trip.update({
    where: { id },
    data,
    include: { vehicle: VEHICLE_SUMMARY, driver: DRIVER_SUMMARY },
  });
  return NextResponse.json(trip);
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/trips/[id]">) {
  const user = await requireSession();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const existing = await prisma.trip.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Trip not found." }, { status: 404 });
  }

  // A live (DISPATCHED) trip is holding a vehicle and driver — block deletion.
  if (existing.status === TripStatus.DISPATCHED) {
    return NextResponse.json(
      { error: "Cannot delete a dispatched trip. Complete or cancel it first." },
      { status: 409 }
    );
  }

  await prisma.trip.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
