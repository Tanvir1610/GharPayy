import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PGDetailClient from "@/components/pg/PGDetailClient";
import type { PGProperty } from "@/types";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase.from("pg_properties").select("gharpayy_name, area, locality").eq("id", id).single();
  if (!data) return { title: "PG Not Found | Gharpayy" };
  return {
    title: `${data.gharpayy_name} – ${data.area} | Gharpayy`,
    description: `Verified PG in ${data.locality || data.area}, Bangalore. View amenities, pricing and book online.`,
  };
}

export default async function PGDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  const supabase = createAdminClient();

  const { data: pg } = await supabase.from("pg_properties").select("*").eq("id", id).single();
  if (!pg) notFound();

  // Check if saved by current user
  let isSaved = false;
  if (userId) {
    const { data: saved } = await supabase
      .from("saved_pgs")
      .select("id")
      .match({ user_id: userId, pg_id: id })
      .single();
    isSaved = !!saved;
  }

  // Get reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, user:profiles(full_name)")
    .eq("pg_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen" style={{ background: "#0F0702" }}>
      <Navbar />
      <div className="pt-16">
        <PGDetailClient
          pg={pg as PGProperty}
          isSaved={isSaved}
          reviews={reviews || []}
          userId={userId ?? undefined}
        />
      </div>
      <Footer />
    </div>
  );
}
