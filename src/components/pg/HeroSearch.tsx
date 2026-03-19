"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown } from "lucide-react";

const AREAS = ["All Areas", "Koramangala", "Bellandur", "Whitefield", "Mahadevapura", "Marathahalli", "Electronic City", "HSR Layout", "Jayanagar", "MG Road", "BTM Layout", "Nagawara"];
const GENDERS = ["Any Gender", "Boys", "Girls", "Co-live"];

export default function HeroSearch() {
  const [area, setArea] = useState("All Areas");
  const [gender, setGender] = useState("Any Gender");
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (area !== "All Areas") params.set("area", area);
    if (gender !== "Any Gender") params.set("gender", gender);
    if (query.trim()) params.set("search", query.trim());
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-2 flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto"
    >
      {/* Area select */}
      <div className="relative flex-1 min-w-0">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full pl-9 pr-8 py-3 rounded-xl bg-gray-50 border-0 text-gray-700 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
        >
          {AREAS.map((a) => <option key={a}>{a}</option>)}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Gender select */}
      <div className="relative min-w-[140px]">
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border-0 text-gray-700 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer pr-8"
        >
          {GENDERS.map((g) => <option key={g}>{g}</option>)}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Text search */}
      <div className="relative flex-[2] min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by PG name, landmark..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-3 rounded-xl bg-gray-50 border-0 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder-gray-400"
        />
      </div>

      {/* Search button */}
      <button type="submit" className="btn-primary whitespace-nowrap px-6 py-3 rounded-xl text-sm">
        <Search className="w-4 h-4" />
        Search
      </button>
    </form>
  );
}
