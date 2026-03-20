import Link from "next/link";
import { Home, Search, Building2, ArrowRight } from "lucide-react";

export const metadata = { title: "Create Account | Gharpayy" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: "linear-gradient(135deg,#0F0702 0%,#1A0D05 50%,#2A1408 100%)" }}>

      <Link href="/" className="flex items-center gap-2.5 mb-10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#C68642,#E0A15A)" }}>
          <Home className="w-5 h-5" style={{ color: "#0F0702" }} />
        </div>
        <span className="font-display text-2xl font-bold text-white">Gharpayy</span>
      </Link>

      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-white mb-3">Join Gharpayy</h1>
          <p className="text-base" style={{ color: "#A8A29E" }}>Choose how you want to use the platform</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">

          {/* Tenant Card */}
          <Link href="/register/tenant"
            className="group relative rounded-2xl p-7 flex flex-col gap-4 transition-all duration-200 hover:bg-[rgba(198,134,66,0.07)] hover:border-[rgba(198,134,66,0.5)]"
            style={{ background: "rgba(26,13,5,0.85)", border: "1px solid rgba(198,134,66,0.18)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(198,134,66,0.12)" }}>
              <Search className="w-7 h-7" style={{ color: "#E0A15A" }} />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-1">Looking for a PG</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#78716C" }}>
                Browse verified PGs in Bangalore, save favourites and book your next home.
              </p>
            </div>
            <ul className="space-y-1.5 flex-1">
              {["Browse 130+ verified PGs", "Save & compare properties", "Schedule visits instantly", "Track your bookings"].map(t => (
                <li key={t} className="flex items-center gap-2 text-xs" style={{ color: "#A8A29E" }}>
                  <span style={{ color: "#C68642" }}>✓</span>{t}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 font-semibold text-sm mt-2" style={{ color: "#E0A15A" }}>
              Get Started <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Owner Card */}
          <Link href="/register/owner"
            className="group relative rounded-2xl p-7 flex flex-col gap-4 transition-all duration-200 hover:bg-[rgba(59,130,246,0.07)] hover:border-[rgba(59,130,246,0.5)]"
            style={{ background: "rgba(26,13,5,0.85)", border: "1px solid rgba(59,130,246,0.18)" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(59,130,246,0.12)" }}>
              <Building2 className="w-7 h-7" style={{ color: "#93c5fd" }} />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-1">I'm a PG Owner</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#78716C" }}>
                List your properties, manage bookings and grow your occupancy with Gharpayy.
              </p>
            </div>
            <ul className="space-y-1.5 flex-1">
              {["List & manage your PGs", "Receive booking requests", "Track leads & inquiries", "Approve/reject bookings"].map(t => (
                <li key={t} className="flex items-center gap-2 text-xs" style={{ color: "#A8A29E" }}>
                  <span style={{ color: "#3b82f6" }}>✓</span>{t}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 font-semibold text-sm mt-2" style={{ color: "#93c5fd" }}>
              List Your PG <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        <p className="text-xs text-center mt-6" style={{ color: "#57534E" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold" style={{ color: "#C68642" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
