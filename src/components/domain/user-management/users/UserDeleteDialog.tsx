"use client";

import styled from "styled-components";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ManagedUser } from "@/types/user-management";

/** Konfirmasi hapus REUSE `ui/Dialog` (bukan alert-dialog baru) — supaya
 *  tidak nambah dependency `@radix-ui/react-alert-dialog` yang belum ada
 *  di `package.json` cuma untuk satu dialog konfirmasi. */
export function UserDeleteDialog({
  open,
  onOpenChange,
  user,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Pengguna</DialogTitle>
          <DialogDescription>
            Yakin ingin menghapus pengguna <Bold>{user?.name}</Bold>? Tindakan ini tidak
            bisa dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const Bold = styled.span`
  font-weight: 700;
  color: #1d2520;
`;
