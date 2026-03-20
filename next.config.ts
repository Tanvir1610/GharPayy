import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
  // Ensure server-only code doesn't get bundled into client
  serverExternalPackages: ["svix"],
};

export default nextConfig;
