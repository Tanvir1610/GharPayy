"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg,#0F0702 0%,#12090A 50%,#0A0F1A 100%)" }}>

      {/* Back to site */}
      <Link href="/" className="flex items-center gap-2 text-xs mb-10 transition-colors"
        style={{ color: "#57534E" }}
        onMouseEnter={e => (e.currentTarget.style.color = "#A8A29E")}
        onMouseLeave={e => (e.currentTarget.style.color = "#57534E")}>
        ← Back to Gharpayy
      </Link>

      <div className="w-full max-w-sm rounded-3xl p-8 flex flex-col gap-6"
        style={{
          background: "rgba(10,5,2,0.95)",
          border: "1px solid rgba(239,68,68,0.2)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(239,68,68,0.05)",
        }}>

        {/* Icon */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <Shield className="w-7 h-7" style={{ color: "#f87171" }} />
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-xs mt-1" style={{ color: "#57534E" }}>Gharpayy Control Panel</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#57534E" }} />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Admin email"
              required
              className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-[#57534E] outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={e => (e.target.style.borderColor = "rgba(239,68,68,0.4)")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#57534E" }} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full pl-9 pr-10 py-3 rounded-xl text-sm text-white placeholder-[#57534E] outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={e => (e.target.style.borderColor = "rgba(239,68,68,0.4)")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "#57534E" }}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-xs px-3 py-2.5 rounded-xl"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
              <Shield className="w-3.5 h-3.5 flex-shrink-0" />{error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#dc2626,#ef4444)", color: "#fff" }}>
            {loading
              ? <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></svg>
              : <Shield className="w-4 h-4" />
            }
            {loading ? "Verifying..." : "Access Admin Panel"}
          </button>
        </form>

        <p className="text-xs text-center" style={{ color: "#2A1408" }}>
          Restricted access · Gharpayy Admin v2
        </p>
      </div>
    </div>
  );
}
