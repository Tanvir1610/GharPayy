import { createClient } from "@/lib/supabase/server";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gharpayy.com";
  const supabase = await createClient();

  const { data: pgs } = await supabase
    .from("pg_properties")
    .select("id, updated_at")
    .eq("is_approved", true)
    .eq("is_available", true);

  const pgUrls = (pgs || []).map(pg => ({
    url: `${baseUrl}/pg/${pg.id}`,
    lastModified: new Date(pg.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const areas = ["Koramangala", "Bellandur", "Whitefield", "Mahadevapura", "Marathahalli", "Electronic City", "HSR Layout", "Jayanagar"];
  const areaUrls = areas.map(area => ({
    url: `${baseUrl}/browse?area=${encodeURIComponent(area)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/browse`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/post-requirement`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ...areaUrls,
    ...pgUrls,
  ];
}
