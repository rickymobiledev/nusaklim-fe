import React from "react";
import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Manrope,
  Nunito_Sans,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { Providers } from "@/components/providers/providers";
import { StyledComponentsRegistry } from "@/lib/registry";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Font dari Figma (login redesign): heading, body, dan caption/footer. */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

const SITE_URL = "https://www.nusaklim.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Nusaklim — PT Riset Perkebunan Nusantara",
  description: "Dashboard monitoring stasiun cuaca & ramalan cuaca perkebunan",
  applicationName: "Nusaklim",
  // Google mensyaratkan favicon berukuran kelipatan 48px.
  icons: {
    icon: [
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/favicon-192.png",
  },
  openGraph: {
    siteName: "Nusaklim",
    title: "Nusaklim — PT Riset Perkebunan Nusantara",
    type: "website",
    url: SITE_URL,
  },
};

/** Structured data agar Google menampilkan nama situs "Nusaklim" (bukan nusaklim.com). */
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Nusaklim",
  alternateName: ["Nusaklim", "PT Riset Perkebunan Nusantara"],
  url: `${SITE_URL}/`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${plusJakartaSans.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
