"use client";
import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Home } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const { signIn, isLoaded } = useSignIn();
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    if (!isLoaded) return;
    setLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/onboarding-check",
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg,#0F0702 0%,#1A0D05 50%,#2A1408 100%)" }}>
      <Link href="/" className="flex items-center gap-2.5 mb-10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#C68642,#E0A15A)" }}>
          <Home className="w-5 h-5" style={{ color: "#0F0702" }} />
        </div>
        <span className="font-display text-2xl font-bold text-white">Gharpayy</span>
      </Link>
      <div className="w-full max-w-sm rounded-3xl p-8 flex flex-col items-center gap-6"
        style={{ background: "rgba(26,13,5,0.9)", border: "1px solid rgba(198,134,66,0.2)", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-sm" style={{ color: "#A8A29E" }}>Sign in to continue to Gharpayy</p>
        </div>
        <button onClick={handleGoogleSignIn} disabled={loading || !isLoaded}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl font-semibold text-sm transition-all disabled:opacity-60"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#ffffff" }}
          onMouseEnter={e => !loading && (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          onMouseLeave={e => !loading && (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}>
          {loading ? (
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="#C68642" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {loading ? "Redirecting..." : "Continue with Google"}
        </button>
        <div className="w-full" style={{ borderTop: "1px solid rgba(198,134,66,0.1)" }} />
        <p className="text-xs text-center" style={{ color: "#57534E" }}>
          New to Gharpayy?{" "}
          <Link href="/register" className="font-semibold" style={{ color: "#C68642" }}>Create account</Link>
        </p>
      </div>
    </div>
  );
}
