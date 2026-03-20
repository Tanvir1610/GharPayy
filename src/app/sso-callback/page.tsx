"use client";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0F0702" }}>
      <div className="text-center">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse"
          style={{ background: "linear-gradient(135deg,#C68642,#E0A15A)" }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#0F0702" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-sm font-medium" style={{ color: "#A8A29E" }}>Signing you in...</p>
      </div>
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/onboarding-check"
        signUpFallbackRedirectUrl="/onboarding"
      />
    </div>
  );
}
