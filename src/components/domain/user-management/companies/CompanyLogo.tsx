"use client";

import styled from "styled-components";
import { Building2 } from "lucide-react";

/** Logo perusahaan bulat. `imageUrl` null → placeholder gedung. Pakai `<img>`
 *  biasa (bukan next/image) karena host `image_url` belum terdaftar di
 *  `next.config.ts` — pola sama `UserAvatarUpload.tsx`. */
export function CompanyLogo({
  imageUrl,
  name,
  size = 80,
}: {
  imageUrl: string | null;
  name: string;
  size?: number;
}) {
  return (
    <Circle $size={size} $filled={!!imageUrl}>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- host image_url belum terdaftar di next/image
        <img src={imageUrl} alt={`Logo ${name}`} />
      ) : (
        <Building2 size={size / 2} strokeWidth={1.5} color="#8DB5FF" aria-hidden />
      )}
    </Circle>
  );
}

const Circle = styled.div<{ $size: number; $filled: boolean }>`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  border-radius: 50%;
  background: ${(p) => (p.$filled ? "transparent" : "#eff5ff")};
  overflow: hidden;

  img {
    width: ${(p) => Math.round(p.$size * 0.78)}px;
    height: ${(p) => Math.round(p.$size * 0.78)}px;
    object-fit: contain;
  }
`;
