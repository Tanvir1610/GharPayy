"use client";
import { useState } from "react";
import { Building2, Users, ClipboardList, AlertCircle, TrendingUp, MapPin, CheckCircle, XCircle, LogOut, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  stats: { totalPGs: number; totalUsers: number; totalBookings: number; pendingBookings: number };
  recentBookings: any[];
  allPGs: any[];
  leads: any[];
}

const TABS = ["Overview", "Bookings", "PGs by Area", "Leads"];

const AREA_COLORS: Record<string, string> = {
  Koramangala: "bg-orange-500",
  Bellandur: "bg-teal-500",
  Whitefield: "bg-violet-500",
  Mahadevapura: "bg-blue-500",
  Marathahalli: "bg-amber-500",
  "Electronic City": "bg-emerald-500",
  "HSR Layout": "bg-pink-500",
  Jayanagar: "bg-sky-500",
  "MG Road": "bg-red-500",
  Nagawara: "bg-indigo-500",
};

export default function AdminClient({ stats, recentBookings, allPGs, leads }: Props) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [bookings, setBookings] = useState(recentBookings);
  const supabase = createClient();

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) { toast.error("Update failed"); return; }
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    toast.success(`Booking ${status.toLowerCase()}`);
  };

  // Area counts
  const areaCounts = allPGs.reduce((acc: Record<string, number>, pg) => {
    acc[pg.area] = (acc[pg.area] || 0) + 1;
    return acc;
  }, {});
  const sortedAreas = Object.entries(areaCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedAreas[0]?.[1] || 1;

  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin-login");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5" style={{ color: "#ef4444" }} />
            <h1 className="font-display text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-sm" style={{ color: "#78716C" }}>Gharpayy platform overview · Full access</p>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
          <LogOut className="w-4 h-4" />Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total PGs", value: stats.totalPGs, icon: Building2, color: "text-blue-500 bg-blue-50" },
          { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-green-500 bg-green-50" },
          { label: "Total Bookings", value: stats.totalBookings, icon: ClipboardList, color: "text-orange-500 bg-orange-50" },
          { label: "Pending", value: stats.pendingBookings, icon: AlertCircle, color: "text-red-500 bg-red-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="font-display font-bold text-2xl text-gray-900">{value}</div>
            <div className="text-sm text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-6 w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "Overview" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              PGs by Area
            </h3>
            <div className="space-y-3">
              {sortedAreas.slice(0, 8).map(([area, count]) => (
                <div key={area} className="flex items-center gap-3">
                  <div className="w-28 text-sm text-gray-600 font-medium shrink-0">{area}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${AREA_COLORS[area] || "bg-gray-400"} transition-all`}
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-display font-semibold text-gray-900 mb-4">Recent Bookings</h3>
            <div className="space-y-3">
              {bookings.slice(0, 5).map(b => (
                <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{b.user?.full_name || "User"}</div>
                    <div className="text-xs text-gray-400">{b.pg?.gharpayy_name} · {b.room_type}</div>
                  </div>
                  <span className={`badge ${b.status === "Confirmed" ? "badge-green" : b.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "badge-gray"}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bookings Management */}
      {activeTab === "Bookings" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-display font-semibold text-gray-900">All Bookings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Tenant", "PG", "Room Type", "Move-in", "Rent", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">{b.user?.full_name || "—"}</div>
                      <div className="text-gray-400 text-xs">{b.user?.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">{b.pg?.gharpayy_name || "—"}</div>
                      <div className="text-gray-400 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{b.pg?.area}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{b.room_type}</td>
                    <td className="px-5 py-4 text-gray-600">{b.move_in_date ? new Date(b.move_in_date).toLocaleDateString("en-IN") : "—"}</td>
                    <td className="px-5 py-4 font-semibold text-orange-500">₹{b.monthly_rent?.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${b.status === "Confirmed" ? "badge-green" : b.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "badge-gray"}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {b.status === "Pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => updateBookingStatus(b.id, "Confirmed")} className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => updateBookingStatus(b.id, "Cancelled")} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PGs by Area */}
      {activeTab === "PGs by Area" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAreas.map(([area, count]) => {
            const areaGender = allPGs.filter(p => p.area === area);
            const boys = areaGender.filter(p => p.gender === "Boys").length;
            const girls = areaGender.filter(p => p.gender === "Girls").length;
            const coed = areaGender.filter(p => p.gender === "Co-live").length;
            return (
              <div key={area} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display font-semibold text-gray-900">{area}</h3>
                    <p className="text-sm text-gray-400">{count} properties</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${AREA_COLORS[area] || "bg-gray-400"}`} />
                </div>
                <div className="flex gap-3 text-xs">
                  {boys > 0 && <span className="badge badge-navy">👦 {boys} Boys</span>}
                  {girls > 0 && <span className="badge badge-orange">👧 {girls} Girls</span>}
                  {coed > 0 && <span className="badge badge-green">🤝 {coed} Coed</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leads */}
      {activeTab === "Leads" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-display font-semibold text-gray-900">Enquiries & Leads</h3>
          </div>
          {leads.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No leads yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {["Name", "Phone", "Area", "Budget", "Move-in", "Status"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.map(l => (
                    <tr key={l.id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-4 font-medium text-gray-900">{l.name}</td>
                      <td className="px-5 py-4 text-gray-600">{l.phone}</td>
                      <td className="px-5 py-4 text-gray-600">{l.preferred_area}</td>
                      <td className="px-5 py-4 text-gray-600">₹{l.budget_max?.toLocaleString()}</td>
                      <td className="px-5 py-4 text-gray-600">{l.move_in_date ? new Date(l.move_in_date).toLocaleDateString("en-IN") : "—"}</td>
                      <td className="px-5 py-4">
                        <span className={`badge ${l.status === "New" ? "badge-orange" : l.status === "Converted" ? "badge-green" : "badge-gray"}`}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
