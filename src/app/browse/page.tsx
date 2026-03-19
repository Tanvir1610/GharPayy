import { createAdminClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BrowseClient from "@/components/pg/BrowseClient";
import type { PGProperty, Gender, PropertyType } from "@/types";

interface SearchParams {
  area?: string;
  gender?: string;
  property_type?: string;
  budget_max?: string;
  budget_min?: string;
  food_type?: string;
  search?: string;
}

export const metadata = {
  title: "Browse PGs in Bangalore | Gharpayy",
  description: "Find verified paying guest accommodations across Bangalore. Filter by area, gender, budget.",
};

export default async function BrowsePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const supabase = createAdminClient();

  // Fetch all PGs — server component so service role is used, bypasses RLS
  const { data: pgs, error } = await supabase
    .from("pg_properties")
    .select("*")
    .order("created_at", { ascending: false });

  const allPGs: PGProperty[] = (pgs || []) as PGProperty[];

  const initialFilters = {
    area: params.area || "",
    gender: (params.gender || "") as Gender | "",
    property_type: (params.property_type || "") as PropertyType | "",
    budget_min: params.budget_min ? parseInt(params.budget_min) : 0,
    budget_max: params.budget_max ? parseInt(params.budget_max) : 0,
    food_type: params.food_type || "",
    search: params.search || "",
  };

  return (
    <div className="min-h-screen" style={{ background: "#0F0702" }}>
      <Navbar />

      {/* Header band */}
      <div className="pt-16" style={{ background: "#1A0D05", borderBottom: "1px solid rgba(198,134,66,0.1)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: "#C68642" }}>Bangalore</p>
          <h1 className="font-display font-bold text-3xl text-white">Browse PGs</h1>
          <p className="mt-1 text-sm" style={{ color: "#A8A29E" }}>
            {allPGs.length > 0 ? `${allPGs.length} verified paying guest accommodations` : "Verified paying guest accommodations across prime locations"}
          </p>
          {error && (
            <p className="mt-2 text-xs" style={{ color: "#ef4444" }}>
              Note: Run the seed script to populate PG listings.
            </p>
          )}
        </div>
      </div>

      <BrowseClient initialPGs={allPGs} initialFilters={initialFilters} />
      <Footer />
    </div>
  );
}
