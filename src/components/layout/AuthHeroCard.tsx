"use client";

import Image from "next/image";
import styled from "styled-components";

export function AuthHeroCard({
  imageSrc,
  headline,
}: {
  imageSrc: string;
  headline: string;
}) {
  return (
    <Card>
      <HeroImage src={imageSrc} alt="" width={396} height={528} priority />
      <GlowEllipse />
      <Headline>{headline}</Headline>
    </Card>
  );
}

const Card = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 234px;
  border-radius: 20px;
  background: #175fe2;
`;

const HeroImage = styled(Image)`
  position: absolute;
  left: 0;
  bottom: -63px;
  width: 100%;
  height: auto;
`;

const GlowEllipse = styled.div`
  position: absolute;
  top: -172px;
  left: -131px;
  width: 395.59px;
  height: 242.45px;
  background: #175fe2;
  opacity: 0.8;
  filter: blur(62.15px);
  transform: rotate(-20.54deg);
  pointer-events: none;
`;

const Headline = styled.h2`
  position: absolute;
  top: 21px;
  left: 18px;
  width: 248px;
  color: #ffffff;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
`;
