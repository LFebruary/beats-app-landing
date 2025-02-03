import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import React from "react";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "beat.ouens.club - local beats; global heat",
  description:
    "Discover, license, and collaborate on the hottest beats curated by LyleOG",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>{children}</body>
    </html>
  );
}
