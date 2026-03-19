"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown } from "lucide-react";

const AREAS = ["All Areas","Koramangala","Bellandur","Whitefield","Mahadevapura","Marathahalli","Electronic City","HSR Layout","Jayanagar","MG Road","BTM Layout","Nagawara"];
const GENDERS = ["Any Gender","Boys","Girls","Co-live"];

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

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(198,134,66,0.2)",
    color: "#D6D3D1",
    borderRadius: "0.75rem",
  };

  return (
    <form onSubmit={handleSearch}
      className="flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto p-2 rounded-2xl"
      style={{ background: "rgba(26,13,5,0.9)", border: "1px solid rgba(198,134,66,0.2)", backdropFilter: "blur(20px)" }}
    >
      {/* Area */}
      <div className="relative flex-1 min-w-0">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#C68642" }} />
        <select value={area} onChange={e => setArea(e.target.value)}
          className="w-full pl-9 pr-8 py-3 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[rgba(198,134,66,0.3)] cursor-pointer"
          style={inputStyle}
        >
          {AREAS.map(a => <option key={a}>{a}</option>)}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#C68642" }} />
      </div>

      {/* Gender */}
      <div className="relative min-w-[140px]">
        <select value={gender} onChange={e => setGender(e.target.value)}
          className="w-full px-4 py-3 text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[rgba(198,134,66,0.3)] cursor-pointer pr-8"
          style={inputStyle}
        >
          {GENDERS.map(g => <option key={g}>{g}</option>)}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#C68642" }} />
      </div>

      {/* Text search */}
      <div className="relative flex-[2] min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#C68642" }} />
        <input type="text" placeholder="PG name, landmark..."
          value={query} onChange={e => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(198,134,66,0.3)] placeholder-[#57534E]"
          style={inputStyle}
        />
      </div>

      {/* Button */}
      <button type="submit" className="btn-primary whitespace-nowrap px-6 py-3 rounded-xl text-sm">
        <Search className="w-4 h-4" />
        Search
      </button>
    </form>
  );
}
