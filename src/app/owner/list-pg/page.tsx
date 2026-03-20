import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ListPGForm from "@/components/owner/ListPGForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "List Your PG | Gharpayy" };

export default async function ListPGPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const supabase = createAdminClient();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();
  if (!profile || profile.role === "tenant") redirect("/dashboard");

  return (
    <div className="min-h-screen" style={{ background: "#0F0702" }}>
      <Navbar />
      <div className="pt-20 pb-12 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">List Your PG</h1>
          <p className="text-sm" style={{ color: "#A8A29E" }}>
            Fill in the details below to list your property on Gharpayy. Our team will review and publish it within 24 hours.
          </p>
        </div>
        <ListPGForm ownerId={userId} />
      </div>
      <Footer />
    </div>
  );
}
