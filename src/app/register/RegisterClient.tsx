"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
    <path d="M47.532 24.552c0-1.636-.132-3.196-.38-4.696H24.48v9.02h12.986c-.572 2.94-2.24 5.428-4.748 7.088v5.872h7.668c4.488-4.14 7.146-10.232 7.146-17.284z" fill="#4285F4"/>
    <path d="M24.48 48c6.516 0 11.98-2.16 15.972-5.852l-7.668-5.872c-2.18 1.46-4.956 2.328-8.304 2.328-6.388 0-11.8-4.312-13.732-10.116H2.8v6.068A24.002 24.002 0 0024.48 48z" fill="#34A853"/>
    <path d="M10.748 28.488A14.396 14.396 0 019.98 24c0-1.564.268-3.08.768-4.488v-6.068H2.8A24.002 24.002 0 000 24c0 3.876.928 7.544 2.8 10.556l7.948-6.068z" fill="#FBBC05"/>
    <path d="M24.48 9.528c3.592 0 6.816 1.236 9.352 3.664l7.008-7.008C36.456 2.16 30.992 0 24.48 0A24.002 24.002 0 002.8 13.444l7.948 6.068c1.932-5.804 7.344-10.116 13.732-10.116z" fill="#EA4335"/>
  </svg>
);

const ROLES = [
  { value: "tenant", label: "🏠 Looking for PG",  desc: "I want to find accommodation" },
  { value: "owner",  label: "🏢 PG Owner",         desc: "I want to list my property" },
];

const INP: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(198,134,66,0.2)",
  color: "#D6D3D1",
  borderRadius: "0.75rem",
  width: "100%",
  padding: "12px 16px 12px 40px",
  fontSize: "14px",
  outline: "none",
};

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
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) { toast.error(error.message); setGoogleLoading(false); }
  };

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

  return (
    <div className="space-y-5">

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading || loading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-semibold text-sm transition-all"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.14)",
          color: "#D6D3D1",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
      >
        {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleIcon />}
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "rgba(198,134,66,0.15)" }} />
        <span className="text-xs" style={{ color: "#57534E" }}>or sign up with email</span>
        <div className="flex-1 h-px" style={{ background: "rgba(198,134,66,0.15)" }} />
      </div>

      {/* Email registration form */}
      <form onSubmit={handleRegister} className="space-y-4">

        {/* Role picker */}
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
              onChange={e => setFullName(e.target.value)} style={INP}
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
              onChange={e => setEmail(e.target.value)} style={INP}
              onFocus={e => (e.currentTarget.style.borderColor = "#C68642")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(198,134,66,0.2)")} />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: "#D6D3D1" }}>Phone <span style={{ color: "#57534E" }}>(optional)</span></label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#C68642" }} />
            <input type="tel" placeholder="+91 98765 43210" value={phone}
              onChange={e => setPhone(e.target.value)} style={INP}
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
              onChange={e => setPassword(e.target.value)}
              style={{ ...INP, paddingRight: "40px" }}
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

        <button type="submit" disabled={loading || googleLoading}
          className="btn-primary w-full py-3.5 justify-center text-sm rounded-xl">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account →"}
        </button>
      </form>
    </div>
  );
}
