import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import DashboardClient from "@/components/dashboard/DashboardClient";
import Footer from "@/components/layout/Footer";

export const dynamic = 'force-dynamic';
export const metadata = { title: "Dashboard | Gharpayy" };

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const supabase = createAdminClient();

  let { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single();

  // First time? Send to onboarding
  if (!profile || !profile.onboarded) redirect("/onboarding");

  // Route by role
  if (profile.role === "admin") redirect("/admin");
  if (profile.role === "owner") redirect("/owner/dashboard");

  // Tenant dashboard data
  const [{ data: bookings }, { data: savedPGs }, { data: visits }] = await Promise.all([
    supabase.from("bookings")
      .select("*, pg:pg_properties(gharpayy_name, area, locality, google_maps_url, price_double)")
      .eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("saved_pgs")
      .select("*, pg:pg_properties(*)")
      .eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("visit_schedules")
      .select("*, pg:pg_properties(gharpayy_name, area)")
      .eq("user_id", userId).order("visit_date", { ascending: true }),
  ]);

  return (
    <div className="min-h-screen" style={{ background: "#0F0702" }}>
      <Navbar />
      <div className="pt-16">
        <DashboardClient
          profile={profile}
          bookings={bookings || []}
          savedPGs={savedPGs || []}
          visits={visits || []}
        />
      </div>
      <Footer />
    </div>
  );
}
