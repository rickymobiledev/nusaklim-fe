"use client";

import styled from "styled-components";

export function DashboardFooter() {
  return (
    <Wrapper>
      <Version>Nusaklim v2.0</Version>
      <Divider aria-hidden />
      <Copyright>2026 Nusaklim, All right Reserved</Copyright>
    </Wrapper>
  );
}

const Wrapper = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #f5f7fb;
  border-top: 1px solid #8aceff;
`;

const Version = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #1d2520;
`;

const Divider = styled.span`
  width: 1px;
  height: 16px;
  background: #d6dcd8;
`;

const Copyright = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1px;
  color: #6d717f;
`;
