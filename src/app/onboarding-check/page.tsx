import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function OnboardingCheckPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, onboarded")
    .eq("id", userId)
    .single();

  // No profile → user signed in via Google but never picked a role
  // Send them to register to choose
  if (!profile || !profile.onboarded) redirect("/register");

  // Route by role
  if (profile.role === "admin") redirect("/admin");
  if (profile.role === "owner") redirect("/owner/dashboard");
  redirect("/dashboard");
}
