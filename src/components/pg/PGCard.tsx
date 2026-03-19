"use client";
import { useState } from "react";
import Link from "next/link";
import { MapPin, Heart, Wifi, Utensils, Star, Building2 } from "lucide-react";
import type { PGProperty } from "@/types";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface Props {
  pg: PGProperty;
  saved?: boolean;
  onSaveToggle?: (id: string, saved: boolean) => void;
}

function getMinPrice(pg: PGProperty): number | null {
  const prices = [pg.price_triple, pg.price_double, pg.price_single].filter(
    (p): p is number => p !== null && p > 0
  );
  return prices.length > 0 ? Math.min(...prices) : null;
}

// Area-specific warm gradient overlays
function getAreaColor(area: string): string {
  const colors: Record<string, string> = {
    Koramangala:    "from-amber-900/90 to-stone-900/90",
    Bellandur:      "from-emerald-900/90 to-stone-900/90",
    Whitefield:     "from-violet-900/90 to-stone-900/90",
    Mahadevapura:   "from-blue-900/90 to-stone-900/90",
    Marathahalli:   "from-orange-900/90 to-stone-900/90",
    "Electronic City": "from-teal-900/90 to-stone-900/90",
    "HSR Layout":   "from-rose-900/90 to-stone-900/90",
    Jayanagar:      "from-sky-900/90 to-stone-900/90",
    "MG Road":      "from-red-900/90 to-stone-900/90",
    "BTM Layout":   "from-lime-900/90 to-stone-900/90",
    Nagawara:       "from-indigo-900/90 to-stone-900/90",
  };
  return colors[area] || "from-stone-900/90 to-stone-900/90";
}

const GENDER_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  Boys:     { bg: "rgba(59,130,246,0.15)",  color: "#93c5fd", border: "rgba(59,130,246,0.3)" },
  Girls:    { bg: "rgba(251,113,133,0.15)", color: "#fda4af", border: "rgba(251,113,133,0.3)" },
  "Co-live":{ bg: "rgba(16,185,129,0.15)",  color: "#6ee7b7", border: "rgba(16,185,129,0.3)" },
};

const TYPE_STYLES: Record<string, { bg: string; color: string }> = {
  Premium:  { bg: "rgba(198,134,66,0.2)", color: "#E0A15A" },
  Mid:      { bg: "rgba(99,102,241,0.15)", color: "#a5b4fc" },
  Budget:   { bg: "rgba(16,185,129,0.15)", color: "#6ee7b7" },
};

