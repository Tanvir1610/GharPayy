import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isClerkProtected = createRouteMatcher([
  "/dashboard(.*)",
  "/owner(.*)",
  "/onboarding-check(.*)",
  "/api/bookings(.*)",
  "/api/leads(.*)",
  "/api/onboarding(.*)",
  "/api/owner(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Admin routes: check our custom cookie session
  if (isAdminRoute(req)) {
    const adminSession = req.cookies.get("gharpayy_admin_session");
    const secret = process.env.ADMIN_SESSION_SECRET || "gharpayy-admin-secret-2024";
    if (!adminSession || adminSession.value !== secret) {
      return NextResponse.redirect(new URL("/admin-login", req.url));
    }
    return NextResponse.next();
  }

  // Regular protected routes: Clerk
  if (isClerkProtected(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
