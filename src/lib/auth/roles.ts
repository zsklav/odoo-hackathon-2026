import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth/jwt";

export async function requireRole(allowedRoles: string[]) {
  const token = (await cookies()).get("session")?.value;
  const session = token ? verifySessionToken(token) : null;
  if (!session) return { user: null, response: NextResponse.json({ error: "Not authenticated." }, { status: 401 }) };
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return { user: null, response: NextResponse.json({ error: "Not authenticated." }, { status: 401 }) };
  if (!allowedRoles.includes(user.role)) return { user: null, response: NextResponse.json({ error: "You do not have permission for this action." }, { status: 403 }) };
  return { user, response: null };
}
