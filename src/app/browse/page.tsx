import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BrowseClient from "@/components/pg/BrowseClient";
import type { PGProperty } from "@/types";

interface SearchParams {
  area?: string;
  gender?: string;
  property_type?: string;
  room_type?: string;
  budget_min?: string;
  budget_max?: string;
  food_type?: string;
  search?: string;
}

export const metadata = {
  title: "Browse PGs in Bangalore | Gharpayy",
  description: "Find verified paying guest accommodations in Bangalore.",
};

export default async function BrowsePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("pg_properties")
    .select("*")
    .eq("is_approved", true)
    .eq("is_available", true);

  if (params.area) query = query.ilike("area", `%${params.area}%`);
  if (params.gender) query = query.eq("gender", params.gender);
  if (params.property_type) query = query.eq("property_type", params.property_type);
  if (params.food_type) query = query.eq("food_type", params.food_type);
  if (params.budget_min) query = query.gte("price_double", parseInt(params.budget_min));
  if (params.budget_max) query = query.lte("price_double", parseInt(params.budget_max));
  if (params.search) {
    query = query.or(
      `gharpayy_name.ilike.%${params.search}%,area.ilike.%${params.search}%,locality.ilike.%${params.search}%,nearby_landmarks.ilike.%${params.search}%`
    );
  }

  const { data: pgs } = await query.order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <BrowseClient
          initialPGs={(pgs || []) as PGProperty[]}
          initialFilters={{
            area: params.area,
            gender: params.gender as any,
            property_type: params.property_type as any,
            budget_max: params.budget_max ? parseInt(params.budget_max) : undefined,
            search: params.search,
          }}
        />
      </div>
      <Footer />
    </div>
  );
}
