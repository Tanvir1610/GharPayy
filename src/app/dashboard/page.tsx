import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const metadata = { title: "Dashboard | Gharpayy" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/login");

  // Fetch user's bookings
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, pg:pg_properties(gharpayy_name, area, locality, google_maps_url, price_double)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch saved PGs
  const { data: savedPGs } = await supabase
    .from("saved_pgs")
    .select("*, pg:pg_properties(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch visit schedules
  const { data: visits } = await supabase
    .from("visit_schedules")
    .select("*, pg:pg_properties(gharpayy_name, area)")
    .eq("user_id", user.id)
    .order("visit_date", { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <DashboardClient
          profile={profile}
          bookings={bookings || []}
          savedPGs={savedPGs || []}
          visits={visits || []}
        />
      </div>
    </div>
  );
}
