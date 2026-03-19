"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ROLES = [
  { value: "tenant", label: "🏠 Looking for PG", desc: "I want to find accommodation" },
  { value: "owner",  label: "🏢 PG Owner",       desc: "I want to list my property" },
];

export default function RegisterClient() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"tenant" | "owner">("tenant");
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

  return (
    <form onSubmit={handleRegister} className="space-y-5">
      {/* Role selection */}
      <div>
        <label className="label">I am a...</label>
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map(r => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value as any)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${role === r.value ? "border-orange-400 bg-orange-50" : "border-gray-100 hover:border-orange-200"}`}
            >
              <div className="font-medium text-sm text-gray-900">{r.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input type="text" required placeholder="Your full name" value={fullName} onChange={e => setFullName(e.target.value)} className="input pl-10" />
        </div>
      </div>

      <div>
        <label className="label">Email address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="input pl-10" />
        </div>
      </div>

      <div>
        <label className="label">Phone Number</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} className="input pl-10" />
        </div>
      </div>

      <div>
        <label className="label">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input type={showPw ? "text" : "password"} required placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} className="input pl-10 pr-10" />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-4 justify-center text-base">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
      </button>
    </form>
  );
}
