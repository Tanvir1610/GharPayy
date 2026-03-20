import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import AdminClient from "@/components/dashboard/AdminClient";
import Footer from "@/components/layout/Footer";

export const dynamic = 'force-dynamic';

export const metadata = { title: "Admin Dashboard | Gharpayy" };

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const supabase = createAdminClient();

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const [
    { count: totalPGs },
    { count: totalUsers },
    { count: totalBookings },
    { count: pendingBookings },
    { data: recentBookings },
    { data: allLeads },
    { data: pgsByArea },
  ] = await Promise.all([
    supabase.from("pg_properties").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "Pending"),
    supabase.from("bookings")
      .select("*, pg:pg_properties(gharpayy_name, area), user:profiles(full_name, email)")
      .order("created_at", { ascending: false }).limit(10),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("pg_properties").select("area").eq("is_available", true),
  ]);

  const areaCount: Record<string, number> = {};
  (pgsByArea || []).forEach(({ area }) => { areaCount[area] = (areaCount[area] || 0) + 1; });

  return (
    <div className="min-h-screen" style={{ background: "#0F0702" }}>
      <Navbar />
      <div className="pt-16">
        <AdminClient
          stats={{ totalPGs: totalPGs || 0, totalUsers: totalUsers || 0, totalBookings: totalBookings || 0, pendingBookings: pendingBookings || 0 }}
          recentBookings={recentBookings || []}
          leads={allLeads || []}
          pgsByArea={areaCount}
        />
      </div>
      <Footer />
    </div>
  );
}
