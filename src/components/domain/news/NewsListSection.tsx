"use client";

import { useState } from "react";
import styled from "styled-components";
import { useNews } from "@/hooks/use-news";
import { DataState } from "@/components/shared/DataState";
import { media } from "@/lib/breakpoints";
import { NewsArticleCard, NewsFeaturedCard } from "./NewsArticleCards";
import { NewsPagination } from "./NewsPagination";

/** 1 kartu utama + 1 kartu di baris pertama, lalu 2 baris × 3 kartu (Figma). */
const PAGE_SIZE = 8;

/** Daftar "Berita Pilihan" penuh. `GET /news` belum mendukung paginasi,
 *  jadi seluruh berita di-fetch sekali dan dipotong di client (pola
 *  `NewsSection` admin). Item pertama TIAP halaman jadi kartu utama. */
export function NewsListSection() {
  const { data, isLoading, isError, error } = useNews();
  const [page, setPage] = useState(1);

  const items = data ?? [];
  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const effectivePage = Math.min(page, pageCount);
  const pageItems = items.slice(
    (effectivePage - 1) * PAGE_SIZE,
    effectivePage * PAGE_SIZE,
  );
  const [featured, second, ...rest] = pageItems;

  return (
    <DataState
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={items.length === 0}
      emptyMessage="Belum ada berita."
    >
      <List>
        <TopRow>
          {featured && <NewsFeaturedCard item={featured} />}
          {second && (
            <SecondSlot>
              <NewsArticleCard item={second} />
            </SecondSlot>
          )}
        </TopRow>
        {rest.length > 0 && (
          <Grid>
            {rest.map((item) => (
              <NewsArticleCard key={item.id} item={item} />
            ))}
          </Grid>
        )}
        <NewsPagination
          page={effectivePage}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      </List>
    </DataState>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TopRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${media.desktop} {
    flex-direction: row;
    align-items: stretch;
  }
`;

const SecondSlot = styled.div`
  display: flex;
  flex-direction: column;

  ${media.desktop} {
    flex: 1 1 0;
  }

  > a {
    flex: 1;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  ${media.desktop} {
    grid-template-columns: repeat(3, 1fr);
  }
`;
