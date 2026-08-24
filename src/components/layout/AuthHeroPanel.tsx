"use client";

import Image from "next/image";
import styled from "styled-components";

export function AuthHeroPanel({
  imageSrc,
  headline,
  className,
}: {
  imageSrc: string;
  headline: string;
  className?: string;
}) {
  return (
    <Panel className={className}>
      <Image
        src={imageSrc}
        alt=""
        fill
        sizes="50vw"
        priority
        style={{ objectFit: "cover" }}
      />
      <Overlay />
      <Headline>{headline}</Headline>
    </Panel>
  );
}

const Panel = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  border-radius: 20px;
  background: ${(p) => p.theme.colors.primary[700]};
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    ${(p) => p.theme.colors.primary[700]}b3 0%,
    ${(p) => p.theme.colors.primary[700]}00 55%
  );
`;

const Headline = styled.h2`
  position: absolute;
  top: 91px;
  left: 72px;
  right: 72px;
  max-width: 400px;
  color: #ffffff;
  font-family: var(--font-manrope), sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 34px;
`;
