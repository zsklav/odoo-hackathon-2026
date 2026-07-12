import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth/jwt";

const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/register"];

export default function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
  const isAuthRoute = AUTH_ROUTES.includes(path);

  const token = req.cookies.get("session")?.value;
  const session = token ? verifySessionToken(token) : null;

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
