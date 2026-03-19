import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PGProperty } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  if (price >= 1000) return `₹${(price / 1000).toFixed(0)}k`;
  return `₹${price}`;
}

export function getMinPrice(pg: PGProperty): number | null {
  const prices = [pg.price_triple, pg.price_double, pg.price_single]
    .filter((p): p is number => p !== null && p > 0);
  return prices.length > 0 ? Math.min(...prices) : null;
}

export function getAreaGradient(area: string): string {
  const gradients: Record<string, string> = {
    Koramangala: "from-orange-400 to-rose-500",
    Bellandur: "from-teal-400 to-cyan-500",
    Whitefield: "from-violet-400 to-purple-500",
    Mahadevapura: "from-blue-400 to-indigo-500",
    Marathahalli: "from-amber-400 to-orange-500",
    "Electronic City": "from-emerald-400 to-teal-500",
    "HSR Layout": "from-pink-400 to-rose-500",
    Jayanagar: "from-sky-400 to-blue-500",
    "MG Road": "from-red-400 to-orange-500",
    "BTM Layout": "from-lime-400 to-green-500",
    Nagawara: "from-indigo-400 to-purple-500",
  };
  return gradients[area] || "from-gray-400 to-gray-500";
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + "…" : str;
}

export const BOOKING_STATUS_MAP = {
  Pending:   { label: "Pending",   color: "bg-yellow-100 text-yellow-700" },
  Confirmed: { label: "Confirmed", color: "bg-green-100 text-green-700" },
  Cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  Completed: { label: "Completed", color: "bg-gray-100 text-gray-600" },
} as const;
