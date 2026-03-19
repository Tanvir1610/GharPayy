"use client";
import { useState, useMemo } from "react";
import { SlidersHorizontal, X, Search, Grid3X3, List, ChevronDown } from "lucide-react";
import PGCard from "./PGCard";
import type { PGProperty, PGFilters, Gender, PropertyType } from "@/types";

interface Props {
  initialPGs: PGProperty[];
  initialFilters?: Partial<PGFilters>;
}

const AREAS = ["","Koramangala","Bellandur","Whitefield","Mahadevapura","Marathahalli","Electronic City","HSR Layout","Jayanagar","MG Road","BTM Layout","Nagawara"];
const GENDERS: Array<Gender | ""> = ["","Boys","Girls","Co-live"];
const TYPES: Array<PropertyType | ""> = ["","Premium","Mid","Budget"];
const FOOD_TYPES = ["","Veg","Non-Veg","Both","Self-Cook"];
const BUDGET_RANGES = [
  { label: "Any",       min: 0,     max: 0 },
  { label: "Under ₹10k",min: 0,     max: 10000 },
  { label: "₹10k–₹15k", min: 10000, max: 15000 },
  { label: "₹15k–₹20k", min: 15000, max: 20000 },
  { label: "₹20k+",     min: 20000, max: 0 },
];

function getMinPrice(pg: PGProperty): number | null {
  const prices = [pg.price_triple,pg.price_double,pg.price_single].filter((p): p is number => p !== null && p > 0);
  return prices.length > 0 ? Math.min(...prices) : null;
}

