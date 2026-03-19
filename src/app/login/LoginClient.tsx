"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginClient() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back!");
    router.push("/dashboard");
    router.refresh();
  };

  const inp = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(198,134,66,0.2)",
    color: "#D6D3D1",
    borderRadius: "0.75rem",
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#D6D3D1" }}>Email address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#C68642" }} />
          <input
            type="email" required placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 placeholder-[#57534E]"
            style={{ ...inp, boxShadow: "none" }}
            onFocus={e => (e.currentTarget.style.borderColor = "#C68642")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(198,134,66,0.2)")}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#D6D3D1" }}>Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#C68642" }} />
          <input
            type={showPw ? "text" : "password"} required placeholder="Your password"
            value={password} onChange={e => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 text-sm focus:outline-none placeholder-[#57534E]"
            style={inp}
            onFocus={e => (e.currentTarget.style.borderColor = "#C68642")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(198,134,66,0.2)")}
          />
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
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
      </button>
    </form>
  );
}
