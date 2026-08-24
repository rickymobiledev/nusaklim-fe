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

export const metadata: Metadata = {
  title: "Monitoring Cuaca — PT Riset Perkebunan Nusantara",
  description: "Dashboard monitoring stasiun cuaca & ramalan cuaca perkebunan",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${plusJakartaSans.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
