"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ROLES = [
  { value: "tenant", label: "🏠 Looking for PG",  desc: "I want to find accommodation" },
  { value: "owner",  label: "🏢 PG Owner",         desc: "I want to list my property" },
];

export default function RegisterClient() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"tenant"|"owner">("tenant");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { full_name: fullName, phone, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Account created! Check your email to verify.");
    router.push("/login");
  };

  const inp = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(198,134,66,0.2)",
    color: "#D6D3D1",
    borderRadius: "0.75rem",
    width: "100%",
    padding: "12px 16px 12px 40px",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <form onSubmit={handleRegister} className="space-y-5">
      {/* Role */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "#D6D3D1" }}>I am a...</label>
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map(r => (
            <button key={r.value} type="button" onClick={() => setRole(r.value as "tenant"|"owner")}
              className="p-3 rounded-xl text-left transition-all"
              style={{
                border: `2px solid ${role === r.value ? "#C68642" : "rgba(198,134,66,0.15)"}`,
                background: role === r.value ? "rgba(198,134,66,0.1)" : "transparent",
              }}>
              <div className="font-semibold text-sm text-white">{r.label}</div>
              <div className="text-xs mt-0.5" style={{ color: "#78716C" }}>{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#D6D3D1" }}>Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#C68642" }} />
          <input type="text" required placeholder="Your full name" value={fullName}
            onChange={e => setFullName(e.target.value)} style={inp}
            onFocus={e => (e.currentTarget.style.borderColor = "#C68642")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(198,134,66,0.2)")} />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#D6D3D1" }}>Email address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#C68642" }} />
          <input type="email" required placeholder="you@example.com" value={email}
            onChange={e => setEmail(e.target.value)} style={inp}
            onFocus={e => (e.currentTarget.style.borderColor = "#C68642")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(198,134,66,0.2)")} />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#D6D3D1" }}>Phone Number</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#C68642" }} />
          <input type="tel" placeholder="+91 98765 43210" value={phone}
            onChange={e => setPhone(e.target.value)} style={inp}
            onFocus={e => (e.currentTarget.style.borderColor = "#C68642")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(198,134,66,0.2)")} />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#D6D3D1" }}>Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#C68642" }} />
          <input type={showPw ? "text" : "password"} required placeholder="Min. 6 characters" value={password}
            onChange={e => setPassword(e.target.value)} style={{ ...inp, paddingRight: "40px" }}
            onFocus={e => (e.currentTarget.style.borderColor = "#C68642")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(198,134,66,0.2)")} />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: "#78716C" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#E0A15A")}
            onMouseLeave={e => (e.currentTarget.style.color = "#78716C")}>
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-4 justify-center text-base rounded-xl">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
      </button>
    </form>
  );
}
