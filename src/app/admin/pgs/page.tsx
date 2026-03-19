import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Building2, MapPin, Users, Check, X, ExternalLink } from "lucide-react";

export const metadata = { title: "Manage PGs | Admin | Gharpayy" };

export default async function AdminPGsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const { data: pgs } = await supabase
    .from("pg_properties")
    .select("*")
    .order("area", { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">All PG Listings</h1>
            <p className="text-gray-500 text-sm mt-1">{pgs?.length || 0} properties in database</p>
          </div>
          <Link href="/admin" className="btn-secondary text-sm">← Back to Dashboard</Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["PG Name", "Area", "Gender", "Type", "Pricing", "Available", "Approved", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pgs?.map(pg => (
                  <tr key={pg.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{pg.gharpayy_name}</div>
                      {pg.actual_name && <div className="text-xs text-gray-400">{pg.actual_name}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3 h-3" />
                        {pg.area}
                      </div>
                      <div className="text-xs text-gray-400">{pg.locality}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${pg.gender === "Boys" ? "badge-navy" : pg.gender === "Girls" ? "badge-orange" : "badge-green"}`}>
                        {pg.gender}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${pg.property_type === "Premium" ? "bg-yellow-100 text-yellow-700" : pg.property_type === "Mid" ? "badge-navy" : "badge-green"}`}>
                        {pg.property_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {pg.price_double ? (
                        <span className="font-medium text-orange-500">₹{pg.price_double.toLocaleString()}</span>
                      ) : "—"}
                      {pg.price_single && <span className="text-gray-400 text-xs ml-1">/ ₹{pg.price_single.toLocaleString()}</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {pg.is_available
                        ? <Check className="w-4 h-4 text-green-500 mx-auto" />
                        : <X className="w-4 h-4 text-red-400 mx-auto" />}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {pg.is_approved
                        ? <Check className="w-4 h-4 text-green-500 mx-auto" />
                        : <X className="w-4 h-4 text-red-400 mx-auto" />}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/pg/${pg.id}`} className="p-1.5 rounded-lg bg-gray-50 hover:bg-orange-50 text-gray-500 hover:text-orange-500 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        {pg.google_maps_url && (
                          <a href={pg.google_maps_url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-500 transition-colors">
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
