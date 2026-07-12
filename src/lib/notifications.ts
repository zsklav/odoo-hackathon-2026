import { prisma } from "@/lib/prisma";

type NotificationInput = {
  actorId: string;
  type: string;
  title: string;
  message: string;
};

export async function createOrganizationNotification({ actorId, type, title, message }: NotificationInput) {
  const recipients = await prisma.user.findMany({
    where: { id: { not: actorId }, inAppNotifications: true },
    select: { id: true },
  });

  if (!recipients.length) return;

  await prisma.notification.create({
    data: {
      actorId,
      type,
      title,
      message,
      recipients: { create: recipients.map(({ id }) => ({ userId: id })) },
    },
  });
}
