import "./globals.css";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Safari Trade Directory | 2025-2026",
  description: "Nyumbani & Hilala Camp Special Offers and Trade Profiles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
