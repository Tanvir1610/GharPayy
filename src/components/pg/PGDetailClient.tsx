"use client";
import { useState } from "react";
import Link from "next/link";
import {
  MapPin, Heart, Share2, Star, Utensils, CheckCircle, Clock, Users, Building2, ChevronLeft,
  MessageCircle, Calendar, Zap, Home
} from "lucide-react";
import type { PGProperty } from "@/types";
import BookingModal from "@/components/booking/BookingModal";
import VisitModal from "@/components/booking/VisitModal";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: { full_name: string } | null;
}

interface Props {
  pg: PGProperty;
  isSaved: boolean;
  reviews: Review[];
  userId?: string;
}

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
  return gradients[area] || "from-gray-400 to-gray-600";
}

function RoomPriceCard({ label, price, isPopular }: { label: string; price: number | null; isPopular?: boolean }) {
  if (!price) return null;
  return (
    <div className={`relative p-4 rounded-2xl border-2 transition-all ${isPopular ? "border-orange-400 bg-orange-50" : "border-gray-100 bg-white hover:border-orange-200"}`}>
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-semibold px-3 py-0.5 rounded-full">
          Popular
        </span>
      )}
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="font-display font-bold text-xl text-gray-900">₹{price.toLocaleString()}</div>
      <div className="text-xs text-gray-400">per month</div>
    </div>
  );
}

