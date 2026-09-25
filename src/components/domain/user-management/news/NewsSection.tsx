"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataState } from "@/components/shared/DataState";
import { JournalIcon } from "@/components/shared/DashboardIcons";
import { useAdminNews, useDeleteNews } from "@/hooks/use-news-management";
import { media } from "@/lib/breakpoints";
import type { NewsItem } from "@/types/domain";
import { CompanyDeleteDialog } from "../companies/CompanyDeleteDialog";
import { NewsDetailDialog } from "./NewsDetailDialog";
import { NewsList } from "./NewsList";

/** Search & pagination 100% client-side (endpoint balikin semua berita),
 *  pola sama `stations/StationsSection.tsx`. */
const PAGE_SIZE = 5;

const NEW_HREF = "/user-management/news/new";

export function NewsSection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);
  const [detailTarget, setDetailTarget] = useState<NewsItem | null>(null);

  const { data, isLoading, isError, error } = useAdminNews();
  const deleteNews = useDeleteNews();

  const allNews = useMemo(() => data?.data ?? [], [data]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return allNews;
    return allNews.filter(
      (n) =>
        n.title.toLowerCase().includes(term) || n.excerpt.toLowerCase().includes(term),
    );
  }, [allNews, searchTerm]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  // Derived, BUKAN useEffect+setPage (react-hooks/set-state-in-effect).
  const effectivePage = Math.min(page, pageCount);
  const rows = useMemo(() => {
    const start = (effectivePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, effectivePage]);

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setPage(1);
  }

  function handleOpenEdit(item: NewsItem) {
    router.push(`/user-management/news/${encodeURIComponent(item.id)}/edit`);
  }

  function handleEditFromDetail(item: NewsItem) {
    setDetailTarget(null);
    handleOpenEdit(item);
  }

  function handleDeleteFromDetail(item: NewsItem) {
    setDetailTarget(null);
    setDeleteTarget(item);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteNews.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  const rangeStart = total > 0 ? (effectivePage - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(effectivePage * PAGE_SIZE, total);

  return (
    <Wrapper>
      <Header>
        <HeaderText>
          <Title>
            <JournalIcon size={32} color="#1D2520" />
            Berita
          </Title>
          <Subtitle>Kelola seluruh berita</Subtitle>
        </HeaderText>
        <AddButton asChild>
          <Link href={NEW_HREF}>
            <Plus size={16} />
            Tambah Berita
          </Link>
        </AddButton>
      </Header>

      <SearchInputWrap>
        <SearchTextInput
          placeholder="Cari Berita"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <SearchIcon />
      </SearchInputWrap>

      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={rows.length === 0}
        emptyMessage={searchTerm ? "Berita tidak ditemukan." : "Belum ada berita."}
      >
        <NewsList
          items={rows}
          onView={setDetailTarget}
          onEdit={handleOpenEdit}
          onDelete={setDeleteTarget}
        />
      </DataState>

      {total > 0 && (
        <Footer>
          <FooterLabel>
            Menampilkan{" "}
            <strong>
              {rangeStart}-{rangeEnd}
            </strong>{" "}
            dari <strong>{total}</strong> data
          </FooterLabel>
          <ArrowGroup>
            <ArrowButton
              type="button"
              aria-label="Halaman sebelumnya"
              disabled={effectivePage <= 1}
              onClick={() => setPage(effectivePage - 1)}
            >
              <ChevronLeft size={18} />
            </ArrowButton>
            <ArrowButton
              type="button"
              aria-label="Halaman berikutnya"
              disabled={effectivePage >= pageCount}
              onClick={() => setPage(effectivePage + 1)}
            >
              <ChevronRight size={18} />
            </ArrowButton>
          </ArrowGroup>
        </Footer>
      )}

      <CompanyDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteNews.isPending}
      />

      <NewsDetailDialog
        open={!!detailTarget}
        onOpenChange={(open) => !open && setDetailTarget(null)}
        item={detailTarget}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
      />
    </Wrapper>
  );
}

function SearchIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path d="M17 17L21 21" stroke="#8B9C90" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z"
        stroke="#8B9C90"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${media.desktop} {
    gap: 12px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 16px;
  gap: 12px;

  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 16px;

  ${media.desktop} {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    gap: 4px;
  }
`;

/** Mobile: full-width 48px (Figma). Desktop: 190x48. */
const AddButton = styled(Button)`
  width: 100%;
  height: 48px;
  padding: 14px 20px;
  font-size: 16px;
  line-height: 20px;

  ${media.desktop} {
    width: 190px;
  }
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-heading), sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
  color: #1d2520;
`;

const Subtitle = styled.p`
  margin: 0;
  font-family: var(--font-body), sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #667a6c;
`;

const SearchInputWrap = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  width: 100%;
  height: 48px;
  background: #ffffff;
  border: 1.5px solid #d6dcd8;
  border-radius: 12px;
`;

const SearchTextInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #1d2520;

  &::placeholder {
    color: #8b9c90;
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;

  ${media.desktop} {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
`;

const ArrowGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const FooterLabel = styled.span`
  font-family: var(--font-caption), sans-serif;
  font-size: 12px;
  color: #6d717f;

  strong {
    font-weight: 600;
    color: #1d2520;
  }
`;

const ArrowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  padding: 0;
  color: #6d717f;
  cursor: pointer;

  &:disabled {
    color: #d2d5db;
    cursor: default;
    pointer-events: none;
  }
`;
