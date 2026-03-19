import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  const { name, phone, email, preferred_area, budget_min, budget_max, preferred_gender, preferred_room_type, move_in_date, notes } = body;

  if (!name || !phone || !preferred_area || !budget_max || !move_in_date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase.from("leads").insert({
    name, phone, email, preferred_area,
    budget_min: budget_min || 0,
    budget_max, preferred_gender: preferred_gender || "Co-live",
    preferred_room_type: preferred_room_type || "Double Sharing",
    move_in_date, notes, status: "New",
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Try to find matching PGs
  const { data: matches } = await supabase
    .from("pg_properties")
    .select("id, gharpayy_name, area, price_double")
    .eq("is_approved", true)
    .eq("is_available", true)
    .ilike("area", `%${preferred_area}%`)
    .lte("price_double", budget_max)
    .limit(5);

  return NextResponse.json({ data, matches: matches || [] }, { status: 201 });
}