export default function PGDetailClient({ pg, isSaved: initialSaved, reviews, userId }: Props) {
  const [saved, setSaved] = useState(initialSaved);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const supabase = createClient();
  const { user } = useUser();

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;

  const toggleSave = async () => {
    if (!user) { toast.error("Sign in to save PGs"); return; }
    if (saved) {
      await supabase.from("saved_pgs").delete().match({ user_id: user.id, pg_id: pg.id });
      setSaved(false); toast.success("Removed from saved");
    } else {
      await supabase.from("saved_pgs").insert({ user_id: user.id, pg_id: pg.id });
      setSaved(true); toast.success("Saved!");
    }
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: pg.gharpayy_name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 lg:pb-8">
      {/* Hero image area */}
      <div className={`relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br ${getAreaGradient(pg.area)} overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Building2 className="w-32 h-32 text-white" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Back button */}
        <Link href="/browse" className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={share} className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <Share2 className="w-4 h-4 text-white" />
          </button>
          <button onClick={toggleSave} className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <Heart className={`w-4 h-4 ${saved ? "fill-red-400 text-red-400" : "text-white"}`} />
          </button>
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`badge ${pg.gender === "Boys" ? "badge-navy" : pg.gender === "Girls" ? "badge-orange" : "badge-green"}`}>
              {pg.gender}
            </span>
            <span className={`badge ${pg.property_type === "Premium" ? "bg-yellow-100 text-yellow-700" : pg.property_type === "Mid" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
              {pg.property_type}
            </span>
            {pg.target_audience && <span className="badge badge-gray">{pg.target_audience}</span>}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">{pg.gharpayy_name}</h1>
          <div className="flex items-center gap-1.5 text-white/80 text-sm mt-1">
            <MapPin className="w-3.5 h-3.5" />
            {pg.locality && `${pg.locality}, `}{pg.area}, Bangalore
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Overview */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>{pg.area}</span>
                </div>
                {pg.walking_distance_mins && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span>{pg.walking_distance_mins} min to landmark</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4 text-orange-400" />
                  <span>{pg.target_audience}</span>
                </div>
                {avgRating && (
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{avgRating.toFixed(1)}</span>
                    <span className="text-gray-400">({reviews.length} reviews)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Nearby */}
            {pg.nearby_landmarks && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="font-display font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  Nearby Landmarks
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">{pg.nearby_landmarks}</p>
                {pg.google_maps_url && (
                  <a href={pg.google_maps_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-sm text-orange-500 hover:text-orange-600 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    Open in Google Maps
                  </a>
                )}
              </div>
            )}

            {/* Amenities */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-display font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  ...(pg.amenities || []),
                  ...(pg.common_area_features || []),
                  ...(pg.safety_features || []),
                ].filter((v, i, a) => a.indexOf(v) === i).map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Food */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-orange-500" />
                Food & Meals
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-orange-50 rounded-xl text-center">
                  <div className="font-display font-bold text-orange-500 text-xl">{pg.meals_per_day}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Meals/day</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl text-center">
                  <div className="font-display font-bold text-blue-500 text-sm">{pg.food_type}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Food type</div>
                </div>
                <div className="p-3 bg-green-50 rounded-xl text-center">
                  <div className="font-display font-bold text-green-600 text-sm">Included</div>
                  <div className="text-xs text-gray-500 mt-0.5">In rent</div>
                </div>
              </div>
              {pg.food_timings && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <span className="font-medium">Timings: </span>{pg.food_timings}
                </div>
              )}
            </div>

            {/* Rules & Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-display font-semibold text-gray-900 mb-4">House Rules & Policies</h2>
              <div className="space-y-3 text-sm text-gray-600">
                {pg.house_rules && (
                  <div className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /><span>{pg.house_rules}</span></div>
                )}
                <div className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /><span>Minimum stay: {pg.minimum_stay}</span></div>
                <div className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /><span>Security deposit: {pg.security_deposit}</span></div>
                <div className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /><span>Cleaning: {pg.cleaning_frequency}</span></div>
                {pg.utilities_included && (
                  <div className="flex gap-2"><Zap className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /><span>{pg.utilities_included}</span></div>
                )}
              </div>
            </div>

            {/* USP */}
            {pg.usp && (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5">
                <h2 className="font-display font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  Why Choose This PG?
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">{pg.usp}</p>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                Reviews {reviews.length > 0 && <span className="text-gray-400 font-normal text-sm">({reviews.length})</span>}
              </h2>
              {reviews.length === 0 ? (
                <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r.id} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm">
                            {r.user?.full_name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <span className="font-medium text-sm text-gray-900">{r.user?.full_name || "Resident"}</span>
                        </div>
                        <div className="flex">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column — Booking card */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* Pricing */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-display font-semibold text-gray-900 mb-4">Room Options</h3>
                <div className="space-y-3">
                  <RoomPriceCard label="Triple Sharing" price={pg.price_triple} />
                  <RoomPriceCard label="Double Sharing" price={pg.price_double} isPopular />
                  <RoomPriceCard label="Single / Private" price={pg.price_single} />
                </div>

                {pg.utilities_included?.includes("All Inclusive") && (
                  <div className="mt-4 p-3 bg-green-50 rounded-xl flex items-start gap-2 text-sm text-green-700">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    All utilities included — no hidden charges!
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <button
                onClick={() => setBookingOpen(true)}
                className="btn-primary w-full py-4 text-base justify-center"
              >
                <Home className="w-5 h-5" />
                Book Now
              </button>

              <button
                onClick={() => setVisitOpen(true)}
                className="btn-secondary w-full py-4 text-base justify-center"
              >
                <Calendar className="w-5 h-5" />
                Schedule a Visit
              </button>

              {/* Contact */}
              {(pg.manager_contact || pg.owner_contact) && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-display font-semibold text-gray-900 mb-3 text-sm">Contact</h3>
                  {pg.manager_contact && (
                    <a
                      href={`https://wa.me/91${pg.manager_contact.replace(/\D/g,"")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors text-green-700 text-sm font-medium"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp Manager
                    </a>
                  )}
                </div>
              )}

              {/* Group / actual name */}
              {pg.actual_name && (
                <div className="text-center text-xs text-gray-400">
                  Managed by {pg.actual_name}
                  {pg.group_name && ` · ${pg.group_name}`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-3 shadow-lg">
        <button onClick={() => setVisitOpen(true)} className="btn-secondary flex-1 justify-center py-3">
          Schedule Visit
        </button>
        <button onClick={() => setBookingOpen(true)} className="btn-primary flex-1 justify-center py-3">
          Book Now
        </button>
      </div>

      {bookingOpen && (
        <BookingModal pg={pg} userId={userId} onClose={() => setBookingOpen(false)} />
      )}
      {visitOpen && (
        <VisitModal pg={pg} userId={userId} onClose={() => setVisitOpen(false)} />
      )}
    </div>
  );
}
