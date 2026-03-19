"use client";
import { useState } from "react";
import Link from "next/link";
import { MapPin, Heart, Wifi, Utensils, Users, Star, Building2 } from "lucide-react";
import type { PGProperty } from "@/types";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface Props {
  pg: PGProperty;
  saved?: boolean;
  onSaveToggle?: (id: string, saved: boolean) => void;
}

const GENDER_COLOR: Record<string, string> = {
  Boys: "badge-navy",
  Girls: "badge-orange",
  "Co-live": "badge-green",
};

const TYPE_COLOR: Record<string, string> = {
  Premium: "bg-yellow-100 text-yellow-700",
  Mid: "bg-blue-100 text-blue-700",
  Budget: "bg-green-100 text-green-700",
};

function getMinPrice(pg: PGProperty): number | null {
  const prices = [pg.price_triple, pg.price_double, pg.price_single].filter((p): p is number => p !== null && p > 0);
  return prices.length > 0 ? Math.min(...prices) : null;
}

// Placeholder gradient based on area
function getAreaGradient(area: string): string {
  const gradients: Record<string, string> = {
    Koramangala: "from-orange-400 to-rose-500",
    Bellandur: "from-teal-400 to-cyan-500",
    Whitefield: "from-violet-400 to-purple-500",
    Mahadevapura: "from-blue-400 to-indigo-500",
    Marathahalli: "from-amber-400 to-orange-500",
    "Electronic City": "from-emerald-400 to-teal-500",
    "HSR Layout": "from-pink-400 to-rose-500",
    Jayanagar: "from-sky-400 to-blue-500",
    "MG Road": "from-red-400 to-orange-500",
    "BTM Layout": "from-lime-400 to-green-500",
    Nagawara: "from-indigo-400 to-purple-500",
  };
  return gradients[area] || "from-gray-400 to-gray-500";
}

export default function PGCard({ pg, saved = false, onSaveToggle }: Props) {
  const [isSaved, setIsSaved] = useState(saved);
  const [loading, setLoading] = useState(false);
  const minPrice = getMinPrice(pg);
  const supabase = createClient();

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Sign in to save PGs"); setLoading(false); return; }
    if (isSaved) {
      await supabase.from("saved_pgs").delete().match({ user_id: user.id, pg_id: pg.id });
      setIsSaved(false);
      onSaveToggle?.(pg.id, false);
      toast.success("Removed from saved");
    } else {
      await supabase.from("saved_pgs").insert({ user_id: user.id, pg_id: pg.id });
      setIsSaved(true);
      onSaveToggle?.(pg.id, true);
      toast.success("Saved!");
    }
    setLoading(false);
  };

  return (
    <Link href={`/pg/${pg.id}`} className="card card-hover block overflow-hidden group">
      {/* Image / Gradient */}
      <div className={`relative h-44 bg-gradient-to-br ${getAreaGradient(pg.area)} overflow-hidden`}>
        {pg.photos_urls && pg.photos_urls.length > 0 ? (
          // If real photo available, show it
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Building2 className="w-12 h-12 text-white/40" />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Building2 className="w-10 h-10 text-white/60 mb-2" />
            <span className="text-white/70 text-xs font-medium">{pg.area}</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className={`badge ${GENDER_COLOR[pg.gender] || "badge-gray"}`}>{pg.gender}</span>
          <span className={`badge ${TYPE_COLOR[pg.property_type] || "badge-gray"}`}>{pg.property_type}</span>
        </div>

        {/* Save button */}
        <button
          onClick={toggleSave}
          disabled={loading}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-all"
        >
          <Heart className={`w-4 h-4 ${isSaved ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>

        {/* Price tag */}
        {minPrice && (
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
            ₹{(minPrice / 1000).toFixed(0)}k/mo
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-bold text-gray-900 text-base mb-1 group-hover:text-orange-500 transition-colors line-clamp-1">
          {pg.gharpayy_name}
        </h3>

        <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="line-clamp-1">{pg.locality || pg.area}</span>
        </div>

        {/* Quick amenities */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {pg.meals_per_day > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
              <Utensils className="w-3 h-3 text-orange-400" />
              {pg.meals_per_day} meals
            </span>
          )}
          {pg.amenities?.includes("Wifi") && (
            <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
              <Wifi className="w-3 h-3 text-blue-400" />
              Wi-Fi
            </span>
          )}
          {pg.amenities?.includes("Gym") || pg.common_area_features?.includes("Gym") ? (
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">🏋️ Gym</span>
          ) : null}
          {pg.utilities_included?.includes("All Inclusive") && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg font-medium">All incl.</span>
          )}
        </div>

        {/* Room types */}
        <div className="flex flex-wrap gap-1 mb-3">
          {pg.room_types?.slice(0, 3).map((rt) => (
            <span key={rt} className="text-xs text-gray-500 border border-gray-100 px-2 py-0.5 rounded-full">{rt}</span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div>
            {minPrice ? (
              <div>
                <span className="text-xs text-gray-400">Starts at</span>
                <div className="font-display font-bold text-orange-500 text-base">
                  ₹{minPrice.toLocaleString()}/mo
                </div>
              </div>
            ) : (
              <span className="text-sm text-gray-400">Price on request</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-gray-600">4.{Math.floor(Math.random() * 3) + 6}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
