import Link from "next/link";
import { Wifi, Utensils, Shield, ChevronRight, Search, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PGCard from "@/components/pg/PGCard";
import HeroSearch from "@/components/pg/HeroSearch";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const AREAS = [
  { name: "Koramangala", count: "15+ PGs", icon: "🏙️" },
  { name: "Bellandur",   count: "8+ PGs",  icon: "🌿" },
  { name: "Whitefield",  count: "10+ PGs", icon: "🚇" },
  { name: "Mahadevapura",count: "7+ PGs",  icon: "💼" },
  { name: "Marathahalli",count: "6+ PGs",  icon: "🏢" },
  { name: "Electronic City", count: "5+ PGs", icon: "⚡" },
  { name: "HSR Layout",  count: "4+ PGs",  icon: "🌟" },
  { name: "Jayanagar",   count: "3+ PGs",  icon: "🏡" },
];

const FEATURES = [
  { icon: Wifi,     title: "All-Inclusive Rent",   desc: "Wi-Fi, electricity & water included in one flat fee." },
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
  const supabase = await createClient();
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
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero-gradient relative overflow-hidden pt-24 pb-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6 animate-fade-up-1">
              <span className="w-2 h-2 rounded-full bg-green-400 ping-slow inline-block" />
              Rooms available now in Bangalore
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-up-2">
              Find Your Perfect
              <span className="block text-orange-400 mt-1">PG in Bangalore</span>
            </h1>

            <p className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fade-up-3">
              120+ verified paying guest accommodations across prime Bangalore locations. Fully furnished, meals included, zero brokerage.
            </p>

            {/* Search bar */}
            <div className="animate-fade-up-4">
              <HeroSearch />
            </div>

            {/* Quick filters */}
            <div className="flex flex-wrap justify-center gap-2 mt-6 animate-fade-up-4">
              {["Boys", "Girls", "Co-live", "Budget", "Premium"].map((tag) => (
                <Link
                  key={tag}
                  href={`/browse?${tag === "Boys" || tag === "Girls" || tag === "Co-live" ? "gender" : "property_type"}=${tag}`}
                  className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white text-sm font-medium transition-all"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-orange-500 mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AREAS ── */}
      <section className="py-16 bg-[#f8f7ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
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
                <span className="text-3xl mb-3">{area.icon}</span>
                <h3 className="font-display font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">{area.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{area.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PGS ── */}
      {featuredPGs && featuredPGs.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="section-title">Featured PGs</h2>
                <p className="section-subtitle">Our top-rated accommodations</p>
              </div>
              <Link href="/browse" className="btn-ghost hidden sm:flex">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPGs.map((pg) => (
                <PGCard key={pg.id} pg={pg as any} />
              ))}
            </div>
            <div className="text-center mt-8 sm:hidden">
              <Link href="/browse" className="btn-secondary">View all PGs</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── BUDGET PICKS ── */}
      {budgetPGs && budgetPGs.length > 0 && (
        <section className="py-16 bg-[#f8f7ff]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="section-title">Budget Picks</h2>
                <p className="section-subtitle">Quality stays under ₹13,000/month</p>
              </div>
              <Link href="/browse?property_type=Budget" className="btn-ghost hidden sm:flex">
                See more <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {budgetPGs.map((pg) => (
                <PGCard key={pg.id} pg={pg as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURES ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose Gharpayy?</h2>
            <p className="section-subtitle">Everything you need for a comfortable stay</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 text-center group hover:border-orange-200">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-display font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to find your home away from home?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Browse 120+ verified PGs in Bangalore. Zero brokerage, instant booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse" className="btn-primary text-base px-8 py-4">
              <Search className="w-5 h-5" />
              Browse PGs
            </Link>
            <Link href="/browse?type=leads" className="btn-secondary text-base px-8 py-4">
              Post Requirement
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
