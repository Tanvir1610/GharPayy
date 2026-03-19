"use client";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal, X, Search, Grid3X3, List, ChevronDown } from "lucide-react";
import PGCard from "./PGCard";
import type { PGProperty, PGFilters, Gender, PropertyType } from "@/types";

interface Props {
  initialPGs: PGProperty[];
  initialFilters?: Partial<PGFilters>;
}

const AREAS = ["", "Koramangala", "Bellandur", "Whitefield", "Mahadevapura", "Marathahalli", "Electronic City", "HSR Layout", "Jayanagar", "MG Road", "BTM Layout", "Nagawara"];
const GENDERS: Array<Gender | ""> = ["", "Boys", "Girls", "Co-live"];
const TYPES: Array<PropertyType | ""> = ["", "Premium", "Mid", "Budget"];
const ROOM_TYPES = ["Single Sharing", "Double Sharing", "Triple Sharing"];
const FOOD_TYPES = ["", "Veg", "Non-Veg", "Both", "Self-Cook"];
const BUDGET_RANGES = [
  { label: "Any", min: 0, max: 0 },
  { label: "Under ₹10k", min: 0, max: 10000 },
  { label: "₹10k–₹15k", min: 10000, max: 15000 },
  { label: "₹15k–₹20k", min: 15000, max: 20000 },
  { label: "₹20k+", min: 20000, max: 0 },
];

function getMinPrice(pg: PGProperty): number | null {
  const prices = [pg.price_triple, pg.price_double, pg.price_single].filter((p): p is number => p !== null && p > 0);
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");

  const filtered = useMemo(() => {
    let result = [...initialPGs];

    if (filters.area) result = result.filter(p => p.area.toLowerCase().includes(filters.area!.toLowerCase()));
    if (filters.gender) result = result.filter(p => p.gender === filters.gender);
    if (filters.property_type) result = result.filter(p => p.property_type === filters.property_type);
    if (filters.budget_max && filters.budget_max > 0) {
      result = result.filter(p => {
        const min = getMinPrice(p);
        return min !== null && min <= filters.budget_max!;
      });
    }
    if (filters.budget_min && filters.budget_min > 0) {
      result = result.filter(p => {
        const min = getMinPrice(p);
        return min !== null && min >= filters.budget_min!;
      });
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.gharpayy_name.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q) ||
        p.nearby_landmarks?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "price_asc") result.sort((a, b) => (getMinPrice(a) ?? 99999) - (getMinPrice(b) ?? 99999));
    else if (sortBy === "price_desc") result.sort((a, b) => (getMinPrice(b) ?? 0) - (getMinPrice(a) ?? 0));

    return result;
  }, [initialPGs, filters, sortBy]);

  const activeFilterCount = [
    filters.area, filters.gender, filters.property_type,
    filters.budget_max && filters.budget_max > 0,
  ].filter(Boolean).length;

  const updateFilter = (key: keyof PGFilters, value: any) =>
    setFilters(f => ({ ...f, [key]: value }));

  const clearFilters = () => setFilters({ area: "", gender: "", property_type: "", budget_min: 0, budget_max: 0, search: "" });

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Area */}
      <div>
        <label className="label">Area / Location</label>
        <select
          value={filters.area || ""}
          onChange={e => updateFilter("area", e.target.value)}
          className="input text-sm"
        >
          <option value="">All Areas</option>
          {AREAS.filter(Boolean).map(a => <option key={a}>{a}</option>)}
        </select>
      </div>

      {/* Gender */}
      <div>
        <label className="label">For</label>
        <div className="flex flex-wrap gap-2">
          {GENDERS.map(g => (
            <button
              key={g}
              onClick={() => updateFilter("gender", g)}
              className={`filter-chip ${filters.gender === g ? "filter-chip-active" : "filter-chip-inactive"}`}
            >
              {g || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="label">Property Type</label>
        <div className="flex flex-wrap gap-2">
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => updateFilter("property_type", t)}
              className={`filter-chip ${filters.property_type === t ? "filter-chip-active" : "filter-chip-inactive"}`}
            >
              {t || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="label">Monthly Budget</label>
        <div className="space-y-2">
          {BUDGET_RANGES.map(({ label, min, max }) => {
            const isActive = filters.budget_min === min && filters.budget_max === max;
            return (
              <button
                key={label}
                onClick={() => setFilters(f => ({ ...f, budget_min: min, budget_max: max }))}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                  isActive ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 hover:border-orange-200 text-gray-600"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Food */}
      <div>
        <label className="label">Food Type</label>
        <div className="flex flex-wrap gap-2">
          {FOOD_TYPES.map(f => (
            <button
              key={f}
              onClick={() => updateFilter("food_type", f)}
              className={`filter-chip ${filters.food_type === f ? "filter-chip-active" : "filter-chip-inactive"}`}
            >
              {f || "All"}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={clearFilters} className="w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
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
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search PG name, area, landmark..."
            value={filters.search || ""}
            onChange={e => updateFilter("search", e.target.value)}
            className="input pl-9 text-sm"
          />
        </div>

        {/* Controls */}
        <div className="flex gap-2 shrink-0">
          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors lg:hidden ${activeFilterCount > 0 ? "border-orange-400 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {activeFilterCount > 0 && <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">{activeFilterCount}</span>}
          </button>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* View mode */}
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 ${viewMode === "grid" ? "bg-orange-50 text-orange-500" : "text-gray-400 hover:text-gray-600"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 border-l border-gray-200 ${viewMode === "list" ? "bg-orange-50 text-orange-500" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["Boys", "Girls", "Co-live"] as Gender[]).map(g => (
          <button
            key={g}
            onClick={() => updateFilter("gender", filters.gender === g ? "" : g)}
            className={`filter-chip ${filters.gender === g ? "filter-chip-active" : "filter-chip-inactive"}`}
          >
            {g}
          </button>
        ))}
        {(["Premium", "Mid", "Budget"] as PropertyType[]).map(t => (
          <button
            key={t}
            onClick={() => updateFilter("property_type", filters.property_type === t ? "" : t)}
            className={`filter-chip ${filters.property_type === t ? "filter-chip-active" : "filter-chip-inactive"}`}
          >
            {t}
          </button>
        ))}
        <button
          onClick={() => setFilters(f => ({ ...f, budget_max: f.budget_max === 12000 ? 0 : 12000 }))}
          className={`filter-chip ${filters.budget_max === 12000 ? "filter-chip-active" : "filter-chip-inactive"}`}
        >
          Under ₹12k
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-gray-900">Filters</h3>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-orange-500 hover:text-orange-600 font-medium">Clear all</button>
              )}
            </div>
            <FilterSidebar />
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-semibold text-gray-900">Filters</h3>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-gray-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <FilterSidebar />
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 font-medium">
              <span className="text-gray-900 font-semibold">{filtered.length}</span> PGs found
              {filters.area && <span> in <span className="text-orange-500">{filters.area}</span></span>}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="font-display font-semibold text-gray-900 text-xl mb-2">No PGs found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters</p>
              <button onClick={clearFilters} className="btn-primary">Clear filters</button>
            </div>
          ) : (
            <div className={viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              : "flex flex-col gap-4"
            }>
              {filtered.map(pg => (
                <PGCard key={pg.id} pg={pg} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
