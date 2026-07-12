import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "@/generated/prisma/client";
import { ExpenseType } from "@/generated/prisma/enums";
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
  const type = searchParams.get("type");

  const where: Prisma.ExpenseWhereInput = {};
  if (vehicleId) where.vehicleId = vehicleId;
  if (type && Object.values(ExpenseType).includes(type as ExpenseType)) {
    where.type = type as ExpenseType;
  }

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: { date: "desc" },
    include: { vehicle: VEHICLE_SUMMARY },
  });

  return NextResponse.json(expenses);
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

  const { vehicleId, type, cost, date } = body as Record<string, unknown>;

  if (typeof vehicleId !== "string" || !vehicleId.trim()) {
    return NextResponse.json({ error: "A vehicle must be selected." }, { status: 400 });
  }
  if (typeof type !== "string" || !Object.values(ExpenseType).includes(type as ExpenseType)) {
    return NextResponse.json({ error: "Invalid expense type." }, { status: 400 });
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

  const expense = await prisma.expense.create({
    data: {
      vehicleId,
      type: type as ExpenseType,
      cost,
      ...(parsedDate ? { date: parsedDate } : {}),
    },
    include: { vehicle: VEHICLE_SUMMARY },
  });

  await createOrganizationNotification({
    actorId: user.id,
    type: "expense",
    title: "Expense recorded",
    message: `${expense.type.toLowerCase()} expense of ₹${expense.cost.toLocaleString("en-IN")} was recorded for ${expense.vehicle.registrationNumber}.`,
  });

  return NextResponse.json(expense, { status: 201 });
}
