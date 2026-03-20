import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// Admin credentials - store these as Railway env vars:
// ADMIN_EMAIL and ADMIN_PASSWORD
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@gharpayy.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "gharpayy@admin2024";
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "gharpayy-admin-secret-2024";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    // Delay to prevent brute force
    await new Promise(r => setTimeout(r, 1000));
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Set admin session cookie
  const cookieStore = await cookies();
  cookieStore.set("gharpayy_admin_session", ADMIN_SESSION_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("gharpayy_admin_session");
  return NextResponse.json({ success: true });
}
