import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supabase = await createClient();

  let query = supabase
    .from("pg_properties")
    .select("*")
    .eq("is_approved", true)
    .eq("is_available", true);

  const area = searchParams.get("area");
  const gender = searchParams.get("gender");
  const type = searchParams.get("type");
  const maxBudget = searchParams.get("budget_max");
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") || "50");

  if (area) query = query.ilike("area", `%${area}%`);
  if (gender) query = query.eq("gender", gender);
  if (type) query = query.eq("property_type", type);
  if (maxBudget) query = query.lte("price_double", parseInt(maxBudget));
  if (search) {
    query = query.or(
      `gharpayy_name.ilike.%${search}%,area.ilike.%${search}%,locality.ilike.%${search}%`
    );
  }

  const { data, error } = await query.order("created_at", { ascending: false }).limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, count: data?.length || 0 });
}
