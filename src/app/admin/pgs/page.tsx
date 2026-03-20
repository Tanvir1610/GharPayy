import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { MapPin, Check, X, ExternalLink } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata = { title: "Manage PGs | Admin | Gharpayy" };

export default async function AdminPGsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const supabase = createAdminClient();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const { data: pgs } = await supabase
    .from("pg_properties")
    .select("*")
    .order("area", { ascending: true });

  return (
    <div className="min-h-screen" style={{ background: "#0F0702" }}>
      <Navbar />
      <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">All PG Listings</h1>
            <p className="text-sm mt-1" style={{ color: "#A8A29E" }}>{pgs?.length || 0} properties in database</p>
          </div>
          <Link href="/admin" className="btn-secondary text-sm">← Back to Dashboard</Link>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: "#1A0D05", border: "1px solid rgba(198,134,66,0.15)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: "rgba(198,134,66,0.05)" }}>
                <tr>
                  {["PG Name", "Area", "Gender", "Type", "Price (Double)", "Available", "Approved", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: "#78716C" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pgs?.map(pg => (
                  <tr key={pg.id} className="border-t" style={{ borderColor: "rgba(198,134,66,0.07)" }}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{pg.gharpayy_name}</div>
                      {pg.actual_name && <div className="text-xs" style={{ color: "#57534E" }}>{pg.actual_name}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1" style={{ color: "#A8A29E" }}>
                        <MapPin className="w-3 h-3" />{pg.area}
                      </div>
                      <div className="text-xs" style={{ color: "#57534E" }}>{pg.locality}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full font-semibold"
                        style={{
                          background: pg.gender === "Boys" ? "rgba(59,130,246,0.15)" : pg.gender === "Girls" ? "rgba(244,114,182,0.15)" : "rgba(16,185,129,0.15)",
                          color: pg.gender === "Boys" ? "#93c5fd" : pg.gender === "Girls" ? "#f9a8d4" : "#6ee7b7",
                        }}>
                        {pg.gender}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full font-semibold"
                        style={{
                          background: pg.property_type === "Premium" ? "rgba(198,134,66,0.2)" : "rgba(255,255,255,0.06)",
                          color: pg.property_type === "Premium" ? "#E0A15A" : "#A8A29E",
                        }}>
                        {pg.property_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {pg.price_double ? (
                        <span className="font-bold" style={{ color: "#E0A15A" }}>₹{pg.price_double.toLocaleString()}</span>
                      ) : <span style={{ color: "#57534E" }}>—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {pg.is_available ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {pg.is_approved ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/pg/${pg.id}`}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ background: "rgba(255,255,255,0.05)", color: "#78716C" }}>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        {pg.google_maps_url && (
                          <a href={pg.google_maps_url} target="_blank" rel="noreferrer"
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ background: "rgba(255,255,255,0.05)", color: "#78716C" }}>
                            <MapPin className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
