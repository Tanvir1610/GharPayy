import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gharpayy – Premium PG Stays in Bangalore",
  description:
    "Discover curated paying guest accommodations in Koramangala, Bellandur, Whitefield & more. Fully furnished, meals included, zero brokerage.",
  keywords: ["PG in Bangalore", "paying guest", "coliving", "gharpayy", "premium hostel bangalore"],
  openGraph: {
    title: "Gharpayy – Premium PG Stays in Bangalore",
    description: "Find your ideal paying guest accommodation with Gharpayy",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#C68642",
          colorBackground: "#1A0D05",
          colorInputBackground: "rgba(255,255,255,0.05)",
          colorInputText: "#D6D3D1",
          colorText: "#D6D3D1",
          colorTextSecondary: "#A8A29E",
          borderRadius: "0.75rem",
          fontFamily: "DM Sans, sans-serif",
        },
        elements: {
          card: { background: "linear-gradient(145deg,#1A0D05,#2A1408)", border: "1px solid rgba(198,134,66,0.2)" },
          headerTitle: { color: "#FFFFFF", fontFamily: "var(--font-cormorant)" },
          headerSubtitle: { color: "#A8A29E" },
          socialButtonsBlockButton: {
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            color: "#D6D3D1",
          },
          formButtonPrimary: { background: "linear-gradient(135deg,#C68642,#E0A15A)", color: "#0F0702" },
          footerActionLink: { color: "#C68642" },
        },
      }}
    >
      <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
        <body className="font-sans antialiased" style={{ backgroundColor: "#0F0702" }}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "DM Sans, sans-serif",
                borderRadius: "12px",
                background: "#2A1408",
                color: "#D6D3D1",
                border: "1px solid rgba(198,134,66,0.3)",
              },
              success: { iconTheme: { primary: "#C68642", secondary: "#0F0702" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#0F0702" } },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
