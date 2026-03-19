import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gharpayy – Your Perfect PG in Bangalore",
  description:
    "Discover premium paying guest accommodations in Koramangala, Bellandur, Whitefield, Mahadevapura & more. Fully furnished, meals included, no hidden fees.",
  keywords: ["PG in Bangalore", "paying guest", "coliving", "gharpayy", "hostel bangalore"],
  openGraph: {
    title: "Gharpayy – Your Perfect PG in Bangalore",
    description: "Find your ideal paying guest accommodation with Gharpayy",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased bg-white text-gray-900">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-dm)",
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}
