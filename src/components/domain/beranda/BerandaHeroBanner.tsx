"use client";

import styled from "styled-components";

export function BerandaHeroBanner() {
  return <Banner aria-hidden />;
}

const Banner = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #1454c9;
  pointer-events: none;
  z-index: 0;
`;
