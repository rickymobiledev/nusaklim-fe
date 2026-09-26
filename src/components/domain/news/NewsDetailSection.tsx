"use client";

import { useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { usePublicNewsDetail } from "@/hooks/use-news-detail";
import { DataState } from "@/components/shared/DataState";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { NewsHtml } from "@/components/domain/user-management/news/NewsContent";
import { media } from "@/lib/breakpoints";

/** Halaman baca satu berita (`/news/[id]`), sesuai Figma: cover kartu
 *  sendiri (radius16) + kartu putih teks (tanggal, judul, isi) di kolom
 *  tengah ±800px. Crumb terakhir breadcrumb = judul berita. `content`
 *  HTML disanitasi oleh `NewsHtml`. */
export function NewsDetailSection({ newsId }: { newsId: string }) {
  const { data, isLoading, isError, error } = usePublicNewsDetail(newsId);
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = !!data?.coverImage && !imageFailed;

  return (
    <>
      <Breadcrumb currentLabel={data?.title} />
      <MobileTitle>Berita Pilihan</MobileTitle>
      <DataState isLoading={isLoading} isError={isError} error={error} isEmpty={!data}>
        {data && (
          <Column>
            <CoverCard>
              {showImage && (
                <Image
                  src={data.coverImage!}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1280px) 801px, 100vw"
                  style={{ objectFit: "cover" }}
                  onError={() => setImageFailed(true)}
                />
              )}
              <Overlay />
            </CoverCard>
            <TextCard>
              <DateText>
                {format(parseISO(data.createdAt), "d MMMM yyyy", { locale: idLocale })}
              </DateText>
              <Title>{data.title}</Title>
              <Content html={data.content} />
            </TextCard>
          </Column>
        )}
      </DataState>
    </>
  );
}

/* Judul "Berita Pilihan" cuma ada di Figma mobile. */
const MobileTitle = styled.h1`
  font-family: var(--font-heading), sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  color: #000000;

  ${media.desktop} {
    display: none;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const CoverCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 801px;
  height: 165px;
  overflow: hidden;
  border-radius: 16px;
  background: #d4d4d4;

  ${media.desktop} {
    height: 410px;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 43.25%, rgba(0, 0, 0, 0.8) 100%);
`;

const TextCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 800px;
  padding: 24px;
  border-radius: 16px;
  background: #ffffff;
`;

const DateText = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  line-height: 16px;
  color: #667a6c;
`;

const Title = styled.h1`
  margin-top: -8px;
  font-family: var(--font-heading), sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  color: #000000;
`;

/* Figma: isi 16/24 hitam, sub-judul 16/24 bold, jarak antar blok 16px —
 * menimpa gaya `newsContentStyles` default (14/20) khusus halaman baca. */
const Content = styled(NewsHtml)`
  font-size: 16px;
  line-height: 24px;
  color: #000000;

  > * + * {
    margin-top: 16px;
  }

  h1,
  h2,
  h3 {
    font-family: var(--font-plus-jakarta-sans), sans-serif;
    font-size: 16px;
    line-height: 24px;
  }
`;
