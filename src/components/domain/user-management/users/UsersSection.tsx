"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataState } from "@/components/shared/DataState";
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/use-users";
import { useCompanies } from "@/hooks/use-companies";
import { useUserRoles } from "@/hooks/use-user-roles";
import { UsersList } from "./UsersList";
import { UserFormDialog } from "./UserFormDialog";
import { UserDeleteDialog } from "./UserDeleteDialog";
import { UserViewDialog } from "./UserViewDialog";
import { media } from "@/lib/breakpoints";
import type {
  CreateUserInput,
  ManagedUser,
  UpdateUserInput,
} from "@/types/user-management";

/** `/api/user-management/users` balikin SEMUA pengguna sekaligus (BE
 *  tidak punya pagination) — search & pagination 100% client-side, pola
 *  sama `DownloadDataSection.tsx`. `PAGE_SIZE` = 5 (persis contoh Figma
 *  "Menampilkan 1-5 dari 15 data"). */
const PAGE_SIZE = 5;

export function UsersSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [activeUser, setActiveUser] = useState<ManagedUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null);
  const [viewTarget, setViewTarget] = useState<ManagedUser | null>(null);

  const { data, isLoading, isError, error } = useUsers();
  const { data: companiesData } = useCompanies();
  const { data: rolesData } = useUserRoles();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const allUsers = useMemo(() => data?.data ?? [], [data]);
  const companies = companiesData?.data ?? [];
  const roles = rolesData?.data ?? [];

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return allUsers;
    return allUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term),
    );
  }, [allUsers, searchTerm]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  // Derived, BUKAN useEffect+setPage (react-hooks/set-state-in-effect) —
  // jaga-jaga kalau search menyusutkan total di bawah halaman aktif.
  const effectivePage = Math.min(page, pageCount);
  const rows = useMemo(() => {
    const start = (effectivePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, effectivePage]);

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setPage(1);
  }

  function handleOpenCreate() {
    setFormMode("create");
    setActiveUser(null);
    setFormOpen(true);
  }

  function handleOpenEdit(user: ManagedUser) {
    setFormMode("edit");
    setActiveUser(user);
    setFormOpen(true);
  }

  function handleOpenView(user: ManagedUser) {
    setViewTarget(user);
  }

  function handleEditFromView(user: ManagedUser) {
    setViewTarget(null);
    handleOpenEdit(user);
  }

  function handleDeleteFromView(user: ManagedUser) {
    setViewTarget(null);
    setDeleteTarget(user);
  }

  function handleSubmitCreate(values: CreateUserInput) {
    createUser.mutate(values, { onSuccess: () => setFormOpen(false) });
  }

  function handleSubmitEdit(values: UpdateUserInput) {
    updateUser.mutate(values, { onSuccess: () => setFormOpen(false) });
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
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.66669 26.6667V25.3333C6.66669 20.1787 10.8454 16 16 16C21.1547 16 25.3334 20.1787 25.3334 25.3333V26.6667"
                stroke="#1D2520"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 15.9997C18.9455 15.9997 21.3334 13.6119 21.3334 10.6663C21.3334 7.72082 18.9455 5.33301 16 5.33301C13.0545 5.33301 10.6667 7.72082 10.6667 10.6663C10.6667 13.6119 13.0545 15.9997 16 15.9997Z"
                stroke="#1D2520"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Pengguna
          </Title>
          <Subtitle>Kelola seluruh akun pengguna</Subtitle>
        </HeaderText>
        <AddButton type="button" onClick={handleOpenCreate}>
          <Plus size={16} />
          Tambah Pengguna
        </AddButton>
      </Header>

      <SearchInputWrap>
        <SearchTextInput
          placeholder="Cari Pengguna"
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
        emptyMessage={searchTerm ? "Pengguna tidak ditemukan." : "Belum ada pengguna."}
      >
        <UsersList
          users={rows}
          onView={handleOpenView}
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

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        user={activeUser}
        companies={companies}
        roles={roles}
        onSubmitCreate={handleSubmitCreate}
        onSubmitEdit={handleSubmitEdit}
        isSubmitting={createUser.isPending || updateUser.isPending}
      />

      <UserDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        user={deleteTarget}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteUser.isPending}
      />

      <UserViewDialog
        open={!!viewTarget}
        onOpenChange={(open) => !open && setViewTarget(null)}
        user={viewTarget}
        onEdit={handleEditFromView}
        onDelete={handleDeleteFromView}
      />
    </Wrapper>
  );
}

/** Icon trailing search box "Cari Pengguna" — persis SVG "search" Figma
 *  (dekoratif, bukan tombol), pola sama icon inline lain di domain ini
 *  (mis. `MailIcon`/`MoreVertIcon` di `UsersList.tsx`). */
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
