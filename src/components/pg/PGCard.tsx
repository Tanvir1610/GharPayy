// v3 - rich card with expandable details
"use client";
import { useState } from "react";
import Link from "next/link";
import {
  MapPin, Heart, Wifi, Utensils, Star, Shield, Zap, Users, Clock,
  Home, ChevronDown, ChevronUp, Phone, CheckCircle, Camera,
  Dumbbell, Coffee, Tv, Car, Wind, Droplets, Flame, Lock,
  BookOpen, ArrowRight, BedDouble, Sunset,
} from "lucide-react";
import type { PGProperty } from "@/types";
import { useUser } from "@clerk/nextjs";
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

const AREA_ACCENT: Record<string, { bg: string; dot: string; border: string }> = {
  Koramangala:       { bg: "rgba(234,88,12,0.08)",   dot: "#ea580c", border: "rgba(234,88,12,0.25)" },
  Bellandur:         { bg: "rgba(16,185,129,0.08)",  dot: "#10b981", border: "rgba(16,185,129,0.25)" },
  Whitefield:        { bg: "rgba(139,92,246,0.08)",  dot: "#8b5cf6", border: "rgba(139,92,246,0.25)" },
  Mahadevapura:      { bg: "rgba(59,130,246,0.08)",  dot: "#3b82f6", border: "rgba(59,130,246,0.25)" },
  Marathahalli:      { bg: "rgba(245,158,11,0.08)",  dot: "#f59e0b", border: "rgba(245,158,11,0.25)" },
  "Electronic City": { bg: "rgba(20,184,166,0.08)",  dot: "#14b8a6", border: "rgba(20,184,166,0.25)" },
  "HSR Layout":      { bg: "rgba(236,72,153,0.08)",  dot: "#ec4899", border: "rgba(236,72,153,0.25)" },
  Jayanagar:         { bg: "rgba(99,102,241,0.08)",  dot: "#6366f1", border: "rgba(99,102,241,0.25)" },
  "MG Road":         { bg: "rgba(239,68,68,0.08)",   dot: "#ef4444", border: "rgba(239,68,68,0.25)" },
  Nagawara:          { bg: "rgba(168,85,247,0.08)",  dot: "#a855f7", border: "rgba(168,85,247,0.25)" },
  "BTM Layout":      { bg: "rgba(6,182,212,0.08)",   dot: "#06b6d4", border: "rgba(6,182,212,0.25)" },
  "JP Nagar":        { bg: "rgba(132,204,22,0.08)",  dot: "#84cc16", border: "rgba(132,204,22,0.25)" },
  Indiranagar:       { bg: "rgba(251,146,60,0.08)",  dot: "#fb923c", border: "rgba(251,146,60,0.25)" },
  "Sg Palya":        { bg: "rgba(234,88,12,0.08)",   dot: "#ea580c", border: "rgba(234,88,12,0.25)" },
};

const GENDER_CHIP: Record<string, { bg: string; color: string }> = {
  Boys:      { bg: "rgba(59,130,246,0.15)",  color: "#93c5fd" },
  Girls:     { bg: "rgba(244,114,182,0.15)", color: "#f9a8d4" },
  "Co-live": { bg: "rgba(16,185,129,0.15)",  color: "#6ee7b7" },
};

const TYPE_CHIP: Record<string, { bg: string; color: string }> = {
  Premium: { bg: "rgba(198,134,66,0.2)",  color: "#E0A15A" },
  Mid:     { bg: "rgba(99,102,241,0.15)", color: "#a5b4fc" },
  Budget:  { bg: "rgba(16,185,129,0.15)", color: "#6ee7b7" },
};

function getAmenityIcon(amenity: string) {
  const a = amenity.toLowerCase();
  if (a.includes("wifi") || a.includes("wi-fi")) return <Wifi className="w-3 h-3" />;
  if (a.includes("gym")) return <Dumbbell className="w-3 h-3" />;
  if (a.includes("laundry")) return <Droplets className="w-3 h-3" />;
  if (a.includes("power") || a.includes("backup")) return <Zap className="w-3 h-3" />;
  if (a.includes("parking")) return <Car className="w-3 h-3" />;
  if (a.includes("ac") || a.includes("air")) return <Wind className="w-3 h-3" />;
  if (a.includes("tv") || a.includes("television")) return <Tv className="w-3 h-3" />;
  if (a.includes("lounge") || a.includes("pantry") || a.includes("study")) return <Coffee className="w-3 h-3" />;
  if (a.includes("rooftop") || a.includes("terrace")) return <Sunset className="w-3 h-3" />;
  if (a.includes("library")) return <BookOpen className="w-3 h-3" />;
  if (a.includes("fridge") || a.includes("microwave")) return <Flame className="w-3 h-3" />;
  return <CheckCircle className="w-3 h-3" />;
}

