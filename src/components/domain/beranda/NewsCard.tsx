"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowRightIcon } from "lucide-react";
import { useNews } from "@/hooks/use-news";
import { DataState } from "@/components/shared/DataState";
import { SkeletonBlock } from "@/components/shared/SkeletonBlock";
import { JournalIcon } from "@/components/shared/DashboardIcons";
import { media } from "@/lib/breakpoints";
import type { NewsItem } from "@/types/domain";

/** 1 kartu featured + sampai 4 kartu kecil (lihat `slice(0, 5)` di `NewsCard`). */
const NEWS_SKELETON_SMALL_CARDS = 4;

/** "Berita Pilihan" — card ringkas di Beranda, sampai 5 berita terbaru
 *  dari `GET /news/published` via `useNews()`. 1 kartu \"featured\" besar
 *  (gambar + overlay gradasi, teks putih) + 4 kartu kecil. Featured sudah
 *  di-sort ke depan oleh `compareNews` di `news-client.ts`. \"Lihat Semua\"
 *  → `/news` (daftar penuh), tiap kartu → `/news/[id]` (detail).
 *
 *  Struktur mengikuti CSS Figma persis (bukan approksimasi lagi): 1
 *  kartu \"featured\" besar (gambar + overlay gradasi, teks putih) + kartu
 *  kecil (bg putih polos, thumbnail tanpa overlay, tanggal + judul +
 *  ringkasan + tombol \"Baca Selengkapnya\" di SEMUA breakpoint). Tombol
 *  kartu featured DESKTOP-ONLY (Figma mobile featured memang tanpa tombol).
 *  Desktop: kartu tinggi 269px; mobile: featured 200px, kartu kecil 314px
 *  dalam grid 2 kolom gap 12px.
 *  BEDA dari kebanyakan card Beranda lain: `Section` (wrapper terluar)
 *  SENGAJA tanpa background/border/padding — Figma (\"Frame 3\") menaruh
 *  section ini polos di atas background halaman, radius cuma ada di tiap
 *  kartu artikel individual. */
export function NewsCard() {
  const { data, isLoading, isError, error } = useNews();
  /** Ambil maksimal 5 item — featured di depan (sudah disortir BE+client),
   *  sisanya 4 kartu kecil (Figma desktop & mobile). */
  const items = (data ?? []).slice(0, 5);
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

        {isLoading ? (
          <CardsRow>
            <FeaturedSkeleton />
            {Array.from({ length: NEWS_SKELETON_SMALL_CARDS }, (_, i) => (
              <SmallSkeleton key={i} />
            ))}
          </CardsRow>
        ) : (
          <DataState
            isLoading={false}
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
        )}
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
        <FeaturedReadMore>
          Baca Selengkapnya
          <ArrowRightIcon size={20} />
        </FeaturedReadMore>
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
        <SmallExcerpt>{item.excerpt}</SmallExcerpt>
        <SmallReadMore>
          Baca Selengkapnya
          <ArrowRightIcon size={20} />
        </SmallReadMore>
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

/* Mobile: "Lihat Semua" di ujung kanan (space-between); desktop: menempel
 * di sebelah judul (gap 16px) — sesuai Frame 12 Figma masing-masing. */
const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  ${media.desktop} {
    justify-content: flex-start;
    gap: 16px;
  }
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
  font-weight: 500;
  line-height: 16px;
  color: #175fe2;
`;

/* Mobile = grid 2 kolom gap 12px (Figma: 192.5px @397px). Desktop = flex-wrap
 * gap 16px: featured 530px tetap + kartu kecil mengisi sisa lebar. */
const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  gap: 12px;

  ${media.desktop} {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
`;

/* Ukuran sama dengan `FeaturedArticle`/`SmallArticle` supaya section tidak
 * melompat saat berita datang. */
const FeaturedSkeleton = styled(SkeletonBlock)`
  grid-column: 1 / -1;
  width: auto;
  height: 200px;
  margin-bottom: 4px;
  border-radius: 8px;

  ${media.desktop} {
    flex: 0 0 530px;
    height: 269px;
    margin-bottom: 0;
  }
`;

const SmallSkeleton = styled(SkeletonBlock)`
  width: auto;
  max-width: none;
  height: 314px;
  border-radius: 8px;

  ${media.desktop} {
    flex: 1 1 0;
    min-width: 0;
    height: 269px;
  }
`;

const ImagePlaceholder = styled.div`
  position: absolute;
  inset: 0;
  background: #d4d4d4;
`;

const FeaturedArticle = styled(Link)`
  position: relative;
  grid-column: 1 / -1;
  height: 200px;
  margin-bottom: 4px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 20px;
  padding: 24px;
  border-radius: 8px;
  overflow: hidden;
  background: #d4d4d4;

  ${media.desktop} {
    flex: 0 0 530px;
    height: 269px;
    margin-bottom: 0;
  }
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

const ReadMore = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
`;

/* Figma mobile: featured tanpa tombol, tombol hanya di desktop. */
const FeaturedReadMore = styled(ReadMore)`
  display: none;
  color: #ffffff;

  ${media.desktop} {
    display: inline-flex;
  }
`;

const SmallReadMore = styled(ReadMore)`
  color: #175fe2;
`;

/* Ukuran mobile (height314/gambar137/judul16-24) BEDA dari desktop
 * (height269/gambar100/judul14-20) — dikonfirmasi CSS Figma mobile
 * persis, kartu kecil mobile lebih tinggi & teksnya lebih besar,
 * BUKAN cuma versi diperkecil dari desktop. */
const SmallArticle = styled(Link)`
  height: 314px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;

  ${media.desktop} {
    min-width: 0;
    flex: 1 1 0;
    height: 269px;
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
  justify-content: flex-start;
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

const SmallExcerpt = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #667a6c;
`;
