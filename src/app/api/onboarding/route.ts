import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Called after OAuth redirect with ?role=tenant&redirect=/dashboard
  const { userId } = await auth();
  if (!userId) return NextResponse.redirect(new URL("/login", req.url));

  const url = new URL(req.url);
  const role = url.searchParams.get("role") || "tenant";
  const redirectTo = url.searchParams.get("redirect") || "/dashboard";

  if (!["tenant", "owner"].includes(role)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const clerkUser = await currentUser();
  const supabase = createAdminClient();

  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? "";
  const full_name = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ");
  const avatar_url = clerkUser?.imageUrl ?? null;

  // Check if user already has a profile (returning user)
  const { data: existing } = await supabase
    .from("profiles")
    .select("role, onboarded")
    .eq("id", userId)
    .single();

  if (existing?.onboarded) {
    // Already set up - route by existing role
    if (existing.role === "owner") return NextResponse.redirect(new URL("/owner/dashboard", req.url));
    if (existing.role === "admin") return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // New user - set their role
  await supabase.from("profiles").upsert({
    id: userId,
    email,
    full_name,
    avatar_url,
    role,
    onboarded: true,
  }, { onConflict: "id" });

  return NextResponse.redirect(new URL(redirectTo, req.url));
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clerkUser = await currentUser();
  const { role } = await req.json();

  if (!["tenant", "owner"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? "";
  const full_name = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ");
  const avatar_url = clerkUser?.imageUrl ?? null;

  const { error } = await supabase.from("profiles").upsert({
    id: userId, email, full_name, avatar_url, role, onboarded: true,
  }, { onConflict: "id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, role });
}