function getSafetyIcon(s: string) {
  const a = s.toLowerCase();
  if (a.includes("cctv")) return "📹";
  if (a.includes("guard") || a.includes("security")) return "👮";
  if (a.includes("biometric")) return "🔐";
  if (a.includes("fire")) return "🧯";
  return "🔒";
}

export default function PGCard({ pg, saved = false, onSaveToggle }: Props) {
  const [isSaved, setIsSaved] = useState(saved);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { user } = useUser();
  const accent = AREA_ACCENT[pg.area] || { bg: "rgba(198,134,66,0.06)", dot: "#C68642", border: "rgba(198,134,66,0.2)" };
  const genderChip = GENDER_CHIP[pg.gender] || { bg: "rgba(255,255,255,0.1)", color: "#D6D3D1" };
  const typeChip = TYPE_CHIP[pg.property_type] || { bg: "rgba(255,255,255,0.08)", color: "#A8A29E" };

  const priceRows = [
    { label: "Triple", price: pg.price_triple },
    { label: "Double", price: pg.price_double },
    { label: "Single", price: pg.price_single },
  ].filter((r): r is { label: string; price: number } => r.price !== null && r.price > 0);

  async function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) { toast.error("Sign in to save PGs"); return; }
    setSaving(true);
    const supabase = createClient();
    try {
      if (isSaved) {
        await supabase.from("saved_pgs").delete().eq("user_id", user.id).eq("pg_id", pg.id);
        setIsSaved(false);
        onSaveToggle?.(pg.id, false);
        toast.success("Removed from saved");
      } else {
        await supabase.from("saved_pgs").insert({ user_id: user.id, pg_id: pg.id });
        setIsSaved(true);
        onSaveToggle?.(pg.id, true);
        toast.success("Saved!");
      }
    } catch { toast.error("Something went wrong"); }
    finally { setSaving(false); }
  }

  const hasPhotos = pg.photos_urls && pg.photos_urls.length > 0;
  const firstPhotoId = hasPhotos ? pg.photos_urls[0].split("id=")[1]?.split("&")[0] : null;

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
      style={{
        background: "linear-gradient(160deg,#1C0E06 0%,#160A04 100%)",
        border: `1px solid ${expanded ? accent.border : "rgba(198,134,66,0.12)"}`,
        boxShadow: expanded ? "0 8px 32px rgba(0,0,0,0.4)" : "0 2px 12px rgba(0,0,0,0.3)",
      }}
    >
      {/* Photo */}
      {firstPhotoId && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={`https://drive.google.com/thumbnail?id=${firstPhotoId}&sz=w600`}
            alt={pg.gharpayy_name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(22,10,4,0.95) 100%)" }} />
          {pg.photos_urls.length > 1 && (
            <div className="absolute bottom-2 right-3 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(0,0,0,0.7)", color: "#A8A29E", border: "1px solid rgba(255,255,255,0.1)" }}>
              <Camera className="w-3 h-3" />{pg.photos_urls.length} photos
            </div>
          )}
          <button onClick={toggleSave} disabled={saving}
            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.65)", border: "1px solid rgba(198,134,66,0.3)" }}>
            <Heart className={`w-4 h-4 ${isSaved ? "fill-[#E0A15A] text-[#E0A15A]" : "text-white"}`} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="relative px-4 pt-3 pb-2" style={{ background: !firstPhotoId ? accent.bg : "transparent" }}>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: accent.dot }} />
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: accent.dot }}>{pg.area}</span>
          {pg.locality && <span className="text-xs truncate max-w-[120px]" style={{ color: "#78716C" }}>· {pg.locality}</span>}
        </div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display font-bold text-white text-base line-clamp-1">{pg.gharpayy_name}</h3>
            {pg.actual_name && pg.actual_name !== pg.gharpayy_name && (
              <p className="text-xs mt-0.5" style={{ color: "#57534E" }}>{pg.actual_name}</p>
            )}
          </div>
          {!firstPhotoId && (
            <button onClick={toggleSave} disabled={saving}
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(15,7,2,0.6)", border: "1px solid rgba(198,134,66,0.2)" }}>
              <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-[#E0A15A] text-[#E0A15A]" : "text-[#78716C]"}`} />
            </button>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 px-4 py-2" style={{ borderBottom: "1px solid rgba(198,134,66,0.08)" }}>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: genderChip.bg, color: genderChip.color }}>{pg.gender}</span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: typeChip.bg, color: typeChip.color }}>{pg.property_type}</span>
        {pg.food_type && (
          <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "#A8A29E" }}>
            {pg.food_type === "Veg" ? "🥦" : pg.food_type === "Non Veg" ? "🍗" : pg.food_type === "Both" ? "🍽️" : "🍳"} {pg.food_type}
          </span>
        )}
        {pg.meals_per_day > 0 && (
          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(198,134,66,0.1)", color: "#E0A15A" }}>
            <Utensils className="w-3 h-3" />{pg.meals_per_day} meals/day
          </span>
        )}
      </div>

      {/* Pricing */}
      {priceRows.length > 0 && (
        <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(198,134,66,0.08)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#57534E" }}>Monthly Rent</p>
          <div className="grid grid-cols-3 gap-2">
            {priceRows.map(({ label, price }) => (
              <div key={label} className="rounded-xl p-2.5 text-center" style={{ background: "rgba(198,134,66,0.06)", border: "1px solid rgba(198,134,66,0.12)" }}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <BedDouble className="w-3 h-3" style={{ color: "#78716C" }} />
                  <span className="text-xs" style={{ color: "#78716C" }}>{label}</span>
                </div>
                <span className="font-display font-bold text-sm block" style={{ color: "#E0A15A" }}>₹{price.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
          {pg.utilities_included?.includes("All Inclusive") && (
            <p className="text-xs mt-2 flex items-center gap-1" style={{ color: "#57534E" }}>
              <Zap className="w-3 h-3" style={{ color: "#C68642" }} />All-inclusive: electricity, water & Wi-Fi
            </p>
          )}
        </div>
      )}

      {/* Location */}
      <div className="px-4 py-2.5" style={{ borderBottom: "1px solid rgba(198,134,66,0.08)" }}>
        {pg.nearby_landmarks && (
          <div className="flex items-start gap-2 mb-1">
            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#C68642" }} />
            <p className="text-xs line-clamp-1" style={{ color: "#78716C" }}>{pg.nearby_landmarks}</p>
          </div>
        )}
        {pg.usp && <p className="text-xs italic" style={{ color: "#A8A29E" }}>✦ {pg.usp}</p>}
      </div>

      {/* Amenities */}
      {pg.amenities && pg.amenities.length > 0 && (
        <div className="px-4 py-2.5" style={{ borderBottom: "1px solid rgba(198,134,66,0.08)" }}>
          <div className="flex flex-wrap gap-1.5">
            {pg.amenities.slice(0, expanded ? 999 : 5).map((a) => (
              <span key={a} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                style={{ background: "rgba(255,255,255,0.04)", color: "#78716C", border: "1px solid rgba(255,255,255,0.06)" }}>
                {getAmenityIcon(a)} {a}
              </span>
            ))}
            {!expanded && pg.amenities.length > 5 && (
              <span className="text-xs px-2 py-1 rounded-lg" style={{ color: "#57534E", border: "1px solid rgba(198,134,66,0.08)" }}>
                +{pg.amenities.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── EXPANDED ── */}
      {expanded && (
        <>
          {pg.room_types && pg.room_types.length > 0 && (
            <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(198,134,66,0.08)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#57534E" }}>Room Types</p>
              <div className="flex flex-wrap gap-1.5">
                {pg.room_types.map(rt => (
                  <span key={rt} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium"
                    style={{ background: "rgba(198,134,66,0.08)", color: "#E0A15A", border: "1px solid rgba(198,134,66,0.18)" }}>
                    <Home className="w-3 h-3" />{rt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {pg.common_area_features && pg.common_area_features.length > 0 && (
            <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(198,134,66,0.08)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#57534E" }}>Common Areas</p>
              <div className="flex flex-wrap gap-1.5">
                {pg.common_area_features.map(f => (
                  <span key={f} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.04)", color: "#A8A29E", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {getAmenityIcon(f)} {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {pg.safety_features && pg.safety_features.length > 0 && (
            <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(198,134,66,0.08)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#57534E" }}>
                <Shield className="w-3 h-3 inline mr-1" style={{ color: "#C68642" }} />Safety
              </p>
              <div className="flex flex-wrap gap-1.5">
                {pg.safety_features.map(s => (
                  <span key={s} className="text-xs px-2 py-1 rounded-lg"
                    style={{ background: "rgba(16,185,129,0.06)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.15)" }}>
                    {getSafetyIcon(s)} {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {pg.food_timings && (
            <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(198,134,66,0.08)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#57534E" }}>
                <Utensils className="w-3 h-3 inline mr-1" style={{ color: "#C68642" }} />Food Timings
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#A8A29E" }}>{pg.food_timings}</p>
            </div>
          )}

          {pg.house_rules && (
            <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(198,134,66,0.08)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#57534E" }}>
                <Lock className="w-3 h-3 inline mr-1" style={{ color: "#C68642" }} />House Rules
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#A8A29E" }}>{pg.house_rules}</p>
            </div>
          )}

          <div className="px-4 py-3 grid grid-cols-2 gap-3" style={{ borderBottom: "1px solid rgba(198,134,66,0.08)" }}>
            {pg.security_deposit && (
              <div className="rounded-xl p-2.5" style={{ background: "rgba(198,134,66,0.06)", border: "1px solid rgba(198,134,66,0.12)" }}>
                <p className="text-xs mb-1" style={{ color: "#57534E" }}>Security Deposit</p>
                <p className="text-xs font-semibold" style={{ color: "#E0A15A" }}>{pg.security_deposit}</p>
              </div>
            )}
            {pg.minimum_stay && (
              <div className="rounded-xl p-2.5" style={{ background: "rgba(198,134,66,0.06)", border: "1px solid rgba(198,134,66,0.12)" }}>
                <p className="text-xs mb-1" style={{ color: "#57534E" }}>Minimum Stay</p>
                <p className="text-xs font-semibold" style={{ color: "#E0A15A" }}>{pg.minimum_stay}</p>
              </div>
            )}
          </div>

          {(pg.manager_contact || pg.owner_contact) && (
            <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(198,134,66,0.08)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#57534E" }}>Contact</p>
              <div className="space-y-1.5">
                {pg.manager_name && pg.manager_contact && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" style={{ color: "#C68642" }} />
                    <span className="text-xs" style={{ color: "#A8A29E" }}>{pg.manager_name}:</span>
                    <a href={"tel:" + pg.manager_contact} className="text-xs font-medium" style={{ color: "#E0A15A" }}>{pg.manager_contact}</a>
                  </div>
                )}
                {pg.owner_name && pg.owner_contact && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" style={{ color: "#C68642" }} />
                    <span className="text-xs" style={{ color: "#A8A29E" }}>{pg.owner_name}:</span>
                    <a href={"tel:" + pg.owner_contact} className="text-xs font-medium" style={{ color: "#E0A15A" }}>{pg.owner_contact}</a>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="px-4 py-3 flex gap-2">
            {pg.google_maps_url && (
              <a href={pg.google_maps_url} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold"
                style={{ background: "rgba(198,134,66,0.1)", color: "#E0A15A", border: "1px solid rgba(198,134,66,0.25)" }}>
                <MapPin className="w-3.5 h-3.5" />View on Maps
              </a>
            )}
            <Link href={"/pg/" + pg.id}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold"
              style={{ background: "linear-gradient(135deg,#C68642,#E0A15A)", color: "#0F0702" }}>
              Full Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-3">
          {pg.google_maps_url && !expanded && (
            <a href={pg.google_maps_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: "#A8A29E" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#E0A15A")}
              onMouseLeave={e => (e.currentTarget.style.color = "#A8A29E")}>
              <MapPin className="w-3 h-3" />Map
            </a>
          )}
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-[#C68642] text-[#C68642]" />
            <span className="text-xs font-semibold text-white">4.7</span>
          </div>
          {pg.target_audience && (
            <span className="flex items-center gap-1 text-xs" style={{ color: "#57534E" }}>
              <Users className="w-3 h-3" />{pg.target_audience}
            </span>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
          style={{
            background: expanded ? "rgba(198,134,66,0.15)" : "rgba(255,255,255,0.04)",
            color: expanded ? "#E0A15A" : "#78716C",
            border: "1px solid " + (expanded ? "rgba(198,134,66,0.3)" : "rgba(255,255,255,0.07)"),
          }}>
          {expanded ? <><ChevronUp className="w-3 h-3" />Less</> : <><ChevronDown className="w-3 h-3" />Details</>}
        </button>
      </div>
    </div>
  );
}
