"use client";

import styled from "styled-components";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ManagedUser } from "@/types/user-management";

/** Konfirmasi hapus — persis Figma "Hapus Data" (judul, lingkaran ikon
 *  `delete-circle`, teks konfirmasi, tombol "Ya, Hapus" + "Batal"). REUSE
 *  `ui/Dialog` (bukan alert-dialog baru) supaya tidak nambah dependency
 *  `@radix-ui/react-alert-dialog`; `DialogContent` di-restyle lewat
 *  `styled()` tanpa tombol close "X" (Figma tidak punya), pola sama
 *  `UserViewDialog.tsx`. Prop `user` dipertahankan (API komponen tidak
 *  berubah) walau nama pengguna tidak ditampilkan di desain Figma. */
export function UserDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ManagedUser | null;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Card showCloseButton={false}>
        <Header>
          <Title>Hapus Data</Title>
        </Header>

        <Body>
          <IconCircle>
            <DeleteCircleIcon />
          </IconCircle>
          <Message>
            Apakah Anda yakin ingin menghapus data ini, data yang sudah dihapus tidak
            dapat dikembalikan!
          </Message>
        </Body>

        <Footer>
          <ConfirmButton type="button" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
          </ConfirmButton>
          <CancelButton
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Batal
          </CancelButton>
        </Footer>
      </Card>
    </Dialog>
  );
}

/** SVG "delete-circle" persis dari Figma (stroke `#8B9C90`). */
function DeleteCircleIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.2869 24.714L20.001 20M24.715 15.286L20.001 20M20.001 20L15.2869 15.286M20.001 20L24.715 24.714"
        stroke="#8B9C90"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 36.6673C29.2048 36.6673 36.6667 29.2054 36.6667 20.0007C36.6667 10.7959 29.2048 3.33398 20 3.33398C10.7953 3.33398 3.33337 10.7959 3.33337 20.0007C3.33337 29.2054 10.7953 36.6673 20 36.6673Z"
        stroke="#8B9C90"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
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
  background: #ffffff;
  box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.25);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
`;

const Title = styled(DialogTitle)`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
  color: #1d2520;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px;
`;

const IconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: #ecefed;
  border-radius: 50px;
`;

const Message = styled(DialogDescription)`
  max-width: 296px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
  color: #667a6c;
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

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const ConfirmButton = styled.button`
  ${buttonBase}
  border: none;
  background: #175fe2;
  color: #ffffff;
`;

const CancelButton = styled.button`
  ${buttonBase}
  background: #ffffff;
  border: 1.5px solid #8db5ff;
  color: #667a6c;
`;
