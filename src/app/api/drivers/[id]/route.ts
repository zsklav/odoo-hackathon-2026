import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "@/generated/prisma/client";
import { DriverStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth/jwt";

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
  ctx: RouteContext<"/api/drivers/[id]">
) {
  const user = await requireSession();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const driver = await prisma.driver.findUnique({ where: { id } });
  if (!driver) {
    return NextResponse.json({ error: "Driver not found." }, { status: 404 });
  }

  return NextResponse.json(driver);
}

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/drivers/[id]">
) {
  const user = await requireSession();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const existing = await prisma.driver.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Driver not found." }, { status: 404 });
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

  const data: Prisma.DriverUpdateInput = {};

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
    }
    data.name = name;
  }

  if (licenseNumber !== undefined) {
    if (typeof licenseNumber !== "string" || !licenseNumber.trim()) {
      return NextResponse.json({ error: "License number cannot be empty." }, { status: 400 });
    }
    if (licenseNumber !== existing.licenseNumber) {
      const taken = await prisma.driver.findUnique({ where: { licenseNumber } });
      if (taken) {
        return NextResponse.json(
          { error: "A driver with that license number already exists." },
          { status: 409 }
        );
      }
    }
    data.licenseNumber = licenseNumber;
  }

  if (licenseCategory !== undefined) {
    if (typeof licenseCategory !== "string" || !licenseCategory.trim()) {
      return NextResponse.json({ error: "License category cannot be empty." }, { status: 400 });
    }
    data.licenseCategory = licenseCategory;
  }

  if (contactNumber !== undefined) {
    if (typeof contactNumber !== "string" || !contactNumber.trim()) {
      return NextResponse.json({ error: "Contact number cannot be empty." }, { status: 400 });
    }
    data.contactNumber = contactNumber;
  }

  if (licenseExpiryDate !== undefined) {
    if (typeof licenseExpiryDate !== "string" || Number.isNaN(Date.parse(licenseExpiryDate))) {
      return NextResponse.json({ error: "A valid license expiry date is required." }, { status: 400 });
    }
    data.licenseExpiryDate = new Date(licenseExpiryDate);
  }

  if (safetyScore !== undefined) {
    if (
      typeof safetyScore !== "number" ||
      !Number.isFinite(safetyScore) ||
      safetyScore < 0 ||
      safetyScore > 100
    ) {
      return NextResponse.json(
        { error: "Safety score must be a number between 0 and 100." },
        { status: 400 }
      );
    }
    data.safetyScore = safetyScore;
  }

  if (status !== undefined) {
    const validStatuses = Object.values(DriverStatus);
    if (!validStatuses.includes(status as (typeof DriverStatus)[keyof typeof DriverStatus])) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    data.status = status as (typeof DriverStatus)[keyof typeof DriverStatus];
  }

  const driver = await prisma.driver.update({ where: { id }, data });
  return NextResponse.json(driver);
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/drivers/[id]">
) {
  const user = await requireSession();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const existing = await prisma.driver.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Driver not found." }, { status: 404 });
  }

  try {
    await prisma.driver.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2003" || error.code === "P2014")
    ) {
      return NextResponse.json(
        { error: "Cannot delete a driver with existing trip records." },
        { status: 409 }
      );
    }
    throw error;
  }

  return NextResponse.json({ ok: true });
}
