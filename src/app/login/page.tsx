import LoginClient from "./LoginClient";
import Link from "next/link";
import { Home } from "lucide-react";

export const metadata = { title: "Sign In | Gharpayy" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f8f7ff] flex flex-col">
      {/* Simple nav */}
      <nav className="px-6 py-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-xl font-bold text-gray-900">Gharpayy</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-500">Sign in to your Gharpayy account</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <LoginClient />
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-orange-500 font-semibold hover:text-orange-600">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
