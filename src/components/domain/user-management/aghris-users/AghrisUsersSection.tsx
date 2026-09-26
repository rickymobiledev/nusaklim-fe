"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataState } from "@/components/shared/DataState";
import { useAghrisUsers, useDeleteAghrisUser } from "@/hooks/use-aghris-users";
import { AghrisUsersList } from "./AghrisUsersList";
import { AghrisUserDeleteDialog } from "./AghrisUserDeleteDialog";
import { AghrisUserViewDialog } from "./AghrisUserViewDialog";
import { media } from "@/lib/breakpoints";
import type { AghrisUser } from "@/types/user-management";

/** Search & pagination 100% client-side (endpoint balikin semua data),
 *  pola sama `users/UsersSection.tsx`. */
const PAGE_SIZE = 5;

const NEW_HREF = "/user-management/aghris-users/new";

export function AghrisUsersSection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AghrisUser | null>(null);
  const [viewTarget, setViewTarget] = useState<AghrisUser | null>(null);

  const { data, isLoading, isError, error } = useAghrisUsers();
  const deleteUser = useDeleteAghrisUser();

  const allUsers = useMemo(() => data?.data ?? [], [data]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return allUsers;
    return allUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.nipSap.toLowerCase().includes(term) ||
        u.roleName.toLowerCase().includes(term) ||
        u.companyName.toLowerCase().includes(term),
    );
  }, [allUsers, searchTerm]);

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

  function handleOpenEdit(user: AghrisUser) {
    router.push(`/user-management/aghris-users/${user.id}/edit`);
  }

  function handleEditFromView(user: AghrisUser) {
    setViewTarget(null);
    handleOpenEdit(user);
  }

  function handleDeleteFromView(user: AghrisUser) {
    setViewTarget(null);
    setDeleteTarget(user);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteUser.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }

  const rangeStart = total > 0 ? (effectivePage - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(effectivePage * PAGE_SIZE, total);

  return (
    <Wrapper>
      <Header>
        <HeaderText>
          <Title>
            <TitleIcon />
            Pengguna Aghris
          </Title>
          <Subtitle>Kelola seluruh akun pengguna aghris</Subtitle>
        </HeaderText>
        <AddButton asChild>
          <Link href={NEW_HREF}>
            <Plus size={16} />
            Tambah Pengguna Aghris
          </Link>
        </AddButton>
      </Header>

      <SearchInputWrap>
        <SearchTextInput
          placeholder="Cari Pengguna Aghris"
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
          searchTerm ? "Pengguna Aghris tidak ditemukan." : "Belum ada pengguna Aghris."
        }
      >
        <AghrisUsersList
          users={rows}
          onView={setViewTarget}
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

      <AghrisUserDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteUser.isPending}
      />

      <AghrisUserViewDialog
        open={!!viewTarget}
        onOpenChange={(open) => !open && setViewTarget(null)}
        user={viewTarget}
        onEdit={handleEditFromView}
        onDelete={handleDeleteFromView}
      />
    </Wrapper>
  );
}

/** Icon judul "user-cog" Figma (orang + gembok kecil) — pendekatan
 *  dengan path sederhana, dekoratif. */
function TitleIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 26.6667V25.3333C4 20.1787 8.17868 16 13.3333 16C14.5 16 15.6 16.2 16.6 16.55"
        stroke="#1D2520"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 16C16.2789 16 18.6667 13.6122 18.6667 10.6667C18.6667 7.72115 16.2789 5.33334 13.3333 5.33334C10.3878 5.33334 8 7.72115 8 10.6667C8 13.6122 10.3878 16 13.3333 16Z"
        stroke="#1D2520"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="20"
        y="21"
        width="8"
        height="6"
        rx="1"
        stroke="#1D2520"
        strokeWidth="1.5"
      />
      <path
        d="M22 21V19.5C22 18.4 22.9 17.5 24 17.5C25.1 17.5 26 18.4 26 19.5V21"
        stroke="#1D2520"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
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
