"use client";
import Link from "next/link";
import { Home, MapPin, Phone, Mail, Instagram, Linkedin } from "lucide-react";

const AREAS = ["Koramangala", "Bellandur", "Whitefield", "Mahadevapura", "Marathahalli", "Electronic City", "HSR Layout", "Jayanagar"];
const LINKS = [
  { label: "Browse PGs", href: "/browse" },
  { label: "Boys PGs", href: "/browse?gender=Boys" },
  { label: "Girls PGs", href: "/browse?gender=Girls" },
  { label: "Co-Living", href: "/browse?gender=Co-live" },
  { label: "Premium Stays", href: "/browse?property_type=Premium" },
  { label: "Budget Stays", href: "/browse?property_type=Budget" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0F0702", borderTop: "1px solid rgba(198,134,66,0.12)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-5 w-fit">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#C68642,#E0A15A)" }}>
                <Home className="w-4 h-4" style={{ color: "#0F0702" }} />
              </div>
              <span className="font-display text-xl font-bold text-white">Gharpayy</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#A8A29E" }}>
              Your trusted partner for premium paying guest accommodation in Bangalore. Zero brokerage, verified properties.
            </p>
            <div className="flex gap-3">
              {[Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{ background: "rgba(198,134,66,0.1)", color: "#A8A29E", border: "1px solid rgba(198,134,66,0.15)" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg,#C68642,#E0A15A)";
                    (e.currentTarget as HTMLElement).style.color = "#0F0702";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(198,134,66,0.1)";
                    (e.currentTarget as HTMLElement).style.color = "#A8A29E";
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2.5">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm transition-colors"
                    style={{ color: "#A8A29E" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#E0A15A")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#A8A29E")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-lg">Explore Areas</h4>
            <ul className="space-y-2.5">
              {AREAS.map((area) => (
                <li key={area}>
                  <Link href={`/browse?area=${encodeURIComponent(area)}`}
                    className="text-sm flex items-center gap-1.5 transition-colors"
                    style={{ color: "#A8A29E" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#E0A15A")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#A8A29E")}
                  >
                    <MapPin className="w-3 h-3" style={{ color: "#C68642" }} />
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-lg">Contact Us</h4>
            <ul className="space-y-3">
              {[
                { icon: MapPin, text: "Bangalore, Karnataka, India" },
                { icon: Phone, text: "+91 99999 00000" },
                { icon: Mail,  text: "hello@gharpayy.com" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm" style={{ color: "#A8A29E" }}>
                  <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#C68642" }} />
                  {text}
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(198,134,66,0.08)", border: "1px solid rgba(198,134,66,0.2)" }}>
              <p className="text-xs mb-2" style={{ color: "#A8A29E" }}>Looking for a PG?</p>
              <Link href="/browse"
                className="font-semibold text-sm transition-colors"
                style={{ color: "#C68642" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#E0A15A")}
                onMouseLeave={e => (e.currentTarget.style.color = "#C68642")}
              >
                Browse all listings →
              </Link>
            </div>
          </div>
        </div>

        {/* Gold divider */}
        <div className="my-10 gold-line" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm" style={{ color: "#57534E" }}>
            © {new Date().getFullYear()} Gharpayy. All rights reserved.
          </p>
          <div className="flex gap-5 text-sm" style={{ color: "#57534E" }}>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
