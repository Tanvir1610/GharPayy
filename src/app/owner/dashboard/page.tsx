import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OwnerDashboardClient from "@/components/dashboard/OwnerDashboardClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Owner Dashboard | Gharpayy" };

export default async function OwnerDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const supabase = createAdminClient();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single();

  if (!profile) redirect("/onboarding");
  if (profile.role === "tenant") redirect("/dashboard");
  if (profile.role === "admin") redirect("/admin");

  // Fetch owner's PGs (by owner_contact matching profile phone, or we match by group_name/owner)
  // For now, fetch all PGs — owner sees all their listed properties
  const [
    { data: myPGs },
    { data: bookings },
    { data: leads },
  ] = await Promise.all([
    supabase.from("pg_properties")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("bookings")
      .select("*, pg:pg_properties(gharpayy_name,area), user:profiles(full_name,email)")
      .order("created_at", { ascending: false })
      .limit(20),
    supabase.from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const stats = {
    totalPGs: myPGs?.length ?? 0,
    totalBookings: bookings?.length ?? 0,
    pendingBookings: bookings?.filter(b => b.status === "Pending").length ?? 0,
    totalLeads: leads?.length ?? 0,
  };

  return (
    <div className="min-h-screen" style={{ background: "#0F0702" }}>
      <Navbar />
      <div className="pt-16">
        <OwnerDashboardClient
          profile={profile}
          stats={stats}
          pgs={myPGs ?? []}
          bookings={bookings ?? []}
          leads={leads ?? []}
        />
      </div>
      <Footer />
    </div>
  );
}
