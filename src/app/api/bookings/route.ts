import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const body = await request.json();
  const { pg_id, room_type, move_in_date, payment_method, monthly_rent, security_deposit, notes } = body;

  if (!pg_id || !room_type || !move_in_date || !monthly_rent) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase.from("bookings").insert({
    pg_id, user_id: userId, room_type, move_in_date,
    payment_method: payment_method || "UPI",
    monthly_rent, security_deposit: security_deposit || monthly_rent,
    notes, status: "Pending",
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("bookings")
    .select("*, pg:pg_properties(gharpayy_name, area, locality)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
