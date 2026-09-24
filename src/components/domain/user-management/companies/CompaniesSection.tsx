"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { Building2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataState } from "@/components/shared/DataState";
import { useCompanies, useDeleteCompany } from "@/hooks/use-companies";
import { CompaniesGrid } from "./CompaniesGrid";
import { CompanyDeleteDialog } from "./CompanyDeleteDialog";
import { CompanyDetailDialog } from "./CompanyDetailDialog";
import { media } from "@/lib/breakpoints";
import type { Company } from "@/types/user-management";

/** Search & pagination 100% client-side (endpoint balikin semua data),
 *  pola sama `aghris-users/AghrisUsersSection.tsx`. 9 = 3 kolom x 3 baris. */
const PAGE_SIZE = 9;

const NEW_HREF = "/user-management/companies/new";

export function CompaniesSection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);
  const [detailTarget, setDetailTarget] = useState<Company | null>(null);

  const { data, isLoading, isError, error } = useCompanies();
  const deleteCompany = useDeleteCompany();

  const allCompanies = useMemo(() => data?.data ?? [], [data]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return allCompanies;
    return allCompanies.filter(
      (c) => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term),
    );
  }, [allCompanies, searchTerm]);

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

  function handleOpenEdit(company: Company) {
    router.push(`/user-management/companies/${company.id}/edit`);
  }

  function handleEditFromDetail(company: Company) {
    setDetailTarget(null);
    handleOpenEdit(company);
  }

  function handleDeleteFromDetail(company: Company) {
    setDetailTarget(null);
    setDeleteTarget(company);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteCompany.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  const rangeStart = total > 0 ? (effectivePage - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(effectivePage * PAGE_SIZE, total);

  return (
    <Wrapper>
      <Header>
        <HeaderText>
          <Title>
            <Building2 size={32} strokeWidth={1.5} />
            Perusahaan
          </Title>
          <Subtitle>Kelola seluruh data perusahaan yang teregistrasi</Subtitle>
        </HeaderText>
        <AddButton asChild>
          <Link href={NEW_HREF}>
            <Plus size={16} />
            Tambah Perusahaan
          </Link>
        </AddButton>
      </Header>

      <SearchInputWrap>
        <SearchTextInput
          placeholder="Cari Perusahaan"
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
        emptyMessage={
          searchTerm ? "Perusahaan tidak ditemukan." : "Belum ada perusahaan."
        }
      >
        <CompaniesGrid
          companies={rows}
          onView={setDetailTarget}
          onEdit={handleOpenEdit}
          onDelete={setDeleteTarget}
        />
      </DataState>

      {total > 0 && (
        <Footer>
          <FooterLabel>
            Menampilkan {rangeStart}-{rangeEnd} dari {total} data
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
        isDeleting={deleteCompany.isPending}
      />

      <CompanyDetailDialog
        open={!!detailTarget}
        onOpenChange={(open) => !open && setDetailTarget(null)}
        company={detailTarget}
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
    gap: 8px;
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

/** Mobile: full-width 48px (Figma). Desktop: ukuran `Button` default. */
const AddButton = styled(Button)`
  width: 100%;
  height: 48px;
  padding: 14px 20px;
  font-size: 16px;
  line-height: 20px;

  ${media.desktop} {
    width: auto;
    height: 36px;
    padding: 8px 16px;
    font-size: 14px;
    line-height: 20px;
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
    justify-content: flex-end;
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
