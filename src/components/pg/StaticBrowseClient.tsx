"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, MapPin, Phone, Wifi, Shield, ChefHat, X, Grid3X3, List, ChevronDown, ExternalLink, Users, Star } from "lucide-react";
import type { PGListing } from "@/data/pgs";
import { driveThumb, getLowestPrice, AREAS } from "@/data/pgs";

interface Filters {
  area: string;
  gender: string;
  property_type: string;
  budget_min: number;
  budget_max: number;
  food_type: string;
  search: string;
}

export default function StaticBrowseClient({
  allPGs,
  initialFilters,
}: {
  allPGs: PGListing[];
  initialFilters: Filters;
}) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedPG, setExpandedPG] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let pgs = [...allPGs];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      pgs = pgs.filter(
        p =>
          p.gharpayy_name.toLowerCase().includes(q) ||
          p.area.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.nearby_landmarks.toLowerCase().includes(q)
      );
    }
    if (filters.area) pgs = pgs.filter(p => p.area === filters.area);
    if (filters.gender) pgs = pgs.filter(p => p.gender === filters.gender);
    if (filters.property_type) pgs = pgs.filter(p => p.property_type === filters.property_type);
    if (filters.food_type) pgs = pgs.filter(p => p.food_type === filters.food_type || p.food_type === "Both");
    if (filters.budget_max > 0) {
      pgs = pgs.filter(p => {
        const low = getLowestPrice(p);
        return low > 0 && low <= filters.budget_max;
      });
    }

    if (sortBy === "price_asc") pgs.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
    else if (sortBy === "price_desc") pgs.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
    else if (sortBy === "area") pgs.sort((a, b) => a.area.localeCompare(b.area));

    return pgs;
  }, [allPGs, filters, sortBy]);

  const clearFilters = () =>
    setFilters({ area: "", gender: "", property_type: "", budget_min: 0, budget_max: 0, food_type: "", search: "" });

  const activeFilterCount = [filters.area, filters.gender, filters.property_type, filters.food_type].filter(Boolean).length +
    (filters.budget_max > 0 ? 1 : 0);

  const genderBadge = (g: string) => {
    if (g === "Boys") return { bg: "rgba(59,130,246,0.15)", color: "#93c5fd", label: "Boys" };
    if (g === "Girls") return { bg: "rgba(244,114,182,0.15)", color: "#f9a8d4", label: "Girls" };
    return { bg: "rgba(168,85,247,0.15)", color: "#d8b4fe", label: "Co-live" };
  };

  const typeBadge = (t: string) => {
    if (t === "Premium") return { color: "#E0A15A" };
    if (t === "Budget") return { color: "#4ade80" };
    return { color: "#94a3b8" };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search + controls bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#78716C" }} />
          <input
            type="text"
            placeholder="Search PG name, area, landmark..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-stone-500 outline-none focus:ring-1"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(198,134,66,0.2)", focusRingColor: "#C68642" }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
          style={{ background: activeFilterCount > 0 ? "rgba(198,134,66,0.15)" : "rgba(255,255,255,0.05)", border: "1px solid rgba(198,134,66,0.3)", color: activeFilterCount > 0 ? "#E0A15A" : "#A8A29E" }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters {activeFilterCount > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs" style={{ background: "#C68642", color: "#0F0702" }}>{activeFilterCount}</span>}
        </button>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-4 py-3 rounded-xl text-sm outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(198,134,66,0.15)", color: "#A8A29E" }}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="area">By Area</option>
        </select>
        <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(198,134,66,0.15)" }}>
          <button onClick={() => setViewMode("grid")} className="px-3 py-2 transition-colors" style={{ background: viewMode === "grid" ? "rgba(198,134,66,0.2)" : "transparent", color: viewMode === "grid" ? "#E0A15A" : "#78716C" }}>
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode("list")} className="px-3 py-2 transition-colors" style={{ background: viewMode === "list" ? "rgba(198,134,66,0.2)" : "transparent", color: viewMode === "list" ? "#E0A15A" : "#78716C" }}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick filter chips */}
      <div className="flex gap-2 flex-wrap mb-6">
        {["Boys", "Girls", "Co-live"].map(g => (
          <button key={g} onClick={() => setFilters(f => ({ ...f, gender: f.gender === g ? "" : g }))}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{ background: filters.gender === g ? "rgba(198,134,66,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${filters.gender === g ? "#C68642" : "rgba(255,255,255,0.1)"}`, color: filters.gender === g ? "#E0A15A" : "#A8A29E" }}>
            {g}
          </button>
        ))}
        {["Premium", "Mid", "Budget"].map(t => (
          <button key={t} onClick={() => setFilters(f => ({ ...f, property_type: f.property_type === t ? "" : t }))}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{ background: filters.property_type === t ? "rgba(198,134,66,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${filters.property_type === t ? "#C68642" : "rgba(255,255,255,0.1)"}`, color: filters.property_type === t ? "#E0A15A" : "#A8A29E" }}>
            {t}
          </button>
        ))}
        <button onClick={() => setFilters(f => ({ ...f, budget_max: f.budget_max === 12000 ? 0 : 12000 }))}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{ background: filters.budget_max === 12000 ? "rgba(198,134,66,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${filters.budget_max === 12000 ? "#C68642" : "rgba(255,255,255,0.1)"}`, color: filters.budget_max === 12000 ? "#E0A15A" : "#A8A29E" }}>
          Under ₹12k
        </button>
      </div>

      {/* Expandable filter panel */}
      {showFilters && (
        <div className="mb-6 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(198,134,66,0.15)" }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "#78716C" }}>Area</label>
              <select value={filters.area} onChange={e => setFilters(f => ({ ...f, area: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(198,134,66,0.15)", color: "#A8A29E" }}>
                <option value="">All Areas</option>
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "#78716C" }}>Food</label>
              <select value={filters.food_type} onChange={e => setFilters(f => ({ ...f, food_type: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(198,134,66,0.15)", color: "#A8A29E" }}>
                <option value="">Any</option>
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "#78716C" }}>Max Budget (₹/mo)</label>
              <input type="number" placeholder="e.g. 15000" value={filters.budget_max || ""} onChange={e => setFilters(f => ({ ...f, budget_max: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none text-white"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(198,134,66,0.15)" }} />
            </div>
            <div className="flex items-end">
              <button onClick={clearFilters} className="w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                style={{ border: "1px solid rgba(198,134,66,0.3)", color: "#C68642" }}>
                <X className="w-3 h-3" /> Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm mb-6" style={{ color: "#78716C" }}>
        <span className="font-semibold" style={{ color: "#E0A15A" }}>{filtered.length}</span> PGs found
      </p>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🏠</div>
          <p className="text-lg font-medium text-white mb-2">No PGs found</p>
          <p className="text-sm mb-6" style={{ color: "#78716C" }}>Try adjusting your filters</p>
          <button onClick={clearFilters} className="px-6 py-2.5 rounded-full text-sm font-medium" style={{ background: "rgba(198,134,66,0.2)", border: "1px solid #C68642", color: "#E0A15A" }}>
            Clear filters
          </button>
        </div>
      )}

      {/* PG Cards Grid */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-4"}>
        {filtered.map(pg => {
          const badge = genderBadge(pg.gender);
          const typCol = typeBadge(pg.property_type);
          const lowestPrice = getLowestPrice(pg);
          const isExpanded = expandedPG === pg.id;
          const thumbs = pg.photo_ids.slice(0, 4).map(id => driveThumb(id));

          return (
            <div key={pg.id}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${viewMode === "list" ? "flex gap-0" : ""}`}
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(198,134,66,0.1)" }}>

              {/* Photo strip */}
              <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 shrink-0" : "h-44"}`}>
                {thumbs.length > 0 ? (
                  <div className={`grid h-full ${thumbs.length >= 2 ? "grid-cols-2" : "grid-cols-1"} gap-0.5`}>
                    {thumbs.slice(0, 4).map((url, i) => (
                      <img key={i} src={url} alt={pg.gharpayy_name}
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(198,134,66,0.05)" }}>
                    <span className="text-4xl opacity-30">🏠</span>
                  </div>
                )}
                {/* Badges overlay */}
                <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: badge.bg, color: badge.color }}>
                    {badge.label}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(0,0,0,0.5)", color: typCol.color }}>
                    {pg.property_type}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-white text-base leading-tight">{pg.gharpayy_name}</h3>
                  {lowestPrice > 0 && (
                    <div className="text-right ml-2 shrink-0">
                      <span className="text-xs" style={{ color: "#78716C" }}>from</span>
                      <div className="font-bold text-sm" style={{ color: "#E0A15A" }}>₹{(lowestPrice / 1000).toFixed(0)}k/mo</div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3 shrink-0" style={{ color: "#C68642" }} />
                  <span className="text-xs" style={{ color: "#78716C" }}>{pg.locality}, {pg.area}</span>
                </div>

                {/* Amenity chips */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {pg.amenities.slice(0, 4).map(a => (
                    <span key={a} className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "#78716C" }}>
                      {a}
                    </span>
                  ))}
                  {pg.amenities.length > 4 && (
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "#78716C" }}>
                      +{pg.amenities.length - 4}
                    </span>
                  )}
                </div>

                {/* Pricing row */}
                <div className="flex gap-2 mb-3 flex-wrap">
                  {pg.price_triple && <PriceTag label="Triple" price={pg.price_triple} />}
                  {pg.price_double && <PriceTag label="Double" price={pg.price_double} />}
                  {pg.price_single && <PriceTag label="Single" price={pg.price_single} />}
                </div>

                {/* USP */}
                <p className="text-xs mb-3 line-clamp-1" style={{ color: "#57534E" }}>{pg.usp}</p>

                {/* Action row */}
                <div className="flex items-center gap-2">
                  <button onClick={() => setExpandedPG(isExpanded ? null : pg.id)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: "rgba(198,134,66,0.15)", border: "1px solid rgba(198,134,66,0.3)", color: "#E0A15A" }}>
                    {isExpanded ? "Less Info" : "View Details"} <ChevronDown className={`inline w-3 h-3 ml-0.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  {pg.manager_contact && (
                    <a href={`tel:${pg.manager_contact}`}
                      className="p-2 rounded-xl"
                      style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }}>
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                  {pg.google_maps_url && (
                    <a href={pg.google_maps_url} target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-xl"
                      style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: "#93c5fd" }}>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(198,134,66,0.1)" }}>
                    <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                      <InfoRow icon={<ChefHat className="w-3 h-3" />} label="Food" value={`${pg.food_type} · ${pg.meals_per_day} meals/day`} />
                      <InfoRow icon={<Wifi className="w-3 h-3" />} label="Utilities" value={pg.utilities_included.length > 30 ? "All Inclusive" : pg.utilities_included} />
                      <InfoRow icon={<Shield className="w-3 h-3" />} label="Security" value={pg.security_deposit} />
                      <InfoRow icon={<Users className="w-3 h-3" />} label="Min Stay" value={pg.minimum_stay} />
                    </div>
                    <div className="mb-3">
                      <p className="text-xs font-medium mb-1" style={{ color: "#78716C" }}>Food Timings</p>
                      <p className="text-xs" style={{ color: "#A8A29E" }}>{pg.food_timings}</p>
                    </div>
                    {pg.common_areas.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium mb-1" style={{ color: "#78716C" }}>Common Areas</p>
                        <div className="flex gap-1 flex-wrap">
                          {pg.common_areas.map(a => (
                            <span key={a} className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(198,134,66,0.1)", color: "#C68642" }}>{a}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mb-3">
                      <p className="text-xs font-medium mb-1" style={{ color: "#78716C" }}>Safety</p>
                      <div className="flex gap-1 flex-wrap">
                        {pg.safety_features.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(34,197,94,0.08)", color: "#4ade80" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg" style={{ background: "rgba(198,134,66,0.06)", border: "1px solid rgba(198,134,66,0.1)" }}>
                      <p className="text-xs font-medium" style={{ color: "#E0A15A" }}>⭐ {pg.usp}</p>
                    </div>
                    {pg.nearby_landmarks && (
                      <p className="text-xs mt-2" style={{ color: "#57534E" }}>📍 {pg.nearby_landmarks}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PriceTag({ label, price }: { label: string; price: number }) {
  return (
    <div className="flex flex-col items-center px-2 py-1 rounded-lg" style={{ background: "rgba(198,134,66,0.06)", border: "1px solid rgba(198,134,66,0.12)" }}>
      <span className="text-xs" style={{ color: "#57534E" }}>{label}</span>
      <span className="text-xs font-bold" style={{ color: "#C68642" }}>₹{(price / 1000).toFixed(0)}k</span>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-0.5" style={{ color: "#78716C" }}>
        {icon}
        <span>{label}</span>
      </div>
      <p style={{ color: "#A8A29E" }}>{value}</p>
    </div>
  );
}