export default function PGCard({ pg, saved = false, onSaveToggle }: Props) {
  const [isSaved, setIsSaved] = useState(saved);
  const [loading, setLoading] = useState(false);
  const minPrice = getMinPrice(pg);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Sign in to save PGs"); setLoading(false); return; }
    if (isSaved) {
      await supabase.from("saved_pgs").delete().match({ user_id: user.id, pg_id: pg.id });
      setIsSaved(false); onSaveToggle?.(pg.id, false); toast.success("Removed from saved");
    } else {
      await supabase.from("saved_pgs").insert({ user_id: user.id, pg_id: pg.id });
      setIsSaved(true); onSaveToggle?.(pg.id, true); toast.success("Saved!");
    }
    setLoading(false);
  };

  const genderStyle  = GENDER_STYLES[pg.gender] || GENDER_STYLES["Co-live"];
  const typeStyle    = TYPE_STYLES[pg.property_type] || TYPE_STYLES["Mid"];

  return (
    <Link href={`/pg/${pg.id}`}
      className="block rounded-2xl overflow-hidden group transition-all duration-300"
      style={{ background: "linear-gradient(145deg,#1A0D05,#2A1408)", border: "1px solid rgba(198,134,66,0.12)" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(198,134,66,0.35)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(198,134,66,0.1)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(198,134,66,0.12)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Image area */}
      <div className={`relative h-44 bg-gradient-to-br ${getAreaColor(pg.area)} overflow-hidden`}
        style={{ background: "linear-gradient(135deg,#2A1408,#1A0D05)" }}>

        {/* Area label bg pattern */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
          <Building2 className="w-12 h-12 mb-2" style={{ color: "#C68642" }} />
        </div>

        {/* Gold shimmer line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent,rgba(198,134,66,0.4),transparent)" }} />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className="badge text-xs"
            style={{ background: genderStyle.bg, color: genderStyle.color, border: `1px solid ${genderStyle.border}` }}>
            {pg.gender}
          </span>
          <span className="badge text-xs"
            style={{ background: typeStyle.bg, color: typeStyle.color, border: "none" }}>
            {pg.property_type}
          </span>
        </div>

        {/* Save button */}
        <button onClick={toggleSave} disabled={loading}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ background: "rgba(15,7,2,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(198,134,66,0.2)" }}
        >
          <Heart className={`w-4 h-4 ${isSaved ? "fill-[#E0A15A] text-[#E0A15A]" : "text-[#A8A29E]"}`} />
        </button>

        {/* Price tag */}
        {minPrice && (
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-sm font-bold"
            style={{ background: "linear-gradient(135deg,#C68642,#E0A15A)", color: "#0F0702" }}>
            ₹{(minPrice / 1000).toFixed(0)}k/mo
          </div>
        )}

        {/* Area name */}
        <div className="absolute bottom-3 right-3 text-xs font-medium" style={{ color: "#A8A29E" }}>
          {pg.area}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-bold text-base mb-1 transition-colors text-white group-hover:text-[#E0A15A] line-clamp-1">
          {pg.gharpayy_name}
        </h3>

        <div className="flex items-center gap-1 text-sm mb-3" style={{ color: "#A8A29E" }}>
          <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "#C68642" }} />
          <span className="line-clamp-1">{pg.locality || pg.area}</span>
        </div>

        {/* Amenity chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {pg.meals_per_day > 0 && (
            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
              style={{ background: "rgba(198,134,66,0.1)", color: "#E0A15A" }}>
              <Utensils className="w-3 h-3" />
              {pg.meals_per_day} meals
            </span>
          )}
          {pg.amenities?.includes("Wifi") && (
            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
              style={{ background: "rgba(59,130,246,0.1)", color: "#93c5fd" }}>
              <Wifi className="w-3 h-3" />
              Wi-Fi
            </span>
          )}
          {(pg.amenities?.includes("Gym") || pg.common_area_features?.includes("Gym")) && (
            <span className="text-xs px-2 py-1 rounded-lg"
              style={{ background: "rgba(16,185,129,0.1)", color: "#6ee7b7" }}>
              🏋️ Gym
            </span>
          )}
          {pg.utilities_included?.includes("All Inclusive") && (
            <span className="text-xs px-2 py-1 rounded-lg font-medium"
              style={{ background: "rgba(198,134,66,0.1)", color: "#C68642", border: "1px solid rgba(198,134,66,0.2)" }}>
              All incl.
            </span>
          )}
        </div>

        {/* Room types */}
        <div className="flex flex-wrap gap-1 mb-3">
          {pg.room_types?.slice(0, 3).map((rt) => (
            <span key={rt} className="text-xs px-2 py-0.5 rounded-full"
              style={{ color: "#78716C", border: "1px solid rgba(198,134,66,0.1)" }}>
              {rt}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid rgba(198,134,66,0.1)" }}>
          <div>
            {minPrice ? (
              <div>
                <span className="text-xs" style={{ color: "#78716C" }}>Starts at</span>
                <div className="font-display font-bold text-base gold-text">
                  ₹{minPrice.toLocaleString()}/mo
                </div>
              </div>
            ) : (
              <span className="text-sm" style={{ color: "#78716C" }}>Price on request</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: "#78716C" }}>
            <Star className="w-3.5 h-3.5 fill-[#C68642] text-[#C68642]" />
            <span className="font-medium text-white">4.7</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
