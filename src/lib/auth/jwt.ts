import jwt from "jsonwebtoken";

export interface SessionTokenPayload {
  userId: string;
  role: string;
}

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable.");
}

const JWT_SECRET: string = process.env.JWT_SECRET;

export function signSessionToken(payload: SessionTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifySessionToken(token: string): SessionTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown;
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded &&
      "role" in decoded &&
      typeof decoded.userId === "string" &&
      typeof decoded.role === "string"
    ) {
      return { userId: decoded.userId, role: decoded.role };
    }
    return null;
  } catch {
    return null;
  }
}
