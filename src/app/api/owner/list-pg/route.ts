import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();
  if (!profile || profile.role === "tenant") return NextResponse.json({ error: "Owner access required" }, { status: 403 });

  const body = await req.json();

  // Validate required fields
  if (!body.gharpayy_name || !body.area) {
    return NextResponse.json({ error: "Name and area are required" }, { status: 400 });
  }

  const { error } = await supabase.from("pg_properties").insert({
    ...body,
    is_approved: false,
    is_available: false, // starts unavailable until admin approves
    photos_urls: [],
    videos_urls: [],
    brochure_url: null,
    group_name: null,
    actual_name: body.gharpayy_name,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
