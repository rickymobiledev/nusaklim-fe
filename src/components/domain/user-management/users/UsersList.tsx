"use client";

import styled from "styled-components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ManagedUser } from "@/types/user-management";

export function UsersList({
  users,
  onView,
  onEdit,
  onDelete,
}: {
  users: ManagedUser[];
  onView: (user: ManagedUser) => void;
  onEdit: (user: ManagedUser) => void;
  onDelete: (user: ManagedUser) => void;
}) {
  return (
    <List>
      {users.map((user) => (
        <Row key={user.id}>
          <FieldsGroup>
            <Identity>
              <AvatarCircle>
                <PhotoPlaceholderIcon />
              </AvatarCircle>
              <IdentityText>
                <Name>{user.name}</Name>
                <EmailRow>
                  <MailIcon />
                  <Email>{user.email}</Email>
                </EmailRow>
              </IdentityText>
            </Identity>

            <FieldCol>
              <FieldLabel>Nama Pengguna</FieldLabel>
              <FieldValue>{user.username}</FieldValue>
            </FieldCol>

            <FieldCol>
              <FieldLabel>Peran</FieldLabel>
              <FieldValue>{user.role.name}</FieldValue>
            </FieldCol>

            <FieldCol>
              <FieldLabel>Perusahaan</FieldLabel>
              <FieldValue>{user.company.name}</FieldValue>
            </FieldCol>
          </FieldsGroup>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ActionButton type="button" aria-label={`Aksi untuk ${user.name}`}>
                <MoreVertIcon />
              </ActionButton>
            </DropdownMenuTrigger>
            <MenuContent align="end">
              <MenuItem onSelect={() => onView(user)}>
                <EyeIcon />
                Lihat
              </MenuItem>
              <MenuItem onSelect={() => onEdit(user)}>
                <PencilIcon />
                Ubah Data
              </MenuItem>
              <MenuItem variant="destructive" onSelect={() => onDelete(user)}>
                <TrashIcon />
                Hapus Data
              </MenuItem>
            </MenuContent>
          </DropdownMenu>
        </Row>
      ))}
    </List>
  );
}

/** Placeholder avatar generik (bukan foto/inisial user) — persis desain
 *  Figma "media-image", dipakai sama untuk SEMUA user (data asli backend
 *  juga selalu balikin `image_url` default `user.png` yang sama untuk
 *  tiap user, tidak ada foto per-user beneran). */
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
        stroke="#175FE2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17V7C2 5.89543 2.89543 5 4 5H20C21.1046 5 22 5.89543 22 7V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17Z"
        stroke="#175FE2"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function MoreVertIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 12.5C12.2761 12.5 12.5 12.2761 12.5 12C12.5 11.7239 12.2761 11.5 12 11.5C11.7239 11.5 11.5 11.7239 11.5 12C11.5 12.2761 11.7239 12.5 12 12.5Z"
        fill="#1D2520"
        stroke="#1D2520"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 18.5C12.2761 18.5 12.5 18.2761 12.5 18C12.5 17.7239 12.2761 17.5 12 17.5C11.7239 17.5 11.5 17.7239 11.5 18C11.5 18.2761 11.7239 18.5 12 18.5Z"
        fill="#1D2520"
        stroke="#1D2520"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6.5C12.2761 6.5 12.5 6.27614 12.5 6C12.5 5.72386 12.2761 5.5 12 5.5C11.7239 5.5 11.5 5.72386 11.5 6C11.5 6.27614 11.7239 6.5 12 6.5Z"
        fill="#1D2520"
        stroke="#1D2520"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 3 icon "Menu Option" (dropdown aksi ⋮) — persis SVG Figma, warna
 *  `#455249` seragam untuk semua item TERMASUK "Hapus Data" (Figma tidak
 *  mewarnai merah, cuma beda icon) — `variant="destructive"` di `MenuItem`
 *  Hapus tetap dipakai untuk hint warna merah saat hover/focus saja. */
function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 11.6663C10.9205 11.6663 11.6667 10.9201 11.6667 9.99967C11.6667 9.0792 10.9205 8.33301 10 8.33301C9.07957 8.33301 8.33337 9.0792 8.33337 9.99967C8.33337 10.9201 9.07957 11.6663 10 11.6663Z"
        stroke="#455249"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 10C15.9262 12.4925 13.0986 15 10 15C6.90141 15 4.0738 12.4925 2.5 10C4.41546 7.63187 6.65969 5 10 5C13.3403 5 15.5846 7.63183 17.5 10Z"
        stroke="#1D2520"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.9693 4.70931L12.9669 3.71169C13.7479 2.93064 15.0143 2.93064 15.7953 3.71169L16.5024 4.41879C17.2835 5.19984 17.2835 6.46617 16.5024 7.24722L15.5048 8.24484M11.9693 4.70931L4.04188 12.6367C3.7098 12.9688 3.50518 13.4071 3.46385 13.8749L3.29028 15.8397C3.23551 16.4597 3.75439 16.9786 4.3744 16.9238L6.33919 16.7502C6.807 16.7089 7.24534 16.5043 7.57741 16.1722L15.5048 8.24484M11.9693 4.70931L15.5048 8.24484"
        stroke="#455249"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.6667 7.5L15.0042 16.9552C14.8641 17.7522 14.1719 18.3333 13.3628 18.3333H6.63732C5.8282 18.3333 5.13596 17.7522 4.99584 16.9552L3.33337 7.5"
        stroke="#455249"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 5.00033H12.8125M2.5 5.00033H7.1875M7.1875 5.00033V3.33366C7.1875 2.41318 7.93369 1.66699 8.85417 1.66699H11.1458C12.0663 1.66699 12.8125 2.41318 12.8125 3.33366V5.00033M7.1875 5.00033H12.8125"
        stroke="#455249"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 16px 24px;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 16px;
`;

const FieldsGroup = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px 40px;
  min-width: 0;
`;

const Identity = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 2;
  min-width: 220px;
`;

const AvatarCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  background: #eff5ff;
  border-radius: 50px;
`;

const IdentityText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const Name = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #1d2520;
`;

const EmailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Email = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #1d2520;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FieldCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 140px;
`;

const FieldLabel = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #667a6c;
`;

const FieldValue = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #1d2520;
`;

const ActionButton = styled.button`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border: 1px solid #d6dcd8;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;

  &:hover {
    background: #f6f8f7;
  }
`;

/** Wrap primitif `ui/dropdown-menu` — pola "compose primitif ui/** dengan
 *  styled()" sesuai CLAUDE.md, bukan className Tailwind kondisional. */
const MenuContent = styled(DropdownMenuContent)`
  display: flex;
  flex-direction: column;
  min-width: 218px;
  padding: 16px;
  gap: 0;
  border: none;
  border-radius: 16px;
  box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.25);
`;

const MenuItem = styled(DropdownMenuItem)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 12px;
  border-radius: 50px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #455249;
`;
