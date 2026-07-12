import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { MaintenanceStatus, VehicleStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth/jwt";
import { createOrganizationNotification } from "@/lib/notifications";

async function requireSession() {
  const cookieStore = await cookies(); const token = cookieStore.get("session")?.value;
  const payload = token ? verifySessionToken(token) : null;
  return payload ? prisma.user.findUnique({ where: { id: payload.userId } }) : null;
}

export async function GET(_request: Request, ctx: RouteContext<"/api/maintenance/[id]">) {
  const user = await requireSession(); if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const { id } = await ctx.params;
  const log = await prisma.maintenanceLog.findUnique({ where: { id }, include: { vehicle: true } });
  return log ? NextResponse.json(log) : NextResponse.json({ error: "Maintenance log not found." }, { status: 404 });
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/maintenance/[id]">) {
  const user = await requireSession(); if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const { id } = await ctx.params; const body = await request.json().catch(() => null);
  if (body?.action !== "close") return NextResponse.json({ error: "Invalid maintenance action." }, { status: 400 });
  const existing = await prisma.maintenanceLog.findUnique({ where: { id }, include: { vehicle: true } });
  if (!existing) return NextResponse.json({ error: "Maintenance log not found." }, { status: 404 });
  if (existing.status === MaintenanceStatus.CLOSED) return NextResponse.json({ error: "Maintenance log is already closed." }, { status: 409 });
  const log = await prisma.$transaction(async (tx) => {
    const closed = await tx.maintenanceLog.update({ where: { id }, data: { status: MaintenanceStatus.CLOSED, closedAt: new Date() }, include: { vehicle: true } });
    if (existing.vehicle.status !== VehicleStatus.RETIRED) await tx.vehicle.update({ where: { id: existing.vehicleId }, data: { status: VehicleStatus.AVAILABLE } });
    return closed;
  });
  await createOrganizationNotification({ actorId: user.id, type: "maintenance", title: "Maintenance closed", message: `${existing.vehicle.registrationNumber} is available for operations.` });
  return NextResponse.json(log);
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/maintenance/[id]">) {
  const user = await requireSession(); if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const { id } = await ctx.params;
  const log = await prisma.maintenanceLog.findUnique({ where: { id } });
  if (!log) return NextResponse.json({ error: "Maintenance log not found." }, { status: 404 });
  if (log.status !== MaintenanceStatus.CLOSED) return NextResponse.json({ error: "Close the maintenance log before deleting it." }, { status: 409 });
  await prisma.maintenanceLog.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
