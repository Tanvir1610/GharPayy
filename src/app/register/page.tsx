import Link from "next/link";
import { Home } from "lucide-react";
import RegisterClient from "./RegisterClient";

export const metadata = { title: "Create Account | Gharpayy" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg,#0F0702 0%,#1A0D05 50%,#2A1408 100%)" }}>
      <nav className="px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#C68642,#E0A15A)" }}>
            <Home className="w-4 h-4" style={{ color: "#0F0702" }} />
          </div>
          <span className="font-display text-xl font-bold text-white">Gharpayy</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-3xl text-white mb-2">Create your account</h1>
            <p style={{ color: "#A8A29E" }}>Join thousands finding their perfect PG</p>
          </div>

          <div className="rounded-2xl p-8" style={{ background: "linear-gradient(145deg,#1A0D05,#2A1408)", border: "1px solid rgba(198,134,66,0.2)" }}>
            <RegisterClient />
            <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(198,134,66,0.1)" }}>
              <p className="text-center text-sm" style={{ color: "#78716C" }}>
                Already have an account?{" "}
                <Link href="/login" className="font-semibold" style={{ color: "#C68642" }}>Sign in →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
