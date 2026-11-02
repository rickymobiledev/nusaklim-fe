"use client";

import { useState } from "react";
import styled from "styled-components";

/** Avatar bulat 80px Pengguna Aghris. `imageUrl` ada → foto; null atau gagal
 *  dimuat → placeholder generik Figma "media-image". Pakai `<img>` biasa
 *  (host gambar BE tidak ada di `next.config` images), pola sama `CompanyLogo`. */
export function AghrisUserAvatar({
  imageUrl,
  name,
}: {
  imageUrl: string | null;
  name: string;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showPhoto = !!imageUrl && failedUrl !== imageUrl;

  return (
    <Circle>
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={`Foto ${name}`} onError={() => setFailedUrl(imageUrl)} />
      ) : (
        <PhotoPlaceholderIcon />
      )}
    </Circle>
  );
}

function PhotoPlaceholderIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M35 5.6V34.4C35 34.7314 34.7314 35 34.4 35H5.6C5.26863 35 5 34.7314 5 34.4V5.6C5 5.26863 5.26863 5 5.6 5H34.4C34.7314 5 35 5.26863 35 5.6Z"
        stroke="#8DB5FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 26.667L16.6667 21.667L35 30.0003"
        stroke="#8DB5FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26.6667 16.6667C24.8257 16.6667 23.3333 15.1743 23.3333 13.3333C23.3333 11.4924 24.8257 10 26.6667 10C28.5076 10 30 11.4924 30 13.3333C30 15.1743 28.5076 16.6667 26.6667 16.6667Z"
        stroke="#8DB5FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const Circle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  overflow: hidden;
  background: #eff5ff;
  border-radius: 50px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
