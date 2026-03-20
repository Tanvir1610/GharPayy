// v2
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Home, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Role stored in Clerk public metadata
  const role = user?.publicMetadata?.role as string | undefined;

  const isHero = pathname === "/";
  const navBg = scrolled || !isHero
    ? "glass border-b border-[rgba(198,134,66,0.12)]"
    : "bg-transparent";

  const navLinks = [
    { href: "/browse", label: "Browse PGs" },
    { href: "/browse?area=Koramangala", label: "Koramangala" },
    { href: "/browse?area=Whitefield", label: "Whitefield" },
    { href: "/post-requirement", label: "Post Requirement" },
  ];

  const avatar = user?.imageUrl;
  const initials = user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? "U";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #C68642, #E0A15A)" }}>
              <Home className="w-4 h-4" style={{ color: "#0F0702" }} />
            </div>
            <span className="font-display text-xl font-bold tracking-wide text-white group-hover:text-[#E0A15A] transition-colors">
              Gharpayy
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: "#A8A29E" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#E0A15A")}
                onMouseLeave={e => (e.currentTarget.style.color = "#A8A29E")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoaded ? null : user ? (
              <>
                <Link href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: "#A8A29E" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#E0A15A")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#A8A29E")}
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                {role === "admin" && (
                  <Link href="/admin"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{ color: "#A8A29E" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#E0A15A")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#A8A29E")}
                  >
                    <Shield className="w-4 h-4" /> Admin
                  </Link>
                )}
                <button onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: "#A8A29E" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#A8A29E")}
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
                {/* Avatar */}
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-9 h-9 rounded-full object-cover ring-2 ring-[rgba(198,134,66,0.4)]" />
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: "linear-gradient(135deg,#C68642,#E0A15A)", color: "#0F0702" }}>
                    {initials}
                  </div>
                )}
              </>
            ) : (
              <>
                <Link href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  style={{ color: "#D6D3D1" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#E0A15A")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#D6D3D1")}
                >
                  Sign in
                </Link>
                <Link href="/register" className="btn-primary text-sm px-5 py-2.5">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-xl transition-colors"
            style={{ color: "#D6D3D1" }} onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t" style={{ background: "#1A0D05", borderColor: "rgba(198,134,66,0.15)" }}>
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium"
                style={{ color: "#A8A29E" }} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="pt-3 space-y-2" style={{ borderTop: "1px solid rgba(198,134,66,0.1)" }}>
              {user ? (
                <>
                  <Link href="/dashboard" className="block px-3 py-2.5 rounded-xl text-sm font-medium"
                    style={{ color: "#A8A29E" }} onClick={() => setOpen(false)}>Dashboard</Link>
                  <button onClick={handleSignOut} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium"
                    style={{ color: "#ef4444" }}>Sign out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-3 py-2.5 rounded-xl text-sm font-medium"
                    style={{ color: "#D6D3D1" }} onClick={() => setOpen(false)}>Sign in</Link>
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
