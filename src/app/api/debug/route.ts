import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error, count } = await supabase
      .from("pg_properties")
      .select("id, gharpayy_name, area", { count: "exact" })
      .limit(5);

    return NextResponse.json({
      ok: !error,
      count,
      sample: data,
      error: error?.message,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
