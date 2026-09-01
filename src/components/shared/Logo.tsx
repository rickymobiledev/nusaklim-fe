"use client";

import Image from "next/image";
import styled, { css } from "styled-components";
import { media } from "@/lib/breakpoints";

type LogoVariant = "default" | "header";

export function Logo({ variant = "default" }: { variant?: LogoVariant }) {
  return (
    <Wrapper $variant={variant}>
      <IconWrapper $variant={variant}>
        <Image src="/brand/logo-mark.svg" alt="" width={24} height={39} />
      </IconWrapper>
      <TextBlock>
        <Wordmark $variant={variant}>
          NUSA<span>KLIM</span>
        </Wordmark>
        {variant === "default" ? (
          <Tagline>Empowering Your Climate Data</Tagline>
        ) : (
          <HeaderTagline>Empowering Your Climate Data</HeaderTagline>
        )}
      </TextBlock>
    </Wrapper>
  );
}

const headerWrapperStyles = css`
  gap: 8px;
  padding: 8px 0;

  ${media.desktop} {
    gap: 12px;
  }
`;

const Wrapper = styled.div<{ $variant: LogoVariant }>`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #ecefed;
  ${(p) => p.$variant === "header" && headerWrapperStyles}
`;

const iconHeaderStyles = css`
  width: 16px;
  height: 26px;

  ${media.desktop} {
    width: 24px;
    height: 39px;
  }
`;

const IconWrapper = styled.span<{ $variant: LogoVariant }>`
  display: inline-flex;
  flex-shrink: 0;
  width: 24px;
  height: 39px;

  img {
    width: 100%;
    height: 100%;
  }

  ${(p) => p.$variant === "header" && iconHeaderStyles}
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const headerWordmarkStyles = css`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  line-height: 24px;

  ${media.desktop} {
    font-size: 18px;
    line-height: 28px;
  }
`;

const Wordmark = styled.p<{ $variant: LogoVariant }>`
  font-family: var(--font-manrope), sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  color: #000000;

  span {
    color: ${(p) => p.theme.colors.primary[600]};
  }

  ${(p) => p.$variant === "header" && headerWordmarkStyles}
`;

const Tagline = styled.p`
  font-family: var(--font-nunito-sans), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #8b9c90;
`;

const HeaderTagline = styled(Tagline)`
  display: none;

  ${media.desktop} {
    display: block;
  }
`;
