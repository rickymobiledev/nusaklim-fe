"use client";

import Image from "next/image";
import styled from "styled-components";

export function BerandaHeroBanner() {
  return (
    <Banner aria-hidden>
      <PatternLayer>
        {/* TODO: opacity/blend-mode final belum diketahui — asset ini
         *  menggantikan pattern SVG lama, sesuaikan begitu ada arahan
         *  dari Figma soal treatment-nya. */}
        <Image
          src="/brand/dashboard-hero-bg.png"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </PatternLayer>
    </Banner>
  );
}

const Banner = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #1454c9;
  pointer-events: none;
  z-index: 0;
`;

const PatternLayer = styled.div`
  position: absolute;
  inset: 0;
`;
