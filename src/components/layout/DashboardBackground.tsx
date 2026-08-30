"use client";

import styled from "styled-components";

export function DashboardBackground() {
  return <Glow aria-hidden />;
}

const Glow = styled.div`
  position: absolute;
  inset: -3px 0 auto 0;
  height: 474px;
  background: linear-gradient(180deg, #d5eeff 0%, rgba(213, 238, 255, 0) 100%);
  pointer-events: none;
  z-index: 0;
`;
