"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Home, Search, Heart, User, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { UserProfile } from "@/types";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()
          .then(({ data: profile }) => setUser(profile));
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) setUser(null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const isHero = pathname === "/";
  const navBg = isHero
    ? scrolled
      ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
      : "bg-transparent"
    : "bg-white border-b border-gray-100";
  const textColor = isHero && !scrolled ? "text-white" : "text-gray-700";
  const logoColor = isHero && !scrolled ? "text-white" : "text-gray-900";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const navLinks = [
    { href: "/browse", label: "Browse PGs" },
    { href: "/browse?area=Koramangala", label: "Koramangala" },
    { href: "/browse?area=Whitefield", label: "Whitefield" },
    { href: "/post-requirement", label: "Post Requirement" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className={`font-display text-xl font-bold ${logoColor} flex items-center gap-2`}>
            <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            Gharpayy
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${textColor} hover:text-orange-500 hover:bg-orange-50/50`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${textColor} hover:text-orange-500`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${textColor} hover:text-orange-500`}>
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${textColor} hover:text-red-500`}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm">
                  {user.full_name?.[0]?.toUpperCase() || "U"}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${textColor} hover:text-orange-500`}>
                  Sign in
                </Link>
                <Link href="/register" className="btn-primary text-sm px-4 py-2">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-xl ${textColor}`}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              {user ? (
                <>
                  <Link href="/dashboard" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700" onClick={() => setOpen(false)}>
                    Sign in
                  </Link>
                  <Link href="/register" className="block btn-primary text-center text-sm" onClick={() => setOpen(false)}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
