import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Home } from "lucide-react";

export const metadata = { title: "Sign In | Gharpayy" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg,#0F0702 0%,#1A0D05 50%,#2A1408 100%)" }}>
      {/* Nav */}
      <nav className="px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 w-fit group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#C68642,#E0A15A)" }}>
            <Home className="w-4 h-4" style={{ color: "#0F0702" }} />
          </div>
          <span className="font-display text-xl font-bold text-white">Gharpayy</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <SignIn
          routing="hash"
          signUpUrl="/register"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "w-full max-w-md mx-auto",
              card: "rounded-2xl p-0 shadow-none",
              headerTitle: "font-display text-3xl font-bold",
              socialButtonsBlockButton__google: "w-full",
            },
          }}
        />
      </div>
    </div>
  );
}
