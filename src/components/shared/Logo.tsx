"use client";

import Image from "next/image";
import styled from "styled-components";

export function Logo({ showTagline = true }: { showTagline?: boolean }) {
  return (
    <Wrapper>
      <Image src="/brand/logo-mark.svg" alt="" width={24} height={39} />
      <TextBlock>
        <Wordmark>
          NUSA<span>KLIM</span>
        </Wordmark>
        {showTagline && <Tagline>Empowering Your Climate Data</Tagline>}
      </TextBlock>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #ecefed;
  padding: 16.5px 0px;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Wordmark = styled.p`
  font-family: var(--font-manrope), sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  color: #000000;

  span {
    color: ${(p) => p.theme.colors.primary[600]};
  }
`;

const Tagline = styled.p`
  font-family: var(--font-nunito-sans), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #8b9c90;
  margin-top: 4px;
`;
