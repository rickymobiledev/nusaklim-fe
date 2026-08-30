"use client";

import styled from "styled-components";

export function DashboardTitle() {
  return <Title>Dashboard</Title>;
}

const Title = styled.h1`
  font-family: var(--font-manrope), sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 34px;
  color: #1d2520;
`;
