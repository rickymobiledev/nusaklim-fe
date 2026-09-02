"use client";

import Image from "next/image";
import styled from "styled-components";

export function AirTemperatureTitle() {
  return (
    <Wrapper>
      <Image src="/brand/temperature.png" alt="" width={48} height={48} />
      <Title>Temperatur Udara</Title>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Title = styled.h1`
  font-family: var(--font-manrope), sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  color: #000000;
`;
