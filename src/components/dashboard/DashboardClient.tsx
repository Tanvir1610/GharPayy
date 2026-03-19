"use client";
import { useState } from "react";
import Link from "next/link";
import { Home, Heart, Calendar, User, MapPin, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, Star } from "lucide-react";
import type { UserProfile } from "@/types";

interface Props {
  profile: UserProfile;
  bookings: any[];
  savedPGs: any[];
  visits: any[];
}

const STATUS_CONFIG = {
  Pending:   { color: "bg-yellow-100 text-yellow-700", icon: AlertCircle },
  Confirmed: { color: "bg-green-100 text-green-700",  icon: CheckCircle },
  Cancelled: { color: "bg-red-100 text-red-700",     icon: XCircle },
  Completed: { color: "bg-gray-100 text-gray-600",    icon: CheckCircle },
};

const TABS = [
  { id: "bookings", label: "Bookings",   icon: Home },
  { id: "saved",    label: "Saved PGs",  icon: Heart },
  { id: "visits",   label: "Visits",     icon: Calendar },
  { id: "profile",  label: "Profile",    icon: User },
];

export default function DashboardClient({ profile, bookings, savedPGs, visits }: Props) {
  const [activeTab, setActiveTab] = useState("bookings");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 font-display font-bold text-xl">
            {profile.full_name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">
              Hello, {profile.full_name?.split(" ")[0] || "there"}! 👋
            </h1>
            <p className="text-gray-500 text-sm">{profile.email}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: "Bookings", value: bookings.length, color: "text-orange-500" },
            { label: "Saved PGs", value: savedPGs.length, color: "text-pink-500" },
            { label: "Visits", value: visits.length, color: "text-blue-500" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
              <div className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-6 overflow-x-auto scrollbar-hide">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Bookings Tab ── */}
      {activeTab === "bookings" && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <EmptyState
              icon="🏠"
              title="No bookings yet"
              desc="Start exploring PGs and book your perfect stay"
              cta={{ label: "Browse PGs", href: "/browse" }}
            />
          ) : (
            bookings.map((b) => {
              const StatusIcon = STATUS_CONFIG[b.status as keyof typeof STATUS_CONFIG]?.icon || AlertCircle;
              const statusColor = STATUS_CONFIG[b.status as keyof typeof STATUS_CONFIG]?.color || "bg-gray-100 text-gray-600";
              return (
                <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-semibold text-gray-900">{b.pg?.gharpayy_name}</h3>
                        <span className={`badge ${statusColor}`}>
                          <StatusIcon className="w-3 h-3" />
                          {b.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{b.pg?.area}</span>
                        <span>{b.room_type}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Move-in: {new Date(b.move_in_date).toLocaleDateString("en-IN")}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-display font-bold text-orange-500 text-lg">₹{b.monthly_rent?.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">per month</div>
                    </div>
                  </div>
                  {b.pg?.google_maps_url && b.status === "Confirmed" && (
                    <a href={b.pg.google_maps_url} target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-medium">
                      <MapPin className="w-3 h-3" />
                      View on Google Maps
                    </a>
                  )}
                </div>
              );
            })
          )}
          <div className="text-center pt-2">
            <Link href="/browse" className="btn-primary inline-flex">
              <Home className="w-4 h-4" />
              Browse More PGs
            </Link>
          </div>
        </div>
      )}

      {/* ── Saved Tab ── */}
      {activeTab === "saved" && (
        <div>
          {savedPGs.length === 0 ? (
            <EmptyState icon="❤️" title="No saved PGs" desc="Heart a PG to save it here for later" cta={{ label: "Browse PGs", href: "/browse" }} />
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {savedPGs.map((s) => (
                <Link key={s.id} href={`/pg/${s.pg_id}`} className="bg-white rounded-2xl border border-gray-100 hover:border-orange-200 p-5 flex items-center justify-between group transition-all hover:shadow-sm">
                  <div>
                    <h3 className="font-display font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">{s.pg?.gharpayy_name}</h3>
                    <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{s.pg?.area}</p>
                    {s.pg?.price_double && (
                      <p className="text-sm font-semibold text-orange-500 mt-1">₹{s.pg.price_double.toLocaleString()}/mo</p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-400 transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Visits Tab ── */}
      {activeTab === "visits" && (
        <div className="space-y-4">
          {visits.length === 0 ? (
            <EmptyState icon="📅" title="No visits scheduled" desc="Schedule a visit to a PG before booking" cta={{ label: "Browse PGs", href: "/browse" }} />
          ) : (
            visits.map((v) => (
              <div key={v.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-gray-900">{v.pg?.gharpayy_name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{v.pg?.area}</p>
                  </div>
                  <span className={`badge ${v.status === "Scheduled" ? "bg-blue-100 text-blue-700" : v.status === "Completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {v.status}
                  </span>
                </div>
                <div className="mt-3 flex gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-orange-400" />{new Date(v.visit_date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-orange-400" />{v.visit_time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Profile Tab ── */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg">
          <h2 className="font-display font-semibold text-gray-900 mb-5">Profile Information</h2>
          <dl className="space-y-4">
            {[
              { label: "Full Name", value: profile.full_name },
              { label: "Email", value: profile.email },
              { label: "Phone", value: profile.phone || "Not set" },
              { label: "Role", value: profile.role },
              { label: "Member since", value: new Date(profile.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long" }) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-3 border-b border-gray-50 last:border-0">
                <dt className="text-sm text-gray-500 font-medium">{label}</dt>
                <dd className="text-sm text-gray-900 font-semibold capitalize">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, title, desc, cta }: { icon: string; title: string; desc: string; cta: { label: string; href: string } }) {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-display font-semibold text-gray-900 text-xl mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{desc}</p>
      <Link href={cta.href} className="btn-primary inline-flex">{cta.label}</Link>
    </div>
  );
}
