"use client";

import { useState } from "react";
import styled from "styled-components";
import { ImageIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

/** Thumbnail cover berita (Figma "Frame 333": kotak #EFF5FF, radius 16,
 *  ikon gambar #8DB5FF bila cover tidak ada/gagal dimuat). `<img>` biasa —
 *  host cover belum tentu terdaftar di `next/image`. */
export function NewsCover({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = !!src && failedSrc !== src;

  return (
    <Box className={className}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- host cover tak terdaftar di next/image
        <img src={src} alt={alt} onError={() => setFailedSrc(src)} />
      ) : (
        <ImageIcon size={54} strokeWidth={1.5} color="#8DB5FF" />
      )}
    </Box>
  );
}

/** "30 Agustus 2026, 12:02 WIB" (tanggal tanpa jam → 00:00). */
export function formatNewsDate(createdAt: string): string {
  try {
    return format(parseISO(createdAt), "d MMMM yyyy, HH:mm 'WIB'", { locale: id });
  } catch {
    return createdAt;
  }
}

const Box = styled.div`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #eff5ff;
  border-radius: 16px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
