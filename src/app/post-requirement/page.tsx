import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LeadFormClient from "./LeadFormClient";

export const metadata = {
  title: "Post Your Requirement | Gharpayy",
  description: "Tell us what you need and we'll match you with the perfect PG in Bangalore.",
};

export default function PostRequirementPage() {
  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
              Find Your Perfect PG
            </h1>
            <p className="text-gray-500 text-lg">
              Tell us your requirements and we&apos;ll match you with the best PGs in minutes.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <LeadFormClient />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
