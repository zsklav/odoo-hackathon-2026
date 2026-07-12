import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { MaintenanceStatus, VehicleStatus } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth/jwt";
import { createOrganizationNotification } from "@/lib/notifications";

async function requireSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload) return null;
  return prisma.user.findUnique({ where: { id: payload.userId } });
}

export async function GET(request: Request) {
  const user = await requireSession();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get("vehicleId");
  const status = searchParams.get("status");
  const where: Prisma.MaintenanceLogWhereInput = {};
  if (vehicleId) where.vehicleId = vehicleId;
  if (status && Object.values(MaintenanceStatus).includes(status as MaintenanceStatus)) {
    where.status = status as MaintenanceStatus;
  }
  const logs = await prisma.maintenanceLog.findMany({ where, orderBy: { openedAt: "desc" }, include: { vehicle: true } });
  return NextResponse.json(logs);
}

export async function POST(request: Request) {
  const user = await requireSession();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  const { vehicleId, description, cost } = body as Record<string, unknown>;
  if (typeof vehicleId !== "string" || !vehicleId.trim()) return NextResponse.json({ error: "A vehicle must be selected." }, { status: 400 });
  if (typeof description !== "string" || !description.trim()) return NextResponse.json({ error: "Description is required." }, { status: 400 });
  if (typeof cost !== "number" || !Number.isFinite(cost) || cost < 0) return NextResponse.json({ error: "Cost must be a non-negative number." }, { status: 400 });
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) return NextResponse.json({ error: "Vehicle not found." }, { status: 404 });

  const log = await prisma.$transaction(async (tx) => {
    const created = await tx.maintenanceLog.create({ data: { vehicleId, description: description.trim(), cost, status: MaintenanceStatus.OPEN }, include: { vehicle: true } });
    await tx.vehicle.update({ where: { id: vehicleId }, data: { status: VehicleStatus.IN_SHOP } });
    return created;
  });
  await createOrganizationNotification({ actorId: user.id, type: "maintenance", title: "Maintenance opened", message: `${log.vehicle.registrationNumber} was moved to maintenance.` });
  return NextResponse.json(log, { status: 201 });
}
