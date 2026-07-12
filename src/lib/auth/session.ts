import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth/jwt";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const payload = token ? verifySessionToken(token) : null;
  if (!payload) return null;
  return prisma.user.findUnique({ where: { id: payload.userId } });
}
