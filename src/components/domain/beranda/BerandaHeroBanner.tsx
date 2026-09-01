"use client";

import styled from "styled-components";
import { DashboardHeroPattern } from "@/components/shared/DashboardHeroPattern";

export function BerandaHeroBanner() {
  return (
    <Banner aria-hidden>
      <PatternLayer>
        <DashboardHeroPattern />
      </PatternLayer>
    </Banner>
  );
}

const Banner = styled.div`
  height: 371px;
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #175fe2;
  pointer-events: none;
  z-index: 0;
`;

const PatternLayer = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.5;
`;
