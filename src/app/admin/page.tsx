import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import AdminClient from "@/components/dashboard/AdminClient";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin Panel | Gharpayy" };

export default async function AdminPage() {
  // Verify admin cookie session
  const cookieStore = await cookies();
  const session = cookieStore.get("gharpayy_admin_session");
  const secret = process.env.ADMIN_SESSION_SECRET || "gharpayy-admin-secret-2024";
  if (!session || session.value !== secret) redirect("/admin-login");

  const supabase = createAdminClient();

  const [
    { count: totalPGs },
    { count: totalUsers },
    { count: totalBookings },
    { count: pendingBookings },
    { data: recentBookings },
    { data: allLeads },
    { data: allPGs },
  ] = await Promise.all([
    supabase.from("pg_properties").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "Pending"),
    supabase.from("bookings")
      .select("*, pg:pg_properties(gharpayy_name, area), user:profiles(full_name, email)")
      .order("created_at", { ascending: false }).limit(20),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("pg_properties").select("*").order("area", { ascending: true }),
  ]);

  return (
    <div className="min-h-screen" style={{ background: "#0F0702" }}>
      <div className="pt-0">
        <AdminClient
          stats={{ totalPGs: totalPGs || 0, totalUsers: totalUsers || 0, totalBookings: totalBookings || 0, pendingBookings: pendingBookings || 0 }}
          recentBookings={recentBookings || []}
          allPGs={allPGs || []}
          leads={allLeads || []}
        />
      </div>
    </div>
  );
}
