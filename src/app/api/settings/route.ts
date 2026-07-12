import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  return NextResponse.json({
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    emailNotifications: user.emailNotifications,
    inAppNotifications: user.inAppNotifications,
  });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { fullName, emailNotifications, inAppNotifications } = body as Record<string, unknown>;
  if (fullName !== undefined && (typeof fullName !== "string" || !fullName.trim())) {
    return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
  }
  if (emailNotifications !== undefined && typeof emailNotifications !== "boolean") {
    return NextResponse.json({ error: "Invalid email preference." }, { status: 400 });
  }
  if (inAppNotifications !== undefined && typeof inAppNotifications !== "boolean") {
    return NextResponse.json({ error: "Invalid in-app preference." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(typeof fullName === "string" ? { fullName: fullName.trim() } : {}),
      ...(typeof emailNotifications === "boolean" ? { emailNotifications } : {}),
      ...(typeof inAppNotifications === "boolean" ? { inAppNotifications } : {}),
    },
  });
  return NextResponse.json(updated);
}
