"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Home, Heart, Calendar, User, MapPin, Clock, CheckCircle,
  XCircle, AlertCircle, ChevronRight, Phone, Bookmark,
  Star, Zap, ArrowRight, Building2
} from "lucide-react";
import type { UserProfile } from "@/types";

interface Props {
  profile: UserProfile;
  bookings: any[];
  savedPGs: any[];
  visits: any[];
}

const STATUS: Record<string, { color: string; bg: string; icon: typeof CheckCircle }> = {
  Pending:   { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  icon: AlertCircle },
  Confirmed: { color: "#34d399", bg: "rgba(52,211,153,0.1)",  icon: CheckCircle },
  Cancelled: { color: "#f87171", bg: "rgba(248,113,113,0.1)", icon: XCircle },
  Completed: { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", icon: CheckCircle },
};

const VISIT_STATUS: Record<string, { color: string; bg: string }> = {
  Scheduled: { color: "#60a5fa", bg: "rgba(96,165,250,0.1)" },
  Completed: { color: "#34d399", bg: "rgba(52,211,153,0.1)" },
  Cancelled: { color: "#f87171", bg: "rgba(248,113,113,0.1)" },
};

const TABS = [
  { id: "bookings", label: "Bookings",  icon: Home,      count: (p: Props) => p.bookings.length },
  { id: "saved",    label: "Saved PGs", icon: Heart,     count: (p: Props) => p.savedPGs.length },
  { id: "visits",   label: "Visits",    icon: Calendar,  count: (p: Props) => p.visits.length },
  { id: "profile",  label: "Profile",   icon: User,      count: () => 0 },
];

export default function DashboardClient({ profile, bookings, savedPGs, visits }: Props) {
  const [activeTab, setActiveTab] = useState("bookings");

  const card = {
    background: "rgba(26,13,5,0.8)",
    border: "1px solid rgba(198,134,66,0.12)",
  };
  const divider = { borderColor: "rgba(198,134,66,0.08)" };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-display font-bold"
            style={{ background: "linear-gradient(135deg,#C68642,#E0A15A)", color: "#0F0702" }}>
            {profile.full_name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">
              {profile.full_name || "My Dashboard"}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#78716C" }}>
              {profile.email} · Tenant
            </p>
          </div>
        </div>
        <Link href="/browse"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all w-fit"
          style={{ background: "linear-gradient(135deg,#C68642,#E0A15A)", color: "#0F0702" }}>
          <Building2 className="w-4 h-4" />Browse PGs
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Bookings", value: bookings.length, color: "#C68642" },
          { label: "Saved PGs", value: savedPGs.length, color: "#a78bfa" },
          { label: "Visits", value: visits.length, color: "#34d399" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 text-center" style={card}>
            <p className="font-display text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs mt-1" style={{ color: "#78716C" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl mb-6 overflow-x-auto"
        style={{ background: "rgba(26,13,5,0.8)", border: "1px solid rgba(198,134,66,0.1)" }}>
        {TABS.map(({ id, label, icon: Icon, count }) => {
          const n = count({ profile, bookings, savedPGs, visits });
          return (
            <button key={id} onClick={() => setActiveTab(id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex-1 justify-center"
              style={{
                background: activeTab === id ? "linear-gradient(135deg,#C68642,#E0A15A)" : "transparent",
                color: activeTab === id ? "#0F0702" : "#78716C",
              }}>
              <Icon className="w-3.5 h-3.5" />{label}
              {n > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold ml-0.5"
                  style={{ background: activeTab === id ? "rgba(15,7,2,0.2)" : "rgba(198,134,66,0.15)", color: activeTab === id ? "#0F0702" : "#C68642" }}>
                  {n}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── BOOKINGS ── */}
      {activeTab === "bookings" && (
        <div className="rounded-2xl overflow-hidden" style={card}>
          {bookings.length === 0 ? (
            <div className="py-16 text-center">
              <Home className="w-10 h-10 mx-auto mb-3" style={{ color: "#57534E" }} />
              <p className="font-semibold text-white mb-1">No bookings yet</p>
              <p className="text-sm mb-4" style={{ color: "#57534E" }}>Find a PG and make your first booking</p>
              <Link href="/browse" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: "rgba(198,134,66,0.1)", color: "#E0A15A", border: "1px solid rgba(198,134,66,0.2)" }}>
                Browse PGs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : bookings.map((b, i) => {
            const cfg = STATUS[b.status] || STATUS.Pending;
            const Icon = cfg.icon;
            return (
              <div key={b.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
                style={{ background: "rgba(26,13,5,0.6)", borderBottom: i < bookings.length - 1 ? "1px solid rgba(198,134,66,0.06)" : "none" }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-white truncate">{b.pg?.gharpayy_name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: "rgba(198,134,66,0.1)", color: "#C68642" }}>
                      {b.pg?.area}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs" style={{ color: "#78716C" }}>
                    <span>{b.room_type}</span>
                    {b.move_in_date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(b.move_in_date).toLocaleDateString("en-IN")}</span>}
                    {b.monthly_rent && <span className="font-semibold" style={{ color: "#E0A15A" }}>₹{b.monthly_rent.toLocaleString("en-IN")}/mo</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full font-semibold"
                    style={{ background: cfg.bg, color: cfg.color }}>
                    <Icon className="w-3 h-3" />{b.status}
                  </span>
                  {b.pg_id && (
                    <Link href={`/pg/${b.pg_id}`}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(198,134,66,0.08)", color: "#C68642" }}>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── SAVED PGs ── */}
      {activeTab === "saved" && (
        <div>
          {savedPGs.length === 0 ? (
            <div className="rounded-2xl py-16 text-center" style={card}>
              <Heart className="w-10 h-10 mx-auto mb-3" style={{ color: "#57534E" }} />
              <p className="font-semibold text-white mb-1">No saved PGs yet</p>
              <p className="text-sm mb-4" style={{ color: "#57534E" }}>Tap the heart icon on any PG to save it</p>
              <Link href="/browse" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: "rgba(198,134,66,0.1)", color: "#E0A15A", border: "1px solid rgba(198,134,66,0.2)" }}>
                Browse PGs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedPGs.map(s => {
                const pg = s.pg;
                if (!pg) return null;
                const minPrice = Math.min(...[pg.price_triple, pg.price_double, pg.price_single].filter(Boolean));
                return (
                  <Link key={s.id} href={`/pg/${pg.id}`}
                    className="rounded-2xl p-4 flex flex-col gap-3 transition-all hover:border-[rgba(198,134,66,0.3)]"
                    style={card}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display font-bold text-white text-sm line-clamp-1">{pg.gharpayy_name}</h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" style={{ color: "#C68642" }} />
                          <span className="text-xs" style={{ color: "#78716C" }}>{pg.area}</span>
                        </div>
                      </div>
                      <Heart className="w-4 h-4 fill-[#E0A15A] text-[#E0A15A] flex-shrink-0" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs" style={{ color: "#57534E" }}>From</p>
                        <p className="font-display font-bold" style={{ color: "#E0A15A" }}>₹{minPrice?.toLocaleString("en-IN")}/mo</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                        style={{ background: "rgba(198,134,66,0.08)", color: "#A8A29E" }}>
                        {pg.gender} · {pg.property_type}
                      </div>
                    </div>
                    {pg.utilities_included?.includes("All Inclusive") && (
                      <p className="text-xs flex items-center gap-1" style={{ color: "#57534E" }}>
                        <Zap className="w-3 h-3" style={{ color: "#C68642" }} />All-inclusive
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── VISITS ── */}
      {activeTab === "visits" && (
        <div className="rounded-2xl overflow-hidden" style={card}>
          {visits.length === 0 ? (
            <div className="py-16 text-center">
              <Calendar className="w-10 h-10 mx-auto mb-3" style={{ color: "#57534E" }} />
              <p className="font-semibold text-white mb-1">No visits scheduled</p>
              <p className="text-sm" style={{ color: "#57534E" }}>Schedule a visit from any PG detail page</p>
            </div>
          ) : visits.map((v, i) => {
            const cfg = VISIT_STATUS[v.status] || VISIT_STATUS.Scheduled;
            return (
              <div key={v.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
                style={{ background: "rgba(26,13,5,0.6)", borderBottom: i < visits.length - 1 ? "1px solid rgba(198,134,66,0.06)" : "none" }}>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{v.pg?.gharpayy_name}</p>
                  <div className="flex gap-3 text-xs mt-1" style={{ color: "#78716C" }}>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{v.pg?.area}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(v.visit_date).toLocaleDateString("en-IN")}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{v.visit_time}</span>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1.5 rounded-full font-semibold flex-shrink-0"
                  style={{ background: cfg.bg, color: cfg.color }}>{v.status}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── PROFILE ── */}
      {activeTab === "profile" && (
        <div className="rounded-2xl p-6" style={card}>
          <h2 className="font-display text-lg font-bold text-white mb-5">Profile Information</h2>
          <div className="space-y-4">
            {[
              { label: "Full Name", value: profile.full_name || "—" },
              { label: "Email", value: profile.email || "—" },
              { label: "Phone", value: profile.phone || "—" },
              { label: "Role", value: profile.role === "tenant" ? "Tenant (Looking for PG)" : profile.role },
              { label: "Preferred Area", value: profile.preferred_area || "—" },
              { label: "Max Budget", value: profile.budget_max ? `₹${profile.budget_max.toLocaleString("en-IN")}/mo` : "—" },
              { label: "Member since", value: new Date(profile.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between py-3"
                style={{ borderBottom: "1px solid rgba(198,134,66,0.06)" }}>
                <p className="text-sm" style={{ color: "#78716C" }}>{label}</p>
                <p className="text-sm font-medium text-white text-right">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(198,134,66,0.06)", border: "1px solid rgba(198,134,66,0.12)" }}>
            <p className="text-xs" style={{ color: "#78716C" }}>
              Want to list your own PG?{" "}
              <Link href="/register/owner" className="font-semibold" style={{ color: "#E0A15A" }}>
                Create an Owner account →
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
