"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Home, Search, Building2, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selected, setSelected] = useState<"tenant" | "owner" | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!selected || !user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selected }),
      });
      if (res.ok) {
        router.push(selected === "owner" ? "/owner/dashboard" : "/dashboard");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg,#0F0702 0%,#1A0D05 50%,#2A1408 100%)" }}>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#C68642,#E0A15A)" }}>
          <Home className="w-5 h-5" style={{ color: "#0F0702" }} />
        </div>
        <span className="font-display text-2xl font-bold text-white">Gharpayy</span>
      </Link>

      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-white mb-3">
            Welcome{user?.firstName ? `, ${user.firstName}` : ""}! 👋
          </h1>
          <p className="text-base" style={{ color: "#A8A29E" }}>
            Tell us how you're using Gharpayy so we can set up the right experience for you.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

          {/* Tenant Card */}
          <button
            onClick={() => setSelected("tenant")}
            className="relative rounded-2xl p-6 text-left transition-all duration-200"
            style={{
              background: selected === "tenant" ? "rgba(198,134,66,0.12)" : "rgba(26,13,5,0.8)",
              border: `2px solid ${selected === "tenant" ? "#C68642" : "rgba(198,134,66,0.15)"}`,
              boxShadow: selected === "tenant" ? "0 0 24px rgba(198,134,66,0.15)" : "none",
            }}>
            {selected === "tenant" && (
              <CheckCircle className="absolute top-4 right-4 w-5 h-5" style={{ color: "#C68642" }} />
            )}
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: selected === "tenant" ? "rgba(198,134,66,0.2)" : "rgba(255,255,255,0.05)" }}>
              <Search className="w-6 h-6" style={{ color: selected === "tenant" ? "#E0A15A" : "#78716C" }} />
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">Looking for a PG</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#78716C" }}>
              Browse verified PGs, save favourites, schedule visits and book your next home.
            </p>
            <ul className="mt-3 space-y-1.5">
              {["Browse 132+ PGs in Bangalore", "Save & compare properties", "Schedule visits instantly"].map(t => (
                <li key={t} className="flex items-center gap-2 text-xs" style={{ color: "#A8A29E" }}>
                  <span style={{ color: "#C68642" }}>✓</span>{t}
                </li>
              ))}
            </ul>
          </button>

          {/* Owner Card */}
          <button
            onClick={() => setSelected("owner")}
            className="relative rounded-2xl p-6 text-left transition-all duration-200"
            style={{
              background: selected === "owner" ? "rgba(59,130,246,0.1)" : "rgba(26,13,5,0.8)",
              border: `2px solid ${selected === "owner" ? "#3b82f6" : "rgba(198,134,66,0.15)"}`,
              boxShadow: selected === "owner" ? "0 0 24px rgba(59,130,246,0.12)" : "none",
            }}>
            {selected === "owner" && (
              <CheckCircle className="absolute top-4 right-4 w-5 h-5" style={{ color: "#3b82f6" }} />
            )}
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: selected === "owner" ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.05)" }}>
              <Building2 className="w-6 h-6" style={{ color: selected === "owner" ? "#93c5fd" : "#78716C" }} />
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2">I'm a PG Owner</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#78716C" }}>
              List your properties, manage bookings, track leads and grow your occupancy.
            </p>
            <ul className="mt-3 space-y-1.5">
              {["List & manage your PGs", "Receive booking requests", "Track leads & inquiries"].map(t => (
                <li key={t} className="flex items-center gap-2 text-xs" style={{ color: "#A8A29E" }}>
                  <span style={{ color: "#3b82f6" }}>✓</span>{t}
                </li>
              ))}
            </ul>
          </button>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: selected ? "linear-gradient(135deg,#C68642,#E0A15A)" : "rgba(255,255,255,0.06)",
            color: selected ? "#0F0702" : "#57534E",
            border: selected ? "none" : "1px solid rgba(255,255,255,0.08)",
          }}>
          {loading ? (
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(15,7,2,0.3)" strokeWidth="3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="#0F0702" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          ) : (
            <>{selected ? "Continue" : "Select your role to continue"} {selected && <ArrowRight className="w-5 h-5" />}</>
          )}
        </button>
      </div>
    </div>
  );
}
