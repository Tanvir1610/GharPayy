"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Building2, Users, ClipboardList, TrendingUp, MapPin, CheckCircle,
  XCircle, AlertCircle, Phone, Mail, Home, Eye, Plus, ChevronRight,
  BarChart2, Star, Zap, Calendar
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { UserProfile } from "@/types";

interface Props {
  profile: UserProfile;
  stats: { totalPGs: number; totalBookings: number; pendingBookings: number; totalLeads: number };
  pgs: any[];
  bookings: any[];
  leads: any[];
}

const TABS = ["Overview", "My PGs", "Bookings", "Leads"];

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: typeof CheckCircle }> = {
  Pending:   { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  icon: AlertCircle },
  Confirmed: { color: "#34d399", bg: "rgba(52,211,153,0.1)",  icon: CheckCircle },
  Cancelled: { color: "#f87171", bg: "rgba(248,113,113,0.1)", icon: XCircle },
  Completed: { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", icon: CheckCircle },
};

const LEAD_STATUS: Record<string, { color: string; bg: string }> = {
  New:       { color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  Contacted: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
  Visited:   { color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  Converted: { color: "#34d399", bg: "rgba(52,211,153,0.1)" },
  Lost:      { color: "#f87171", bg: "rgba(248,113,113,0.1)" },
};

export default function OwnerDashboardClient({ profile, stats, pgs, bookings, leads }: Props) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [updatingBooking, setUpdatingBooking] = useState<string | null>(null);

  async function updateBookingStatus(id: string, status: string) {
    setUpdatingBooking(id);
    const supabase = createClient();
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) toast.error("Failed to update");
    else toast.success(`Booking ${status.toLowerCase()}`);
    setUpdatingBooking(null);
    window.location.reload();
  }

  const statCards = [
    { label: "Total PGs", value: stats.totalPGs, icon: Building2, color: "#C68642", bg: "rgba(198,134,66,0.1)" },
    { label: "Total Bookings", value: stats.totalBookings, icon: ClipboardList, color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
    { label: "Pending Approval", value: stats.pendingBookings, icon: AlertCircle, color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
    { label: "Total Leads", value: stats.totalLeads, icon: TrendingUp, color: "#34d399", bg: "rgba(52,211,153,0.1)" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            Owner Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: "#A8A29E" }}>
            Welcome back, {profile.full_name || "Owner"} · Managing {stats.totalPGs} properties
          </p>
        </div>
        <Link href="/admin/pgs/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
          style={{ background: "linear-gradient(135deg,#C68642,#E0A15A)", color: "#0F0702" }}>
          <Plus className="w-4 h-4" />List New PG
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl p-5"
            style={{ background: "rgba(26,13,5,0.8)", border: "1px solid rgba(198,134,66,0.12)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <BarChart2 className="w-4 h-4" style={{ color: "#57534E" }} />
            </div>
            <p className="font-display text-3xl font-bold text-white">{value}</p>
            <p className="text-xs mt-1" style={{ color: "#78716C" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl mb-6 w-fit"
        style={{ background: "rgba(26,13,5,0.8)", border: "1px solid rgba(198,134,66,0.1)" }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: activeTab === tab ? "linear-gradient(135deg,#C68642,#E0A15A)" : "transparent",
              color: activeTab === tab ? "#0F0702" : "#78716C",
            }}>
            {tab}
            {tab === "Bookings" && stats.pendingBookings > 0 && (
              <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: activeTab === tab ? "rgba(15,7,2,0.2)" : "rgba(198,134,66,0.2)", color: activeTab === tab ? "#0F0702" : "#C68642" }}>
                {stats.pendingBookings}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === "Overview" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(26,13,5,0.8)", border: "1px solid rgba(198,134,66,0.12)" }}>
            <h2 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5" style={{ color: "#C68642" }} />Recent Bookings
            </h2>
            {bookings.slice(0, 5).length === 0 ? (
              <p className="text-sm text-center py-6" style={{ color: "#57534E" }}>No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map(b => {
                  const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.Pending;
                  const Icon = cfg.icon;
                  return (
                    <div key={b.id} className="flex items-center justify-between gap-3 p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(198,134,66,0.06)" }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{b.pg?.gharpayy_name}</p>
                        <p className="text-xs truncate" style={{ color: "#78716C" }}>{b.user?.full_name} · {b.room_type}</p>
                      </div>
                      <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
                        style={{ background: cfg.bg, color: cfg.color }}>
                        <Icon className="w-3 h-3" />{b.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            <button onClick={() => setActiveTab("Bookings")}
              className="w-full mt-4 py-2 text-sm font-semibold rounded-xl transition-all"
              style={{ background: "rgba(198,134,66,0.08)", color: "#C68642", border: "1px solid rgba(198,134,66,0.15)" }}>
              View all bookings <ChevronRight className="w-4 h-4 inline" />
            </button>
          </div>

          {/* Recent Leads */}
          <div className="rounded-2xl p-5" style={{ background: "rgba(26,13,5,0.8)", border: "1px solid rgba(198,134,66,0.12)" }}>
            <h2 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" style={{ color: "#C68642" }} />Recent Leads
            </h2>
            {leads.slice(0, 5).length === 0 ? (
              <p className="text-sm text-center py-6" style={{ color: "#57534E" }}>No leads yet</p>
            ) : (
              <div className="space-y-3">
                {leads.slice(0, 5).map(l => {
                  const cfg = LEAD_STATUS[l.status] || LEAD_STATUS.New;
                  return (
                    <div key={l.id} className="flex items-center justify-between gap-3 p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(198,134,66,0.06)" }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{l.name}</p>
                        <p className="text-xs truncate" style={{ color: "#78716C" }}>
                          {l.preferred_area} · ₹{(l.budget_min/1000).toFixed(0)}k–{(l.budget_max/1000).toFixed(0)}k
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{ background: cfg.bg, color: cfg.color }}>{l.status}</span>
                        <a href={"tel:" + l.phone} className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                          style={{ background: "rgba(198,134,66,0.1)", color: "#C68642" }}>
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <button onClick={() => setActiveTab("Leads")}
              className="w-full mt-4 py-2 text-sm font-semibold rounded-xl transition-all"
              style={{ background: "rgba(198,134,66,0.08)", color: "#C68642", border: "1px solid rgba(198,134,66,0.15)" }}>
              View all leads <ChevronRight className="w-4 h-4 inline" />
            </button>
          </div>
        </div>
      )}

      {/* ── MY PGs ── */}
      {activeTab === "My PGs" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color: "#A8A29E" }}>{pgs.length} properties listed</p>
            <Link href="/admin/pgs/new"
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl"
              style={{ background: "rgba(198,134,66,0.1)", color: "#E0A15A", border: "1px solid rgba(198,134,66,0.2)" }}>
              <Plus className="w-4 h-4" />Add PG
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pgs.map(pg => (
              <div key={pg.id} className="rounded-2xl p-4"
                style={{ background: "rgba(26,13,5,0.8)", border: "1px solid rgba(198,134,66,0.12)" }}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-display font-bold text-white text-sm line-clamp-1">{pg.gharpayy_name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" style={{ color: "#C68642" }} />
                      <span className="text-xs" style={{ color: "#78716C" }}>{pg.area}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${pg.is_available ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"}`}>
                    {pg.is_available ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {[["Triple", pg.price_triple], ["Double", pg.price_double], ["Single", pg.price_single]].map(([l, p]) =>
                    p ? (
                      <div key={l as string} className="text-center rounded-lg p-1.5"
                        style={{ background: "rgba(198,134,66,0.06)", border: "1px solid rgba(198,134,66,0.1)" }}>
                        <p className="text-xs" style={{ color: "#78716C" }}>{l}</p>
                        <p className="text-xs font-bold" style={{ color: "#E0A15A" }}>₹{(p as number / 1000).toFixed(0)}k</p>
                      </div>
                    ) : null
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href={"/pg/" + pg.id}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold"
                    style={{ background: "rgba(198,134,66,0.08)", color: "#C68642", border: "1px solid rgba(198,134,66,0.15)" }}>
                    <Eye className="w-3.5 h-3.5" />View
                  </Link>
                  {pg.google_maps_url && (
                    <a href={pg.google_maps_url} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold"
                      style={{ background: "rgba(255,255,255,0.04)", color: "#78716C", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <MapPin className="w-3.5 h-3.5" />Map
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BOOKINGS ── */}
      {activeTab === "Bookings" && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(198,134,66,0.12)" }}>
          <div className="px-5 py-4" style={{ background: "rgba(26,13,5,0.9)", borderBottom: "1px solid rgba(198,134,66,0.1)" }}>
            <h2 className="font-display text-lg font-bold text-white">All Booking Requests</h2>
          </div>
          <div className="divide-y" style={{ divideColor: "rgba(198,134,66,0.06)" }}>
            {bookings.length === 0 ? (
              <div className="py-12 text-center" style={{ color: "#57534E" }}>No bookings yet</div>
            ) : bookings.map(b => {
              const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.Pending;
              const Icon = cfg.icon;
              return (
                <div key={b.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
                  style={{ background: "rgba(26,13,5,0.6)" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Home className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#C68642" }} />
                      <p className="font-semibold text-white text-sm truncate">{b.pg?.gharpayy_name}</p>
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(198,134,66,0.1)", color: "#C68642" }}>{b.pg?.area}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs" style={{ color: "#78716C" }}>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{b.user?.full_name}</span>
                      <span>{b.room_type}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(b.move_in_date).toLocaleDateString("en-IN")}</span>
                      <span className="font-semibold" style={{ color: "#E0A15A" }}>₹{b.monthly_rent?.toLocaleString("en-IN")}/mo</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full font-semibold"
                      style={{ background: cfg.bg, color: cfg.color }}>
                      <Icon className="w-3 h-3" />{b.status}
                    </span>
                    {b.status === "Pending" && (
                      <>
                        <button onClick={() => updateBookingStatus(b.id, "Confirmed")} disabled={updatingBooking === b.id}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
                          style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}>
                          <CheckCircle className="w-3 h-3" />Confirm
                        </button>
                        <button onClick={() => updateBookingStatus(b.id, "Cancelled")} disabled={updatingBooking === b.id}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
                          style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                          <XCircle className="w-3 h-3" />Reject
                        </button>
                      </>
                    )}
                    {b.user?.email && (
                      <a href={"mailto:" + b.user.email}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                        style={{ background: "rgba(198,134,66,0.08)", color: "#C68642", border: "1px solid rgba(198,134,66,0.15)" }}>
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── LEADS ── */}
      {activeTab === "Leads" && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(198,134,66,0.12)" }}>
          <div className="px-5 py-4" style={{ background: "rgba(26,13,5,0.9)", borderBottom: "1px solid rgba(198,134,66,0.1)" }}>
            <h2 className="font-display text-lg font-bold text-white">All Leads & Inquiries</h2>
          </div>
          <div className="divide-y" style={{ divideColor: "rgba(198,134,66,0.06)" }}>
            {leads.length === 0 ? (
              <div className="py-12 text-center" style={{ color: "#57534E" }}>No leads yet</div>
            ) : leads.map(l => {
              const cfg = LEAD_STATUS[l.status] || LEAD_STATUS.New;
              return (
                <div key={l.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
                  style={{ background: "rgba(26,13,5,0.6)" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white text-sm">{l.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: cfg.bg, color: cfg.color }}>{l.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs" style={{ color: "#78716C" }}>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{l.preferred_area}</span>
                      <span>₹{(l.budget_min/1000).toFixed(0)}k–{(l.budget_max/1000).toFixed(0)}k/mo</span>
                      <span>{l.preferred_gender} · {l.preferred_room_type}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Move-in: {new Date(l.move_in_date).toLocaleDateString("en-IN")}</span>
                    </div>
                    {l.notes && <p className="text-xs mt-1 italic" style={{ color: "#57534E" }}>"{l.notes}"</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a href={"tel:" + l.phone}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                      style={{ background: "rgba(198,134,66,0.1)", color: "#E0A15A", border: "1px solid rgba(198,134,66,0.2)" }}>
                      <Phone className="w-3.5 h-3.5" />{l.phone}
                    </a>
                    {l.email && (
                      <a href={"mailto:" + l.email}
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(255,255,255,0.04)", color: "#78716C", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
