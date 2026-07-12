import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "@/generated/prisma/client";
import { DriverStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth/jwt";
import { createOrganizationNotification } from "@/lib/notifications";

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
  const licenseCategory = searchParams.get("licenseCategory");

  const where: Prisma.DriverWhereInput = {};
  if (
    status &&
    Object.values(DriverStatus).includes(status as (typeof DriverStatus)[keyof typeof DriverStatus])
  ) {
    where.status = status as (typeof DriverStatus)[keyof typeof DriverStatus];
  }
  if (licenseCategory) where.licenseCategory = licenseCategory;

  const drivers = await prisma.driver.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(drivers);
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

  const {
    name,
    licenseNumber,
    licenseCategory,
    licenseExpiryDate,
    contactNumber,
    safetyScore,
    status,
  } = body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (typeof licenseNumber !== "string" || !licenseNumber.trim()) {
    return NextResponse.json({ error: "License number is required." }, { status: 400 });
  }
  if (typeof licenseCategory !== "string" || !licenseCategory.trim()) {
    return NextResponse.json({ error: "License category is required." }, { status: 400 });
  }
  if (typeof contactNumber !== "string" || !contactNumber.trim()) {
    return NextResponse.json({ error: "Contact number is required." }, { status: 400 });
  }
  if (typeof licenseExpiryDate !== "string" || Number.isNaN(Date.parse(licenseExpiryDate))) {
    return NextResponse.json(
      { error: "A valid license expiry date is required." },
      { status: 400 }
    );
  }
  if (
    safetyScore !== undefined &&
    (typeof safetyScore !== "number" ||
      !Number.isFinite(safetyScore) ||
      safetyScore < 0 ||
      safetyScore > 100)
  ) {
    return NextResponse.json(
      { error: "Safety score must be a number between 0 and 100." },
      { status: 400 }
    );
  }
  const validStatuses = Object.values(DriverStatus);
  if (status !== undefined && !validStatuses.includes(status as (typeof DriverStatus)[keyof typeof DriverStatus])) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const existing = await prisma.driver.findUnique({ where: { licenseNumber } });
  if (existing) {
    return NextResponse.json(
      { error: "A driver with that license number already exists." },
      { status: 409 }
    );
  }

  const driver = await prisma.driver.create({
    data: {
      name,
      licenseNumber,
      licenseCategory,
      licenseExpiryDate: new Date(licenseExpiryDate),
      contactNumber,
      safetyScore: (safetyScore as number | undefined) ?? 100,
      status: (status as (typeof DriverStatus)[keyof typeof DriverStatus]) ?? DriverStatus.AVAILABLE,
    },
  });

  await createOrganizationNotification({
    actorId: user.id,
    type: "driver",
    title: "Driver added",
    message: `${driver.name} was added to the driver registry.`,
  });

  return NextResponse.json(driver, { status: 201 });
}
