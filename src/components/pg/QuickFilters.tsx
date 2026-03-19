"use client";
import Link from "next/link";

const TAGS = ["Boys", "Girls", "Co-live", "Budget", "Premium"];

export default function QuickFilters() {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-6 animate-fade-up-5">
      {TAGS.map((tag) => (
        <Link
          key={tag}
          href={`/browse?${["Boys","Girls","Co-live"].includes(tag) ? "gender" : "property_type"}=${tag}`}
          className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
          style={{
            background: "rgba(198,134,66,0.08)",
            border: "1px solid rgba(198,134,66,0.2)",
            color: "#A8A29E",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(198,134,66,0.18)";
            (e.currentTarget as HTMLElement).style.color = "#E0A15A";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(198,134,66,0.5)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(198,134,66,0.08)";
            (e.currentTarget as HTMLElement).style.color = "#A8A29E";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(198,134,66,0.2)";
          }}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
