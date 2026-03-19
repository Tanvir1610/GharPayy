import Link from "next/link";
import { Wifi, Utensils, Shield, ChevronRight, Search, Users } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/server";
import PGCard from "@/components/pg/PGCard";
import HeroSearch from "@/components/pg/HeroSearch";
import QuickFilters from "@/components/pg/QuickFilters";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const AREAS = [
  { name: "Koramangala",     count: "15+ PGs", emoji: "🏙️" },
  { name: "Bellandur",       count: "8+ PGs",  emoji: "🌿" },
  { name: "Whitefield",      count: "10+ PGs", emoji: "🚇" },
  { name: "Mahadevapura",    count: "7+ PGs",  emoji: "💼" },
  { name: "Marathahalli",    count: "6+ PGs",  emoji: "🏢" },
  { name: "Electronic City", count: "5+ PGs",  emoji: "⚡" },
  { name: "HSR Layout",      count: "4+ PGs",  emoji: "🌟" },
  { name: "Jayanagar",       count: "3+ PGs",  emoji: "🏡" },
];

const FEATURES = [
  { icon: Wifi,     title: "All-Inclusive Rent",   desc: "Wi-Fi, electricity & water in one flat fee. No hidden charges." },
  { icon: Utensils, title: "Home-Style Meals",      desc: "3–4 nutritious meals prepared fresh every day." },
  { icon: Shield,   title: "Verified Properties",   desc: "Every PG is personally visited and verified by our team." },
  { icon: Users,    title: "Vibrant Community",     desc: "Meet like-minded professionals and students." },
];

const STATS = [
  { value: "120+", label: "Verified PGs" },
  { value: "10K+", label: "Happy Residents" },
  { value: "15+",  label: "Prime Locations" },
  { value: "4.8★", label: "Average Rating" },
];

export default async function HomePage() {
  const supabase = createAdminClient();

  const { data: featuredPGs } = await supabase
    .from("pg_properties")
    .select("*")
    .eq("is_approved", true)
    .eq("is_available", true)
    .in("property_type", ["Premium", "Mid"])
    .order("created_at", { ascending: false })
    .limit(6);

  const { data: budgetPGs } = await supabase
    .from("pg_properties")
    .select("*")
    .eq("is_approved", true)
    .eq("is_available", true)
    .lte("price_double", 13000)
    .order("price_double", { ascending: true })
    .limit(3);

  return (
    <div className="min-h-screen" style={{ background: "#0F0702" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden pt-24 pb-36"
        style={{ background: "linear-gradient(135deg,#0F0702 0%,#1A0D05 50%,#2A1408 100%)" }}
      >
        {/* Decorative orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle,rgba(198,134,66,0.12) 0%,transparent 70%)" }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle,rgba(198,134,66,0.08) 0%,transparent 70%)" }}
          />
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-px"
            style={{ background: "linear-gradient(90deg,transparent,rgba(198,134,66,0.2),transparent)" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Live badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-up-1"
            style={{
              background: "rgba(198,134,66,0.1)",
              border: "1px solid rgba(198,134,66,0.25)",
              color: "#E0A15A",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Rooms available now in Bangalore
          </div>

          {/* Headline */}
          <h1
            className="font-display font-bold leading-tight mb-6 animate-fade-up-2"
            style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", color: "#FFFFFF" }}
          >
            Find Your Perfect
            <span className="block gold-text mt-1">PG in Bangalore</span>
          </h1>

          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fade-up-3"
            style={{ color: "#A8A29E" }}
          >
            120+ verified paying guest accommodations across prime Bangalore locations.
            Fully furnished, meals included, zero brokerage.
          </p>

          {/* Search — client component */}
          <div className="animate-fade-up-4">
            <HeroSearch />
          </div>

          {/* Quick filters — client component */}
          <QuickFilters />
        </div>
      </section>

      {/* ── STATS ── */}
      <section
        style={{
          background: "#1A0D05",
          borderTop: "1px solid rgba(198,134,66,0.1)",
          borderBottom: "1px solid rgba(198,134,66,0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold mb-1 gold-text">
                  {stat.value}
                </div>
                <div className="text-sm font-medium" style={{ color: "#A8A29E" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AREAS ── */}
      <section className="py-20" style={{ background: "#0F0702" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#C68642" }}>
                Locations
              </p>
              <h2 className="section-title">Browse by Area</h2>
              <p className="section-subtitle">Prime locations across Bangalore</p>
            </div>
            <Link href="/browse" className="btn-ghost hidden sm:flex">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {AREAS.map((area) => (
              <Link
                key={area.name}
                href={`/browse?area=${encodeURIComponent(area.name)}`}
                className="card card-hover p-5 flex flex-col items-center text-center group"
              >
                <span className="text-3xl mb-3">{area.emoji}</span>
                <h3 className="font-display font-semibold text-white group-hover:text-[#E0A15A] transition-colors text-base">
                  {area.name}
                </h3>
                <p className="text-xs mt-1" style={{ color: "#A8A29E" }}>
                  {area.count}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PGS ── */}
      {featuredPGs && featuredPGs.length > 0 && (
        <section className="py-20" style={{ background: "#1A0D05" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#C68642" }}>
                  Curated for You
                </p>
                <h2 className="section-title">Featured PGs</h2>
                <p className="section-subtitle">Our top-rated accommodations</p>
              </div>
              <Link href="/browse" className="btn-ghost hidden sm:flex">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredPGs.map((pg) => (
                <PGCard key={pg.id} pg={pg as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BUDGET PICKS ── */}
      {budgetPGs && budgetPGs.length > 0 && (
        <section className="py-20" style={{ background: "#0F0702" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#C68642" }}>
                  Value Stays
                </p>
                <h2 className="section-title">Budget Picks</h2>
                <p className="section-subtitle">Quality stays under ₹13,000/month</p>
              </div>
              <Link href="/browse?property_type=Budget" className="btn-ghost hidden sm:flex">
                See more <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {budgetPGs.map((pg) => (
                <PGCard key={pg.id} pg={pg as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURES ── */}
      <section className="py-20" style={{ background: "#1A0D05" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#C68642" }}>
              Why Gharpayy
            </p>
            <h2 className="section-title">Everything Included</h2>
            <p className="section-subtitle">Everything you need for a comfortable stay</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 text-center group">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all"
                  style={{
                    background: "rgba(198,134,66,0.1)",
                    border: "1px solid rgba(198,134,66,0.2)",
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: "#C68642" }} />
                </div>
                <h3 className="font-display font-semibold text-white mb-2 text-lg">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#A8A29E" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1A0D05,#2A1408)" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full"
            style={{ background: "linear-gradient(180deg,transparent,rgba(198,134,66,0.15),transparent)" }}
          />
          <div
            className="absolute -top-20 right-0 w-64 h-64 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle,rgba(198,134,66,0.1) 0%,transparent 70%)" }}
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "#C68642" }}>
            Start Today
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            Ready to find your<br />
            <span className="gold-text">home away from home?</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: "#A8A29E" }}>
            Browse 120+ verified PGs in Bangalore. Zero brokerage, instant booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse" className="btn-primary text-base px-8 py-4">
              <Search className="w-5 h-5" />
              Browse PGs
            </Link>
            <Link href="/post-requirement" className="btn-secondary text-base px-8 py-4">
              Post Requirement
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
