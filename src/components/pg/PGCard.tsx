"use client";
import { useState } from "react";
import Link from "next/link";
import { MapPin, Heart, Wifi, Utensils, Star, Shield, Zap, Users, Clock, Home } from "lucide-react";
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

const AREA_ACCENT: Record<string, { bg: string; dot: string }> = {
  Koramangala:     { bg: "rgba(234,88,12,0.1)",   dot: "#ea580c" },
  Bellandur:       { bg: "rgba(16,185,129,0.1)",  dot: "#10b981" },
  Whitefield:      { bg: "rgba(139,92,246,0.1)",  dot: "#8b5cf6" },
  Mahadevapura:    { bg: "rgba(59,130,246,0.1)",  dot: "#3b82f6" },
  Marathahalli:    { bg: "rgba(245,158,11,0.1)",  dot: "#f59e0b" },
  "Electronic City":{ bg: "rgba(20,184,166,0.1)", dot: "#14b8a6" },
  "HSR Layout":    { bg: "rgba(236,72,153,0.1)",  dot: "#ec4899" },
  Jayanagar:       { bg: "rgba(99,102,241,0.1)",  dot: "#6366f1" },
  "MG Road":       { bg: "rgba(239,68,68,0.1)",   dot: "#ef4444" },
  Nagawara:        { bg: "rgba(168,85,247,0.1)",  dot: "#a855f7" },
  "BTM Layout":    { bg: "rgba(6,182,212,0.1)",   dot: "#06b6d4" },
  "JP Nagar":      { bg: "rgba(132,204,22,0.1)",  dot: "#84cc16" },
};

const GENDER_CHIP: Record<string, { bg: string; color: string }> = {
  Boys:      { bg: "rgba(59,130,246,0.15)",  color: "#93c5fd" },
  Girls:     { bg: "rgba(244,114,182,0.15)", color: "#f9a8d4" },
  "Co-live": { bg: "rgba(16,185,129,0.15)",  color: "#6ee7b7" },
};

const TYPE_CHIP: Record<string, { bg: string; color: string }> = {
  Premium: { bg: "rgba(198,134,66,0.2)", color: "#E0A15A" },
  Mid:     { bg: "rgba(99,102,241,0.15)", color: "#a5b4fc" },
  Budget:  { bg: "rgba(16,185,129,0.15)", color: "#6ee7b7" },
};

const FOOD_ICON: Record<string, string> = {
  Veg: "🥦", "Non Veg": "🍗", Both: "🍽️", "Self-Cook": "🍳",
};