export default function BrowseClient({ initialPGs, initialFilters = {} }: Props) {
  const [filters, setFilters] = useState<PGFilters>({
    area: initialFilters.area || "",
    gender: initialFilters.gender || "",
    property_type: initialFilters.property_type || "",
    budget_min: initialFilters.budget_min || 0,
    budget_max: initialFilters.budget_max || 0,
    search: initialFilters.search || "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid"|"list">("grid");
  const [sortBy, setSortBy] = useState("newest");

  const filtered = useMemo(() => {
    let result = [...initialPGs];
    if (filters.area) result = result.filter(p => p.area.toLowerCase().includes(filters.area!.toLowerCase()));
    if (filters.gender) result = result.filter(p => p.gender === filters.gender);
    if (filters.property_type) result = result.filter(p => p.property_type === filters.property_type);
    if (filters.budget_max && filters.budget_max > 0) result = result.filter(p => { const m = getMinPrice(p); return m !== null && m <= filters.budget_max!; });
    if (filters.budget_min && filters.budget_min > 0) result = result.filter(p => { const m = getMinPrice(p); return m !== null && m >= filters.budget_min!; });
    if (filters.search) { const q = filters.search.toLowerCase(); result = result.filter(p => p.gharpayy_name.toLowerCase().includes(q) || p.area.toLowerCase().includes(q) || p.locality.toLowerCase().includes(q) || p.nearby_landmarks?.toLowerCase().includes(q)); }
    if (sortBy === "price_asc") result.sort((a,b) => (getMinPrice(a) ?? 99999) - (getMinPrice(b) ?? 99999));
    else if (sortBy === "price_desc") result.sort((a,b) => (getMinPrice(b) ?? 0) - (getMinPrice(a) ?? 0));
    return result;
  }, [initialPGs, filters, sortBy]);

  const activeCount = [filters.area, filters.gender, filters.property_type, filters.budget_max && filters.budget_max > 0].filter(Boolean).length;
  const upd = (key: keyof PGFilters, val: any) => setFilters(f => ({ ...f, [key]: val }));
  const clear = () => setFilters({ area:"",gender:"",property_type:"",budget_min:0,budget_max:0,search:"" });

  const labelStyle = { color: "#D6D3D1" };
  const inputStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(198,134,66,0.2)", color: "#D6D3D1", borderRadius: "0.75rem" };

  const Sidebar = () => (
    <div className="space-y-6">
      {/* Area */}
      <div>
        <label className="label" style={labelStyle}>Area</label>
        <select value={filters.area||""} onChange={e => upd("area", e.target.value)}
          className="w-full px-4 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[rgba(198,134,66,0.3)]"
          style={inputStyle}>
          <option value="">All Areas</option>
          {AREAS.filter(Boolean).map(a => <option key={a}>{a}</option>)}
        </select>
      </div>

      {/* Gender */}
      <div>
        <label className="label" style={labelStyle}>For</label>
        <div className="flex flex-wrap gap-2">
          {GENDERS.map(g => (
            <button key={g} onClick={() => upd("gender", g)}
              className={`filter-chip ${filters.gender === g ? "filter-chip-active" : "filter-chip-inactive"}`}>
              {g || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <label className="label" style={labelStyle}>Property Type</label>
        <div className="flex flex-wrap gap-2">
          {TYPES.map(t => (
            <button key={t} onClick={() => upd("property_type", t)}
              className={`filter-chip ${filters.property_type === t ? "filter-chip-active" : "filter-chip-inactive"}`}>
              {t || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="label" style={labelStyle}>Monthly Budget</label>
        <div className="space-y-2">
          {BUDGET_RANGES.map(({ label, min, max }) => {
            const isActive = filters.budget_min === min && filters.budget_max === max;
            return (
              <button key={label} onClick={() => setFilters(f => ({ ...f, budget_min: min, budget_max: max }))}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all"
                style={{ border: `1px solid ${isActive ? "#C68642" : "rgba(198,134,66,0.15)"}`, background: isActive ? "rgba(198,134,66,0.12)" : "transparent", color: isActive ? "#E0A15A" : "#A8A29E" }}>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Food */}
      <div>
        <label className="label" style={labelStyle}>Food Type</label>
        <div className="flex flex-wrap gap-2">
          {FOOD_TYPES.map(f => (
            <button key={f} onClick={() => upd("food_type", f)}
              className={`filter-chip ${filters.food_type === f ? "filter-chip-active" : "filter-chip-inactive"}`}>
              {f || "All"}
            </button>
          ))}
        </div>
      </div>

      {activeCount > 0 && (
        <button onClick={clear} className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          style={{ border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
          <X className="w-4 h-4" />
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#C68642" }} />
          <input type="text" placeholder="Search PG name, area, landmark..."
            value={filters.search||""} onChange={e => upd("search", e.target.value)}
            className="w-full pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(198,134,66,0.3)] placeholder-[#57534E]"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(198,134,66,0.2)", color: "#D6D3D1", borderRadius: "0.75rem" }}
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all lg:hidden"
            style={{ background: activeCount > 0 ? "rgba(198,134,66,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${activeCount > 0 ? "#C68642" : "rgba(198,134,66,0.2)"}`, color: activeCount > 0 ? "#E0A15A" : "#A8A29E" }}>
            <SlidersHorizontal className="w-4 h-4" />
            Filters {activeCount > 0 && <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold" style={{ background: "linear-gradient(135deg,#C68642,#E0A15A)", color: "#0F0702" }}>{activeCount}</span>}
          </button>
          <div className="relative">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="pl-3 pr-8 py-2.5 rounded-xl text-sm font-medium appearance-none focus:outline-none cursor-pointer"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(198,134,66,0.2)", color: "#D6D3D1" }}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low–High</option>
              <option value="price_desc">Price: High–Low</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#C68642" }} />
          </div>
          <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(198,134,66,0.2)" }}>
            {(["grid","list"] as const).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)}
                className="p-2.5 transition-colors"
                style={{ background: viewMode === mode ? "rgba(198,134,66,0.15)" : "transparent", color: viewMode === mode ? "#E0A15A" : "#A8A29E" }}>
                {mode === "grid" ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["Boys","Girls","Co-live"] as Gender[]).map(g => (
          <button key={g} onClick={() => upd("gender", filters.gender === g ? "" : g)}
            className={`filter-chip ${filters.gender === g ? "filter-chip-active" : "filter-chip-inactive"}`}>
            {g}
          </button>
        ))}
        {(["Premium","Mid","Budget"] as PropertyType[]).map(t => (
          <button key={t} onClick={() => upd("property_type", filters.property_type === t ? "" : t)}
            className={`filter-chip ${filters.property_type === t ? "filter-chip-active" : "filter-chip-inactive"}`}>
            {t}
          </button>
        ))}
        <button onClick={() => setFilters(f => ({ ...f, budget_max: f.budget_max === 12000 ? 0 : 12000 }))}
          className={`filter-chip ${filters.budget_max === 12000 ? "filter-chip-active" : "filter-chip-inactive"}`}>
          Under ₹12k
        </button>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 rounded-2xl p-5" style={{ background: "linear-gradient(145deg,#1A0D05,#2A1408)", border: "1px solid rgba(198,134,66,0.15)" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-white text-lg">Filters</h3>
              {activeCount > 0 && (
                <button onClick={clear} className="text-xs font-medium transition-colors" style={{ color: "#C68642" }}>
                  Clear all
                </button>
              )}
            </div>
            <Sidebar />
          </div>
        </aside>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-80 overflow-y-auto p-5" style={{ background: "#1A0D05", borderLeft: "1px solid rgba(198,134,66,0.15)" }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-semibold text-white text-lg">Filters</h3>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl transition-colors" style={{ color: "#A8A29E" }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: "#D6D3D1" }}>
              <span className="text-white font-semibold">{filtered.length}</span> PGs found
              {filters.area && <span> in <span style={{ color: "#E0A15A" }}>{filters.area}</span></span>}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="font-display font-semibold text-white text-xl mb-2">No PGs found</h3>
              <p className="mb-6" style={{ color: "#D6D3D1" }}>Try adjusting your filters</p>
              <button onClick={clear} className="btn-primary">Clear filters</button>
            </div>
          ) : (
            <div className={viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              : "flex flex-col gap-4"}>
              {filtered.map(pg => <PGCard key={pg.id} pg={pg} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
