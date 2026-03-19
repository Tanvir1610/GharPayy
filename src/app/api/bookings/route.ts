import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { pg_id, room_type, move_in_date, payment_method, monthly_rent, security_deposit, notes } = body;

  if (!pg_id || !room_type || !move_in_date || !monthly_rent) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase.from("bookings").insert({
    pg_id, user_id: user.id, room_type, move_in_date,
    payment_method: payment_method || "UPI",
    monthly_rent, security_deposit: security_deposit || monthly_rent,
    notes, status: "Pending",
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  let query = supabase
    .from("bookings")
    .select("*, pg:pg_properties(gharpayy_name, area, locality), user:profiles(full_name, email)");

  if (profile?.role !== "admin") {
    query = query.eq("user_id", user.id);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
