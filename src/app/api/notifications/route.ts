import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const notifications = await prisma.notificationRecipient.findMany({
    where: { userId: user.id },
    orderBy: { notification: { createdAt: "desc" } },
    take: 30,
    include: { notification: true },
  });

  return NextResponse.json(
    notifications.map((recipient) => ({
      ...recipient.notification,
      id: recipient.id,
      read: Boolean(recipient.readAt),
      readAt: recipient.readAt,
    }))
  );
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const action = body?.action;
  const notificationId = body?.notificationId;

  if (action === "mark-all-read") {
    await prisma.notificationRecipient.updateMany({
      where: { userId: user.id, readAt: null },
      data: { readAt: new Date() },
    });
    return NextResponse.json({ ok: true });
  }

  if ((action === "mark-read" || action === "mark-unread") && typeof notificationId === "string") {
    const result = await prisma.notificationRecipient.updateMany({
      where: { id: notificationId, userId: user.id },
      data: { readAt: action === "mark-read" ? new Date() : null },
    });
    if (!result.count) return NextResponse.json({ error: "Notification not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid notification action." }, { status: 400 });
}
