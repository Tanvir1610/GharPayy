import Link from "next/link";
import { Home } from "lucide-react";
import RegisterClient from "./RegisterClient";

export const metadata = { title: "Create Account | Gharpayy" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f8f7ff] flex flex-col">
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
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Create account</h1>
            <p className="text-gray-500">Join thousands finding their perfect PG</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <RegisterClient />
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500 font-semibold hover:text-orange-600">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
