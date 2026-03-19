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
    <footer className="bg-[#0f0e22] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">Gharpayy</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Your trusted partner for finding the perfect paying guest accommodation in Bangalore. Zero brokerage, verified properties.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-orange-500 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-orange-500 flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-orange-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Explore Areas</h4>
            <ul className="space-y-2.5">
              {AREAS.map((area) => (
                <li key={area}>
                  <Link href={`/browse?area=${encodeURIComponent(area)}`} className="text-gray-400 hover:text-orange-400 text-sm transition-colors flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 text-orange-400 shrink-0" />
                Bangalore, Karnataka, India
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                +91 99999 00000
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                hello@gharpayy.com
              </li>
            </ul>
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400 mb-2">Looking for a PG?</p>
              <Link href="/browse" className="text-orange-400 font-semibold text-sm hover:text-orange-300 transition-colors">
                Browse all listings →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Gharpayy. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
