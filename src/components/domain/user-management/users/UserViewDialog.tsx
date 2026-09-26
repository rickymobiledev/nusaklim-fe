"use client";

import styled from "styled-components";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { ManagedUser } from "@/types/user-management";

/** Kartu "Detail Pengguna" — persis Figma (header biru + avatar/nama/email,
 *  badan putih 3 baris field, footer tombol Edit/Hapus). Bukan lagi
 *  dialog generik `DialogHeader`/`DialogTitle`/teks-only — restyle total
 *  `DialogContent` via `styled()` (pola "wrap primitif ui/** dengan
 *  styled()" CLAUDE.md), TANPA tombol close "X" (Figma tidak punya) —
 *  tutup lewat klik di luar/Escape, atau lewat tombol Edit/Hapus yang
 *  otomatis menutup dialog ini (lihat `UsersSection.tsx`). */
export function UserViewDialog({
  open,
  onOpenChange,
  user,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ManagedUser | null;
  onEdit: (user: ManagedUser) => void;
  onDelete: (user: ManagedUser) => void;
}) {
  console.log(user);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Card showCloseButton={false}>
        {user && (
          <>
            <Header>
              <AvatarCircle>
                <PhotoPlaceholderIcon />
              </AvatarCircle>
              <Name>{user.name}</Name>
              <EmailRow>
                <MailIcon />
                <Email>{user.email}</Email>
              </EmailRow>
            </Header>

            <Body>
              <DetailRow>
                <DetailLabel>Nama Pengguna</DetailLabel>
                <DetailValue>{user.username}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Peran</DetailLabel>
                <DetailValue>{user.role.name}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Perusahaan</DetailLabel>
                <DetailValue $fill>{user.company.name}</DetailValue>
              </DetailRow>
            </Body>

            <Footer>
              <EditButton type="button" onClick={() => onEdit(user)}>
                Edit
              </EditButton>
              <DeleteButton type="button" onClick={() => onDelete(user)}>
                Hapus
              </DeleteButton>
            </Footer>
          </>
        )}
      </Card>
    </Dialog>
  );
}

/** Sama persis SVG "media-image" di `UsersList.tsx` (avatar placeholder
 *  generik) — diduplikasi di sini, bukan diekstrak jadi shared, pola
 *  sama file-file lain di domain ini (tiap komponen icon inline sendiri). */
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

/** Sama SVG "mail" di `UsersList.tsx` tapi stroke PUTIH — dipakai di atas
 *  header biru, bukan di atas kartu putih. */
function MailIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 9L12 12.5L17 9"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17V7C2 5.89543 2.89543 5 4 5H20C21.1046 5 22 5.89543 22 7V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17Z"
        stroke="#FFFFFF"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const Card = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  width: 400px;
  max-width: calc(100% - 2rem);
  padding: 0;
  gap: 0;
  border: none;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.25);
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #175fe2;
`;

const AvatarCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: #eff5ff;
  border-radius: 50px;
`;

const Name = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
  color: #ffffff;
`;

const EmailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: -12px;
`;

const Email = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #ffffff;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`;

const DetailLabel = styled.span`
  flex-shrink: 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #667a6c;
`;

const DetailValue = styled.span<{ $fill?: boolean }>`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #1d2520;
  ${(p) =>
    p.$fill &&
    `
    flex: 1;
    min-width: 0;
    text-align: right;
  `}
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px;
`;

const buttonBase = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border-radius: 12px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  cursor: pointer;
`;

const EditButton = styled.button`
  ${buttonBase}
  border: none;
  background: #175fe2;
  color: #ffffff;
`;

const DeleteButton = styled.button`
  ${buttonBase}
  background: #ffffff;
  border: 1.5px solid #8db5ff;
  color: #667a6c;
`;
