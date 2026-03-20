import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StaticBrowseClient from "@/components/pg/StaticBrowseClient";
import { ALL_PGS } from "@/data/pgs";

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

  const initialFilters = {
    area: params.area || "",
    gender: params.gender || "",
    property_type: params.property_type || "",
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
            {ALL_PGS.length}+ verified paying guest accommodations across prime locations
          </p>
        </div>
      </div>

      <StaticBrowseClient allPGs={ALL_PGS} initialFilters={initialFilters} />
      <Footer />
    </div>
  );
}
