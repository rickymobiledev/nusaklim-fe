"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowRightIcon } from "lucide-react";
import { media } from "@/lib/breakpoints";
import type { NewsItem } from "@/types/domain";

const formatDate = (value: string) =>
  format(parseISO(value), "d MMMM yyyy", { locale: id });

/** Kartu utama (besar, gambar penuh + overlay gelap) — item pertama tiap
 *  halaman daftar berita. */
export function NewsFeaturedCard({ item }: { item: NewsItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = !!item.coverImage && !imageFailed;

  return (
    <FeaturedLink href={`/news/${item.id}`}>
      {showImage ? (
        <Image
          src={item.coverImage!}
          alt=""
          fill
          sizes="(min-width: 1280px) 924px, 100vw"
          style={{ objectFit: "cover" }}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <ImagePlaceholder />
      )}
      <Overlay />
      <FeaturedText>
        <FeaturedDate>{formatDate(item.createdAt)}</FeaturedDate>
        <FeaturedTitle>{item.title}</FeaturedTitle>
        <FeaturedExcerpt>{item.excerpt}</FeaturedExcerpt>
        <FeaturedAction>
          Baca Selengkapnya
          <ArrowRightIcon size={20} />
        </FeaturedAction>
      </FeaturedText>
    </FeaturedLink>
  );
}

/** Kartu biasa (gambar atas, teks bawah). `compact` = tanpa ringkasan &
 *  tombol (mobile Figma). Di desktop `compact` diabaikan lewat CSS. */
export function NewsArticleCard({ item }: { item: NewsItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = !!item.coverImage && !imageFailed;

  return (
    <CardLink href={`/news/${item.id}`}>
      <ImageFrame>
        {showImage ? (
          <Image
            src={item.coverImage!}
            alt=""
            fill
            sizes="(min-width: 1280px) 457px, 100vw"
            style={{ objectFit: "cover" }}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <ImagePlaceholder />
        )}
      </ImageFrame>
      <CardText>
        <CardDate>{formatDate(item.createdAt)}</CardDate>
        <CardTitle>{item.title}</CardTitle>
        <CardExcerpt>{item.excerpt}</CardExcerpt>
        <CardAction>
          Baca Selengkapnya
          <ArrowRightIcon size={20} />
        </CardAction>
      </CardText>
    </CardLink>
  );
}

const ImagePlaceholder = styled.div`
  position: absolute;
  inset: 0;
  background: #d4d4d4;
`;

const FeaturedLink = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 252px;
  padding: 20px;
  border-radius: 16px;
  overflow: hidden;
  background: #d4d4d4;

  ${media.desktop} {
    flex: 2 1 0;
    min-height: 454px;
    padding: 24px;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 43.25%, rgba(0, 0, 0, 0.8) 100%);
`;

const FeaturedText = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FeaturedDate = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  line-height: 16px;
  color: #ffffff;
`;

const FeaturedTitle = styled.h2`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #ffffff;
`;

const FeaturedExcerpt = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  line-height: 16px;
  color: rgba(255, 255, 255, 0.6);
`;

/* Tombol "Baca Selengkapnya" cuma di desktop (Figma mobile tanpa tombol). */
const FeaturedAction = styled.span`
  display: none;
  align-items: center;
  gap: 4px;
  margin-top: 12px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #ffffff;

  ${media.desktop} {
    display: inline-flex;
  }
`;

const CardLink = styled(Link)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  background: #ffffff;
`;

const ImageFrame = styled.div`
  position: relative;
  width: 100%;
  height: 172px;
  background: #d4d4d4;

  ${media.desktop} {
    height: 284px;
  }
`;

const CardText = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
`;

const CardDate = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  line-height: 16px;
  color: #37433b;
`;

const CardTitle = styled.h2`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #000000;

  ${media.desktop} {
    font-size: 14px;
    line-height: 20px;
  }
`;

/* Ringkasan & tombol cuma di desktop (Figma mobile: tanggal + judul saja). */
const CardExcerpt = styled.p`
  display: none;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  line-height: 16px;
  color: #667a6c;

  ${media.desktop} {
    display: -webkit-box;
  }
`;

const CardAction = styled.span`
  display: none;
  align-items: center;
  gap: 4px;
  margin-top: auto;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #175fe2;

  ${media.desktop} {
    display: inline-flex;
  }
`;
