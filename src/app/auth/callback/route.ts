import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Ensure profile exists (important for Google OAuth — no trigger fires for OAuth)
      const admin = createAdminClient();
      const { data: existingProfile } = await admin
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (!existingProfile) {
        await admin.from("profiles").insert({
          id: data.user.id,
          email: data.user.email ?? "",
          full_name:
            data.user.user_metadata?.full_name ??
            data.user.user_metadata?.name ??
            "",
          role: "tenant",
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
