import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import AdminClient from "@/components/dashboard/AdminClient";

export const metadata = { title: "Admin Dashboard | Gharpayy" };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  // Stats
  const [{ count: totalPGs }, { count: totalUsers }, { count: totalBookings }, { count: pendingBookings }] = await Promise.all([
    supabase.from("pg_properties").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "Pending"),
  ]);

  // Recent bookings
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("*, pg:pg_properties(gharpayy_name, area), user:profiles(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(10);

  // PGs by area
  const { data: allPGs } = await supabase
    .from("pg_properties")
    .select("area, gender, property_type, is_available, is_approved")
    .order("area");

  // Recent leads
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <AdminClient
          stats={{ totalPGs: totalPGs || 0, totalUsers: totalUsers || 0, totalBookings: totalBookings || 0, pendingBookings: pendingBookings || 0 }}
          recentBookings={recentBookings || []}
          allPGs={allPGs || []}
          leads={leads || []}
        />
      </div>
    </div>
  );
}
