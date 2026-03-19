"use client";
import { useState } from "react";
import { User, Phone, Mail, MapPin, DollarSign, Calendar, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const AREAS = ["Koramangala", "Bellandur", "Whitefield", "Mahadevapura", "Marathahalli", "Electronic City", "HSR Layout", "Jayanagar", "MG Road", "BTM Layout", "Nagawara", "Any Area"];
const ROOM_TYPES = ["Single Sharing", "Double Sharing", "Triple Sharing", "Any"];
const GENDERS = ["Co-live", "Boys", "Girls"];

interface MatchedPG {
  id: string;
  gharpayy_name: string;
  area: string;
  price_double: number;
}

export default function LeadFormClient() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<MatchedPG[]>([]);
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    preferred_area: "Koramangala",
    budget_max: 15000,
    preferred_gender: "Co-live",
    preferred_room_type: "Double Sharing",
    move_in_date: "",
    notes: "",
  });

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.move_in_date) {
      toast.error("Please fill all required fields"); return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMatches(data.matches || []);
      setStep(2);
      toast.success("Requirement posted! We'll contact you shortly.");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Requirement submitted!</h2>
          <p className="text-gray-500">Our team will call you within 30 minutes with the best matches.</p>
        </div>

        {matches.length > 0 && (
          <div className="text-left">
            <h3 className="font-display font-semibold text-gray-900 mb-3">
              🎯 Instant Matches ({matches.length} found)
            </h3>
            <div className="space-y-3">
              {matches.map(pg => (
                <Link
                  key={pg.id}
                  href={`/pg/${pg.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-orange-50 hover:border-orange-200 border border-transparent transition-all group"
                >
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{pg.gharpayy_name}</div>
                    <div className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />{pg.area}
                    </div>
                  </div>
                  {pg.price_double && (
                    <div className="text-right">
                      <div className="font-display font-bold text-orange-500">₹{pg.price_double.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">per month</div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Link href="/browse" className="btn-primary flex-1 justify-center">Browse All PGs</Link>
          <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center">Submit Another</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal info */}
      <div>
        <h3 className="font-display font-semibold text-gray-900 mb-4">Your Details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text" required placeholder="Your name"
                value={form.name} onChange={e => set("name", e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div>
            <label className="label">Phone Number *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="tel" required placeholder="+91 98765 43210"
                value={form.phone} onChange={e => set("phone", e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="label">Email (optional)</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="email" placeholder="you@example.com"
              value={form.email} onChange={e => set("email", e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h3 className="font-display font-semibold text-gray-900 mb-4">PG Preferences</h3>
        <div className="space-y-4">
          {/* Area */}
          <div>
            <label className="label">Preferred Area *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select value={form.preferred_area} onChange={e => set("preferred_area", e.target.value)} className="input pl-10 appearance-none">
                {AREAS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>

          {/* Gender preference */}
          <div>
            <label className="label">PG Type</label>
            <div className="flex gap-2 flex-wrap">
              {GENDERS.map(g => (
                <button key={g} type="button"
                  onClick={() => set("preferred_gender", g)}
                  className={`filter-chip ${form.preferred_gender === g ? "filter-chip-active" : "filter-chip-inactive"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Room type */}
          <div>
            <label className="label">Room Type</label>
            <div className="flex gap-2 flex-wrap">
              {ROOM_TYPES.map(rt => (
                <button key={rt} type="button"
                  onClick={() => set("preferred_room_type", rt)}
                  className={`filter-chip ${form.preferred_room_type === rt ? "filter-chip-active" : "filter-chip-inactive"}`}
                >
                  {rt}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="label flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-500" />
              Max Monthly Budget: <span className="text-orange-500 font-bold">₹{form.budget_max.toLocaleString()}</span>
            </label>
            <input
              type="range" min={5000} max={50000} step={1000}
              value={form.budget_max} onChange={e => set("budget_max", parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>₹5,000</span><span>₹50,000</span>
            </div>
          </div>

          {/* Move-in date */}
          <div>
            <label className="label flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              Move-in Date *
            </label>
            <input
              type="date" required
              min={new Date().toISOString().split("T")[0]}
              value={form.move_in_date} onChange={e => set("move_in_date", e.target.value)}
              className="input"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="label">Additional Requirements</label>
            <textarea
              placeholder="Any specific requirements? (e.g., near specific company, veg food only, etc.)"
              value={form.notes} onChange={e => set("notes", e.target.value)}
              rows={3} className="input resize-none"
            />
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-4 justify-center text-base">
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" />Finding matches...</>
        ) : (
          <>🎯 Find My Perfect PG</>
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        By submitting, you agree to be contacted by our team within 30 minutes.
      </p>
    </form>
  );
}
