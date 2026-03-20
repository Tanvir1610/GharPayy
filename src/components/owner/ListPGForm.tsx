"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, MapPin, Phone, DollarSign, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

interface Props { ownerId: string }

const AREAS = ["Koramangala","Bellandur","Whitefield","Mahadevapura","Marathahalli","HSR Layout","BTM Layout","Nagawara","JP Nagar","MG Road","Indiranagar","Electronic City","Jayanagar"];
const AMENITIES = ["WiFi","Gym","Laundry","Power Backup","Elevator","Water Purifier","Fridge","Microwave","Housekeeping","Parking","Lounge","Pantry","Study Area","Rooftop","TV"];
const SAFETY = ["CCTV","Security Guard","Biometric Access","Fire Extinguisher","Main Gate Lock"];
const COMMON = ["Lounge","Gym","Pantry","Study Area","Rooftop","Game Room","Library"];

const STEPS = ["Basic Info", "Pricing", "Amenities", "Contact & Submit"];

const input = "w-full px-4 py-3 rounded-xl text-sm text-white placeholder-[#57534E] outline-none transition-all";
const inputStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(198,134,66,0.15)" };
const card = { background: "rgba(26,13,5,0.8)", border: "1px solid rgba(198,134,66,0.15)" };

export default function ListPGForm({ ownerId }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    gharpayy_name: "", area: "", locality: "", nearby_landmarks: "",
    gender: "Co-live", property_type: "Mid", target_audience: "Both",
    room_types: [] as string[],
    price_triple: "", price_double: "", price_single: "",
    food_type: "Both", meals_per_day: "3", food_timings: "",
    utilities_included: "All Inclusive (Electricity + Water + Wi-Fi + Maintenance)",
    amenities: [] as string[], common_area_features: [] as string[],
    safety_features: [] as string[], walking_distance_mins: "",
    accessibility: "Bus", noise_level: "Medium", surrounding_vibe: "",
    usp: "", house_rules: "No Curfew", cleaning_frequency: "Every Alternate Day",
    security_deposit: "One Month Rent", minimum_stay: "3 Months",
    manager_name: "", manager_contact: "", owner_name: "", owner_contact: "",
    google_maps_url: "",
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  function toggleArr(key: "room_types" | "amenities" | "common_area_features" | "safety_features", val: string) {
    setForm(f => {
      const arr = f[key] as string[];
      return { ...f, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const body = {
        ...form,
        price_triple: form.price_triple ? parseInt(form.price_triple) * 1000 : null,
        price_double: form.price_double ? parseInt(form.price_double) * 1000 : null,
        price_single: form.price_single ? parseInt(form.price_single) * 1000 : null,
        meals_per_day: parseInt(form.meals_per_day) || 3,
        is_available: true,
        is_approved: false, // Admin must approve
        photos_urls: [],
        videos_urls: [],
      };
      const res = await fetch("/api/owner/list-pg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success("PG submitted! We'll review and publish within 24 hours.");
        router.push("/owner/dashboard");
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to submit");
      }
    } catch { toast.error("Something went wrong"); }
    finally { setSubmitting(false); }
  }

  const ChipBtn = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button type="button" onClick={onClick}
      className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
      style={{
        background: active ? "rgba(198,134,66,0.2)" : "rgba(255,255,255,0.04)",
        color: active ? "#E0A15A" : "#78716C",
        border: active ? "1px solid rgba(198,134,66,0.4)" : "1px solid rgba(255,255,255,0.07)",
      }}>
      {active ? "✓ " : ""}{label}
    </button>
  );

  const Label = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#57534E" }}>{children}</p>
  );

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: i < step ? "rgba(52,211,153,0.15)" : i === step ? "linear-gradient(135deg,#C68642,#E0A15A)" : "rgba(255,255,255,0.05)",
                  color: i < step ? "#34d399" : i === step ? "#0F0702" : "#57534E",
                  border: i < step ? "1px solid rgba(52,211,153,0.3)" : "none",
                }}>
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className="text-xs font-medium hidden sm:block"
                style={{ color: i === step ? "#E0A15A" : i < step ? "#34d399" : "#57534E" }}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="h-px w-6 sm:w-12" style={{ background: i < step ? "rgba(52,211,153,0.3)" : "rgba(198,134,66,0.1)" }} />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-6 sm:p-8" style={card}>

        {/* STEP 0: Basic Info */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <Label>PG Name (Gharpayy brand name)</Label>
              <input className={input} style={inputStyle} placeholder="e.g. FORUM PRO BOYS"
                value={form.gharpayy_name} onChange={e => set("gharpayy_name", e.target.value)}
                onFocus={e => (e.target.style.borderColor = "rgba(198,134,66,0.4)")}
                onBlur={e => (e.target.style.borderColor = "rgba(198,134,66,0.15)")} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Area</Label>
                <select className={input} style={inputStyle} value={form.area} onChange={e => set("area", e.target.value)}>
                  <option value="">Select area</option>
                  {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <Label>Locality / Sub-area</Label>
                <input className={input} style={inputStyle} placeholder="e.g. Silk Board, SG Palya"
                  value={form.locality} onChange={e => set("locality", e.target.value)}
                  onFocus={e => (e.target.style.borderColor = "rgba(198,134,66,0.4)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(198,134,66,0.15)")} />
              </div>
            </div>
            <div>
              <Label>Nearby Landmarks</Label>
              <input className={input} style={inputStyle} placeholder="e.g. Nexus Mall, Christ University, Dairy Circle"
                value={form.nearby_landmarks} onChange={e => set("nearby_landmarks", e.target.value)}
                onFocus={e => (e.target.style.borderColor = "rgba(198,134,66,0.4)")}
                onBlur={e => (e.target.style.borderColor = "rgba(198,134,66,0.15)")} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>For</Label>
                <select className={input} style={inputStyle} value={form.gender} onChange={e => set("gender", e.target.value)}>
                  <option>Boys</option><option>Girls</option><option>Co-live</option>
                </select>
              </div>
              <div>
                <Label>Property Type</Label>
                <select className={input} style={inputStyle} value={form.property_type} onChange={e => set("property_type", e.target.value)}>
                  <option>Premium</option><option>Mid</option><option>Budget</option>
                </select>
              </div>
              <div>
                <Label>Target Audience</Label>
                <select className={input} style={inputStyle} value={form.target_audience} onChange={e => set("target_audience", e.target.value)}>
                  <option>Students</option><option>Working Professionals</option><option>Both</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Room Types Available</Label>
              <div className="flex flex-wrap gap-2">
                {["Single Sharing","Double Sharing","Triple Sharing","Four Sharing","Studio"].map(rt => (
                  <ChipBtn key={rt} label={rt} active={form.room_types.includes(rt)} onClick={() => toggleArr("room_types", rt)} />
                ))}
              </div>
            </div>
            <div>
              <Label>Google Maps URL</Label>
              <input className={input} style={inputStyle} placeholder="https://maps.app.goo.gl/..."
                value={form.google_maps_url} onChange={e => set("google_maps_url", e.target.value)}
                onFocus={e => (e.target.style.borderColor = "rgba(198,134,66,0.4)")}
                onBlur={e => (e.target.style.borderColor = "rgba(198,134,66,0.15)")} />
            </div>
          </div>
        )}

        {/* STEP 1: Pricing */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl" style={{ background: "rgba(198,134,66,0.06)", border: "1px solid rgba(198,134,66,0.12)" }}>
              <p className="text-xs" style={{ color: "#A8A29E" }}>Enter prices in thousands (₹). E.g. enter <strong className="text-white">13</strong> for ₹13,000/month</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[["Triple Sharing", "price_triple"], ["Double Sharing", "price_double"], ["Single Room", "price_single"]].map(([l, k]) => (
                <div key={k}>
                  <Label>{l} (₹k/mo)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#78716C" }}>₹</span>
                    <input type="number" className={`${input} pl-7`} style={inputStyle} placeholder="0"
                      value={(form as any)[k]} onChange={e => set(k, e.target.value)}
                      onFocus={e => (e.target.style.borderColor = "rgba(198,134,66,0.4)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(198,134,66,0.15)")} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "#57534E" }}>k/mo</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Food Type</Label>
                <select className={input} style={inputStyle} value={form.food_type} onChange={e => set("food_type", e.target.value)}>
                  <option>Veg</option><option>Non Veg</option><option>Both</option><option>Self-Cook</option>
                </select>
              </div>
              <div>
                <Label>Meals per Day</Label>
                <select className={input} style={inputStyle} value={form.meals_per_day} onChange={e => set("meals_per_day", e.target.value)}>
                  <option value="0">No Meals</option><option value="2">2</option><option value="3">3</option><option value="4">4</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Food Timings</Label>
              <input className={input} style={inputStyle} placeholder="e.g. Breakfast 7-9am, Lunch 12-2pm, Dinner 7:30-9:30pm"
                value={form.food_timings} onChange={e => set("food_timings", e.target.value)}
                onFocus={e => (e.target.style.borderColor = "rgba(198,134,66,0.4)")}
                onBlur={e => (e.target.style.borderColor = "rgba(198,134,66,0.15)")} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>Security Deposit</Label>
                <select className={input} style={inputStyle} value={form.security_deposit} onChange={e => set("security_deposit", e.target.value)}>
                  <option>One Month Rent</option><option>Two Month Rent</option><option>Negotiable</option>
                </select>
              </div>
              <div>
                <Label>Minimum Stay</Label>
                <select className={input} style={inputStyle} value={form.minimum_stay} onChange={e => set("minimum_stay", e.target.value)}>
                  <option>1 Month</option><option>3 Months</option><option>6 Months</option><option>11 Months</option>
                </select>
              </div>
              <div>
                <Label>Cleaning</Label>
                <select className={input} style={inputStyle} value={form.cleaning_frequency} onChange={e => set("cleaning_frequency", e.target.value)}>
                  <option>Daily</option><option>Every Alternate Day</option><option>Weekly</option>
                </select>
              </div>
            </div>
            <div>
              <Label>USP / Highlights</Label>
              <input className={input} style={inputStyle} placeholder="e.g. Great property, GYM, GAMES, No Curfew"
                value={form.usp} onChange={e => set("usp", e.target.value)}
                onFocus={e => (e.target.style.borderColor = "rgba(198,134,66,0.4)")}
                onBlur={e => (e.target.style.borderColor = "rgba(198,134,66,0.15)")} />
            </div>
          </div>
        )}

        {/* STEP 2: Amenities */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label>Amenities</Label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map(a => (
                  <ChipBtn key={a} label={a} active={form.amenities.includes(a)} onClick={() => toggleArr("amenities", a)} />
                ))}
              </div>
            </div>
            <div>
              <Label>Common Area Features</Label>
              <div className="flex flex-wrap gap-2">
                {COMMON.map(c => (
                  <ChipBtn key={c} label={c} active={form.common_area_features.includes(c)} onClick={() => toggleArr("common_area_features", c)} />
                ))}
              </div>
            </div>
            <div>
              <Label>Safety Features</Label>
              <div className="flex flex-wrap gap-2">
                {SAFETY.map(s => (
                  <ChipBtn key={s} label={s} active={form.safety_features.includes(s)} onClick={() => toggleArr("safety_features", s)} />
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label>Walking Distance (mins)</Label>
                <input className={input} style={inputStyle} placeholder="e.g. 10 minutes"
                  value={form.walking_distance_mins} onChange={e => set("walking_distance_mins", e.target.value)}
                  onFocus={e => (e.target.style.borderColor = "rgba(198,134,66,0.4)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(198,134,66,0.15)")} />
              </div>
              <div>
                <Label>Accessibility</Label>
                <select className={input} style={inputStyle} value={form.accessibility} onChange={e => set("accessibility", e.target.value)}>
                  <option>Bus</option><option>Metro</option><option>Metro, Bus</option><option>Bus, Bike</option>
                </select>
              </div>
              <div>
                <Label>Noise Level</Label>
                <select className={input} style={inputStyle} value={form.noise_level} onChange={e => set("noise_level", e.target.value)}>
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
              </div>
            </div>
            <div>
              <Label>House Rules</Label>
              <input className={input} style={inputStyle} placeholder="e.g. No Curfew, No Smoking"
                value={form.house_rules} onChange={e => set("house_rules", e.target.value)}
                onFocus={e => (e.target.style.borderColor = "rgba(198,134,66,0.4)")}
                onBlur={e => (e.target.style.borderColor = "rgba(198,134,66,0.15)")} />
            </div>
          </div>
        )}

        {/* STEP 3: Contact */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl" style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)" }}>
              <p className="text-xs" style={{ color: "#34d399" }}>
                ✓ Your PG will be submitted for review. Our team will verify and publish it within 24 hours.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Manager Name</Label>
                <input className={input} style={inputStyle} placeholder="Manager's name"
                  value={form.manager_name} onChange={e => set("manager_name", e.target.value)}
                  onFocus={e => (e.target.style.borderColor = "rgba(198,134,66,0.4)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(198,134,66,0.15)")} />
              </div>
              <div>
                <Label>Manager Contact</Label>
                <input className={input} style={inputStyle} placeholder="+91 XXXXX XXXXX"
                  value={form.manager_contact} onChange={e => set("manager_contact", e.target.value)}
                  onFocus={e => (e.target.style.borderColor = "rgba(198,134,66,0.4)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(198,134,66,0.15)")} />
              </div>
              <div>
                <Label>Owner Name</Label>
                <input className={input} style={inputStyle} placeholder="Owner's name"
                  value={form.owner_name} onChange={e => set("owner_name", e.target.value)}
                  onFocus={e => (e.target.style.borderColor = "rgba(198,134,66,0.4)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(198,134,66,0.15)")} />
              </div>
              <div>
                <Label>Owner Contact</Label>
                <input className={input} style={inputStyle} placeholder="+91 XXXXX XXXXX"
                  value={form.owner_contact} onChange={e => set("owner_contact", e.target.value)}
                  onFocus={e => (e.target.style.borderColor = "rgba(198,134,66,0.4)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(198,134,66,0.15)")} />
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-xl p-4 space-y-2" style={{ background: "rgba(198,134,66,0.05)", border: "1px solid rgba(198,134,66,0.1)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#57534E" }}>Summary</p>
              {[
                ["Name", form.gharpayy_name || "—"],
                ["Location", [form.area, form.locality].filter(Boolean).join(", ") || "—"],
                ["For", `${form.gender} · ${form.property_type}`],
                ["Pricing", [form.price_triple && `₹${form.price_triple}k triple`, form.price_double && `₹${form.price_double}k double`, form.price_single && `₹${form.price_single}k single`].filter(Boolean).join(" / ") || "—"],
                ["Amenities", form.amenities.length > 0 ? `${form.amenities.length} selected` : "None"],
              ].map(([l, v]) => (
                <div key={l} className="flex items-center justify-between text-xs">
                  <span style={{ color: "#78716C" }}>{l}</span>
                  <span className="text-white font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid rgba(198,134,66,0.1)" }}>
          <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
            style={{ background: "rgba(255,255,255,0.04)", color: "#78716C", border: "1px solid rgba(255,255,255,0.07)" }}>
            <ChevronLeft className="w-4 h-4" />Back
          </button>

          {step < STEPS.length - 1 ? (
            <button type="button" onClick={() => setStep(s => s + 1)}
              disabled={step === 0 && (!form.gharpayy_name || !form.area)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
              style={{ background: "linear-gradient(135deg,#C68642,#E0A15A)", color: "#0F0702" }}>
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#C68642,#E0A15A)", color: "#0F0702" }}>
              {submitting ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(15,7,2,0.3)" strokeWidth="3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#0F0702" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              ) : <CheckCircle className="w-4 h-4" />}
              {submitting ? "Submitting..." : "Submit PG"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
