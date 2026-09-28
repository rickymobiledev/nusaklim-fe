"use client";

import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

/** Blok placeholder "sedang memuat" (pulse abu-abu). Dipakai di posisi angka/
 *  teks yang datanya belum ada supaya ukuran kartu tidak melompat begitu data
 *  datang. Ukuran lewat prop `$w`/`$h`/`$radius` (string CSS); `$tone="light"`
 *  untuk di atas background gelap/berwarna (mis. hero Beranda). */
export const SkeletonBlock = styled.div.attrs({ "aria-hidden": true })<{
  $w?: string;
  $h?: string;
  $radius?: string;
  $tone?: "default" | "light";
}>`
  display: block;
  flex-shrink: 0;
  width: ${(p) => p.$w ?? "100%"};
  height: ${(p) => p.$h ?? "16px"};
  max-width: 100%;
  border-radius: ${(p) => p.$radius ?? "6px"};
  background: ${(p) => (p.$tone === "light" ? "rgba(255, 255, 255, 0.35)" : "#e3e8e5")};
  animation: ${pulse} 1.5s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
