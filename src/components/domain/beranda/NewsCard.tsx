"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { useNews } from "@/hooks/use-news";
import { DataState } from "@/components/shared/DataState";
import { JournalIcon } from "@/components/shared/DashboardIcons";
import { media } from "@/lib/breakpoints";
import type { NewsItem } from "@/types/domain";

/** "Berita Pilihan" — card ringkas di Beranda, sampai 4 berita terbaru
 *  dari `GET /news/published` via `useNews()`. 1 kartu \"featured\" besar
 *  (gambar + overlay gradasi, teks putih) + 3 kartu kecil. Featured sudah
 *  di-sort ke depan oleh `compareNews` di `news-client.ts`. \"Lihat Semua\"
 *  → `/news` (daftar penuh), tiap kartu → `/news/[id]` (detail).
 *
 *  Struktur mengikuti CSS Figma persis (bukan approksimasi lagi): 1
 *  kartu \"featured\" besar (gambar + overlay gradasi, teks putih) + kartu
 *  kecil (bg putih polos, thumbnail tanpa overlay, teks tanpa ringkasan).
 *  BEDA dari kebanyakan card Beranda lain: `Section` (wrapper terluar)
 *  SENGAJA tanpa background/border/padding — Figma (\"Frame 3\") menaruh
 *  section ini polos di atas background halaman, radius cuma ada di tiap
 *  kartu artikel individual. */
export function NewsCard() {
  const { data, isLoading, isError, error } = useNews();
  /** Ambil maksimal 4 item — featured di depan (sudah disortir BE+client),
   *  sisanya 3 kartu kecil. */
  const items = (data ?? []).slice(0, 4);
  const featured = items[0];
  const smallItems = items.slice(1);

  return (
    <>
      <MobileDivider />
      <Section>
        <HeaderRow>
          <HeaderLeft>
            <JournalIcon size={20} />
            <Title>Berita Pilihan</Title>
          </HeaderLeft>
          <SeeAllLink href="/news">Lihat Semua</SeeAllLink>
        </HeaderRow>

        <DataState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={items.length === 0}
          emptyMessage="Belum ada berita."
        >
          <CardsRow>
            {featured && <FeaturedArticleCard item={featured} />}
            {smallItems.map((item) => (
              <SmallArticleCard key={item.id} item={item} />
            ))}
          </CardsRow>
        </DataState>
      </Section>
    </>
  );
}

function FeaturedArticleCard({ item }: { item: NewsItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = !!item.coverImage && !imageFailed;

  return (
    <FeaturedArticle href={`/news/${item.id}`}>
      {showImage ? (
        <Image
          src={item.coverImage!}
          alt=""
          fill
          sizes="(min-width: 1280px) 530px, 60vw"
          style={{ objectFit: "cover" }}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <ImagePlaceholder />
      )}
      <FeaturedOverlay />
      <FeaturedTextStack>
        <FeaturedDate>
          {format(parseISO(item.createdAt), "d MMMM yyyy", { locale: id })}
        </FeaturedDate>
        <FeaturedTitle>{item.title}</FeaturedTitle>
        <FeaturedExcerpt>{item.excerpt}</FeaturedExcerpt>
      </FeaturedTextStack>
    </FeaturedArticle>
  );
}

function SmallArticleCard({ item }: { item: NewsItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = !!item.coverImage && !imageFailed;

  return (
    <SmallArticle href={`/news/${item.id}`}>
      <SmallImageFrame>
        {showImage ? (
          <Image
            src={item.coverImage!}
            alt=""
            fill
            sizes="(min-width: 1280px) 200px, 45vw"
            style={{ objectFit: "cover" }}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <ImagePlaceholder />
        )}
      </SmallImageFrame>
      <SmallTextBlock>
        <SmallDate>
          {format(parseISO(item.createdAt), "d MMMM yyyy", { locale: id })}
        </SmallDate>
        <SmallTitle>{item.title}</SmallTitle>
      </SmallTextBlock>
    </SmallArticle>
  );
}

/* Divider cuma tampil di mobile (dipisah dari section sebelumnya di
 * atasnya — Figma mobile punya garis pembatas di sini, desktop tidak
 * punya elemen setara). */
const MobileDivider = styled.hr`
  width: 100%;
  height: 1px;
  border: none;
  background: #d6dcd8;
  margin: 0;

  ${media.desktop} {
    display: none;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h2`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #667a6c;
`;

const SeeAllLink = styled(Link)`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #175fe2;
`;

const CardsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 16px;
`;

const ImagePlaceholder = styled.div`
  position: absolute;
  inset: 0;
  background: #d4d4d4;
`;

const FeaturedArticle = styled(Link)`
  position: relative;
  flex: 1 1 530px;
  max-width: 530px;
  height: 204px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 20px;
  padding: 24px;
  border-radius: 8px;
  overflow: hidden;
  background: #d4d4d4;
`;

const FeaturedOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 43.25%, rgba(0, 0, 0, 0.8) 100%);
`;

const FeaturedTextStack = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FeaturedDate = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #ffffff;
`;

const FeaturedTitle = styled.h3`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  font-weight: 400;
  line-height: 16px;
  color: rgba(255, 255, 255, 0.6);
`;

/* Ukuran mobile (height241/gambar137/judul16-24) BEDA dari desktop
 * (height204/gambar100/judul14-20) — dikonfirmasi CSS Figma mobile
 * persis, kartu kecil mobile lebih tinggi & teksnya lebih besar,
 * BUKAN cuma versi diperkecil dari desktop. */
const SmallArticle = styled(Link)`
  flex: 1 1 180px;
  max-width: 260px;
  height: 241px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;

  ${media.desktop} {
    height: 204px;
  }
`;

const SmallImageFrame = styled.div`
  position: relative;
  width: 100%;
  height: 137px;
  background: #d4d4d4;

  ${media.desktop} {
    height: 100px;
  }
`;

const SmallTextBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 16px;
`;

const SmallDate = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #37433b;
`;

const SmallTitle = styled.h3`
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
