"use client";

import styled from "styled-components";
import { ImageIcon } from "lucide-react";

/** Avatar stasiun bulat — belum ada foto stasiun dari BE, jadi selalu
 *  placeholder gambar (sesuai Figma). */
export function StationAvatar({ size = 110 }: { size?: number }) {
  return (
    <Circle $size={size}>
      <ImageIcon
        size={Math.round(size * 0.45)}
        strokeWidth={1.5}
        color="#8DB5FF"
        aria-hidden
      />
    </Circle>
  );
}

const Circle = styled.div<{ $size: number }>`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  border-radius: 50%;
  background: #eff5ff;
`;
