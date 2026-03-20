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

  // Get or create profile
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile) {
    // Auto-create profile if missing (first login via Clerk)
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert({ id: userId, email: "", full_name: "", role: "tenant" })
      .select()
      .single();
    profile = newProfile;
  }

  if (!profile) redirect("/login");

  // Fetch user data
  const [{ data: bookings }, { data: savedPGs }, { data: visits }] = await Promise.all([
    supabase.from("bookings")
      .select("*, pg:pg_properties(gharpayy_name, area, locality, google_maps_url, price_double)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase.from("saved_pgs")
      .select("*, pg:pg_properties(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase.from("visit_schedules")
      .select("*, pg:pg_properties(gharpayy_name, area)")
      .eq("user_id", userId)
      .order("visit_date", { ascending: true }),
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