export default function PGCard({ pg, saved = false, onSaveToggle }: Props) {
  const [isSaved, setIsSaved] = useState(saved);
  const [saving, setSaving] = useState(false);
  const minPrice = getMinPrice(pg);
  const accent = AREA_ACCENT[pg.area] || { bg: "rgba(198,134,66,0.08)", dot: "#C68642" };
  const genderChip = GENDER_CHIP[pg.gender] || GENDER_CHIP["Co-live"];
  const typeChip = TYPE_CHIP[pg.property_type] || TYPE_CHIP["Mid"];

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Sign in to save PGs"); setSaving(false); return; }
    if (isSaved) {
      await supabase.from("saved_pgs").delete().match({ user_id: user.id, pg_id: pg.id });
      setIsSaved(false); onSaveToggle?.(pg.id, false); toast.success("Removed");
    } else {
      await supabase.from("saved_pgs").insert({ user_id: user.id, pg_id: pg.id });
      setIsSaved(true); onSaveToggle?.(pg.id, true); toast.success("Saved!");
    }
    setSaving(false);
  };

  // Build room-type pricing rows from data
  const priceRows: { label: string; price: number }[] = [];
  if (pg.price_triple && pg.price_triple > 0) priceRows.push({ label: "Triple", price: pg.price_triple });
  if (pg.price_double && pg.price_double > 0) priceRows.push({ label: "Double", price: pg.price_double });
  if (pg.price_single && pg.price_single > 0) priceRows.push({ label: "Single", price: pg.price_single });

  // Pick top 3 amenity icons
  const amenityIcons: { icon: React.ReactNode; label: string }[] = [];
  if (pg.amenities?.includes("Wifi") || pg.common_area_features?.includes("Wifi"))
    amenityIcons.push({ icon: <Wifi className="w-3 h-3" />, label: "Wi-Fi" });
  if (pg.amenities?.includes("Power Backup") || pg.utilities_included?.includes("All Inclusive"))
    amenityIcons.push({ icon: <Zap className="w-3 h-3" />, label: "All incl." });
  if (pg.safety_features?.includes("CCTV") || pg.safety_features?.includes("Security Guard"))
    amenityIcons.push({ icon: <Shield className="w-3 h-3" />, label: "Secured" });
  if (pg.common_area_features?.includes("Gym"))
    amenityIcons.push({ icon: <Users className="w-3 h-3" />, label: "Gym" });

  return (
    <Link href={`/pg/${pg.id}`}
      className="block rounded-2xl overflow-hidden group transition-all duration-300"
      style={{ background: "linear-gradient(160deg,#1E1006 0%,#2A1408 100%)", border: "1px solid rgba(198,134,66,0.12)" }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(198,134,66,0.38)";
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 20px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(198,134,66,0.08)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(198,134,66,0.12)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >

      {/* ── HEADER BAND ── area color + name + save */}
      <div className="relative px-4 pt-4 pb-3" style={{ background: accent.bg }}>
        {/* Area pill */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: accent.dot }} />
          <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: accent.dot }}>
            {pg.area}
          </span>
          {pg.locality && (
            <span className="text-xs truncate max-w-[120px]" style={{ color: "#A8A29E" }}>
              · {pg.locality}
            </span>
          )}
        </div>

        {/* PG Name */}
        <h3 className="font-display font-bold text-white leading-tight pr-8 text-base group-hover:text-[#E0A15A] transition-colors line-clamp-1">
          {pg.gharpayy_name}
        </h3>

        {/* Actual name if different */}
        {pg.actual_name && pg.actual_name !== pg.gharpayy_name && (
          <p className="text-xs mt-0.5 truncate" style={{ color: "#78716C" }}>
            {pg.actual_name}
          </p>
        )}

        {/* Save button */}
        <button onClick={toggleSave} disabled={saving}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-all"
          style={{ background: "rgba(15,7,2,0.6)", border: "1px solid rgba(198,134,66,0.2)" }}>
          <Heart className={`w-3.5 h-3.5 transition-all ${isSaved ? "fill-[#E0A15A] text-[#E0A15A]" : "text-[#78716C]"}`} />
        </button>
      </div>

      {/* ── BADGES ROW ── */}
      <div className="flex flex-wrap gap-1.5 px-4 py-2.5" style={{ borderBottom: "1px solid rgba(198,134,66,0.08)" }}>
        <span className="badge text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: genderChip.bg, color: genderChip.color, border: "none" }}>
          {pg.gender}
        </span>
        <span className="badge text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: typeChip.bg, color: typeChip.color, border: "none" }}>
          {pg.property_type}
        </span>
        {pg.food_type && FOOD_ICON[pg.food_type] && (
          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: "rgba(255,255,255,0.05)", color: "#A8A29E" }}>
            {FOOD_ICON[pg.food_type]} {pg.food_type}
          </span>
        )}
        {pg.meals_per_day > 0 && (
          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
            style={{ background: "rgba(198,134,66,0.1)", color: "#E0A15A" }}>
            <Utensils className="w-3 h-3" />
            {pg.meals_per_day} meals/day
          </span>
        )}
      </div>

      {/* ── PRICING TABLE ── the most important info from the PDFs */}
      {priceRows.length > 0 && (
        <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(198,134,66,0.08)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#78716C" }}>
            Monthly Rent
          </p>
          <div className="space-y-1.5">
            {priceRows.map(({ label, price }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(198,134,66,0.5)" }} />
                  <span className="text-xs" style={{ color: "#A8A29E" }}>{label} Sharing</span>
                </div>
                <span className="font-display font-bold text-sm" style={{ color: "#E0A15A" }}>
                  ₹{price.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
          {pg.utilities_included?.includes("All Inclusive") && (
            <p className="text-xs mt-2 flex items-center gap-1" style={{ color: "#78716C" }}>
              <Zap className="w-3 h-3" style={{ color: "#C68642" }} />
              Incl. electricity, water & Wi-Fi
            </p>
          )}
        </div>
      )}

      {/* ── NEARBY LANDMARKS ── from PDF data */}
      {pg.nearby_landmarks && (
        <div className="px-4 py-2.5 flex items-start gap-2" style={{ borderBottom: "1px solid rgba(198,134,66,0.08)" }}>
          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#C68642" }} />
          <p className="text-xs line-clamp-1" style={{ color: "#78716C" }}>
            {pg.nearby_landmarks}
          </p>
        </div>
      )}

      {/* ── USP / HIGHLIGHTS ── */}
      {pg.usp && (
        <div className="px-4 py-2.5" style={{ borderBottom: "1px solid rgba(198,134,66,0.08)" }}>
          <p className="text-xs italic line-clamp-2 leading-relaxed" style={{ color: "#A8A29E" }}>
            ✦ {pg.usp}
          </p>
        </div>
      )}

      {/* ── BOTTOM ROW: amenity chips + rating + maps link ── */}
      <div className="px-4 py-3 flex items-center justify-between gap-2">
        {/* Amenity mini chips */}
        <div className="flex flex-wrap gap-1">
          {amenityIcons.slice(0, 3).map(({ icon, label }) => (
            <span key={label}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
              style={{ background: "rgba(255,255,255,0.04)", color: "#78716C", border: "1px solid rgba(255,255,255,0.06)" }}>
              {icon} {label}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Maps link */}
          {pg.google_maps_url && (
            <a href={pg.google_maps_url} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 text-xs font-medium transition-colors"
              style={{ color: "#A8A29E" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#E0A15A")}
              onMouseLeave={e => (e.currentTarget.style.color = "#A8A29E")}>
              <MapPin className="w-3 h-3" />
              Map
            </a>
          )}
          {/* Min stay */}
          {pg.minimum_stay && (
            <span className="flex items-center gap-1 text-xs" style={{ color: "#57534E" }}>
              <Clock className="w-3 h-3" />
              {pg.minimum_stay}
            </span>
          )}
          {/* Star */}
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-[#C68642] text-[#C68642]" />
            <span className="text-xs font-semibold text-white">4.7</span>
          </div>
        </div>
      </div>

      {/* ── ROOM TYPES FOOTER ── from actual data */}
      {pg.room_types && pg.room_types.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1">
          {pg.room_types.map(rt => (
            <span key={rt} className="text-xs px-2 py-0.5 rounded-full"
              style={{ color: "#57534E", border: "1px solid rgba(198,134,66,0.1)" }}>
              <Home className="w-2.5 h-2.5 inline mr-0.5" style={{ verticalAlign: "text-top" }} />
              {rt}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
