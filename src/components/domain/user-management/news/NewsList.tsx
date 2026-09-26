"use client";

import { useState } from "react";
import styled, { css } from "styled-components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { media } from "@/lib/breakpoints";
import type { NewsItem } from "@/types/domain";
import { EyeIcon, MoreVertIcon, PencilIcon, TrashIcon } from "../companies/CompaniesGrid";
import { NewsCover, formatNewsDate } from "./NewsCover";

// ─── Icon helpers ─────────────────────────────────────────────────────────────

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  );
}

function FileEditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

// ─── Confirmation dialog ───────────────────────────────────────────────────────

type ConfirmAction =
  | { type: "set-featured"; item: NewsItem; isFeatured: boolean }
  | { type: "set-status"; item: NewsItem; status: "draft" | "published" | "archived" }
  | { type: "delete"; item: NewsItem };

function actionLabel(action: ConfirmAction): string {
  if (action.type === "set-featured") {
    return action.isFeatured
      ? `Set "${action.item.title}" sebagai Featured?`
      : `Hapus status Featured dari "${action.item.title}"?`;
  }
  if (action.type === "set-status") {
    const map = { draft: "Draft", published: "Published", archived: "Archived" };
    return `Set status "${action.item.title}" menjadi ${map[action.status]}?`;
  }
  return `Hapus "${action.item.title}"?`;
}

function actionBody(action: ConfirmAction): string {
  if (action.type === "delete")
    return "Data yang sudah dihapus tidak dapat dikembalikan!";
  return "Perubahan ini akan segera diterapkan dan mempengaruhi tampilan berita.";
}

function ConfirmDialog({
  action,
  isPending,
  onConfirm,
  onCancel,
}: {
  action: ConfirmAction | null;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={!!action} onOpenChange={(open) => !open && onCancel()}>
      <ConfirmCard showCloseButton={false}>
        <ConfirmHeader>
          <ConfirmTitle>Konfirmasi Aksi</ConfirmTitle>
        </ConfirmHeader>
        <ConfirmBody>
          <ConfirmMessage>{action ? actionLabel(action) : ""}</ConfirmMessage>
          <ConfirmSub>{action ? actionBody(action) : ""}</ConfirmSub>
        </ConfirmBody>
        <ConfirmFooter>
          <ConfirmOk
            type="button"
            $destructive={action?.type === "delete"}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Memproses..." : "Ya, Lanjutkan"}
          </ConfirmOk>
          <ConfirmCancel type="button" onClick={onCancel} disabled={isPending}>
            Batal
          </ConfirmCancel>
        </ConfirmFooter>
      </ConfirmCard>
    </Dialog>
  );
}

// ─── Status badge ──────────────────────────────────────────────────────────────

type NewsStatus = "published" | "archived" | "draft" | string;

function StatusBadge({ status }: { status: NewsStatus }) {
  return <Badge $status={status}>{status}</Badge>;
}

// ─── Main list component ───────────────────────────────────────────────────────

export function NewsList({
  items,
  onView,
  onEdit,
  onDelete,
  onSetFeatured,
  onSetStatus,
}: {
  items: NewsItem[];
  onView: (item: NewsItem) => void;
  onEdit: (item: NewsItem) => void;
  onDelete: (item: NewsItem) => void;
  onSetFeatured: (item: NewsItem, isFeatured: boolean) => void;
  onSetStatus: (item: NewsItem, status: "draft" | "published" | "archived") => void;
}) {
  return (
    <List>
      {items.map((item) => (
        <Card key={item.id}>
          <Body>
            <Thumb src={item.coverImage} alt={item.title} />
            <Text>
              <TitleRow>
                <Title>{item.title}</Title>
                <BadgeRow>
                  <StatusBadge status={item.status} />
                  {item.isFeatured && <FeaturedBadge>⭐ Featured</FeaturedBadge>}
                </BadgeRow>
              </TitleRow>
              {item.excerpt && <Excerpt>{item.excerpt}</Excerpt>}
            </Text>
          </Body>
          <DateText>{formatNewsDate(item.createdAt)}</DateText>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreButton type="button" aria-label={`Menu ${item.title}`}>
                <MoreVertIcon />
              </MoreButton>
            </DropdownMenuTrigger>
            <MenuContent align="end">
              {/* Featured */}
              <MenuItem onSelect={() => onSetFeatured(item, !item.isFeatured)}>
                <StarIcon />
                {item.isFeatured ? "Hapus dari Featured" : "Set As Featured"}
              </MenuItem>

              <DropdownMenuSeparator />

              {/* Status — hanya tampil jika statusnya bukan yang bersangkutan */}
              {item.status !== "published" && (
                <MenuItem onSelect={() => onSetStatus(item, "published")}>
                  <CheckCircleIcon />
                  Set As Published
                </MenuItem>
              )}
              {item.status !== "draft" && (
                <MenuItem onSelect={() => onSetStatus(item, "draft")}>
                  <FileEditIcon />
                  Set As Draft
                </MenuItem>
              )}
              {item.status !== "archived" && (
                <MenuItem onSelect={() => onSetStatus(item, "archived")}>
                  <ArchiveIcon />
                  Set As Archived
                </MenuItem>
              )}

              <DropdownMenuSeparator />

              {/* Edit & view */}
              <MenuItem onSelect={() => onView(item)}>
                <EyeIcon />
                Lihat
              </MenuItem>
              <MenuItem onSelect={() => onEdit(item)}>
                <PencilIcon />
                Edit Berita
              </MenuItem>

              <DropdownMenuSeparator />

              {/* Delete */}
              <MenuItem variant="destructive" onSelect={() => onDelete(item)}>
                <TrashIcon />
                Delete Berita
              </MenuItem>
            </MenuContent>
          </DropdownMenu>
        </Card>
      ))}
    </List>
  );
}

// ─── NewsListWithConfirm — wraps NewsList with its own confirm dialog state ───

/** Komponen wrapper yang memanajemen state dialog konfirmasi internal,
 *  menerima `onConfirmDelete`, `onConfirmFeatured`, dan `onConfirmStatus`
 *  dari parent (`NewsSection`) yang sudah terhubung ke mutation hooks. */
export function NewsListWithConfirm({
  items,
  isPending,
  onView,
  onEdit,
  onConfirmDelete,
  onConfirmFeatured,
  onConfirmStatus,
}: {
  items: NewsItem[];
  isPending: boolean;
  onView: (item: NewsItem) => void;
  onEdit: (item: NewsItem) => void;
  onConfirmDelete: (item: NewsItem) => void;
  onConfirmFeatured: (item: NewsItem, isFeatured: boolean) => void;
  onConfirmStatus: (item: NewsItem, status: "draft" | "published" | "archived") => void;
}) {
  const [pendingAction, setPendingAction] = useState<ConfirmAction | null>(null);

  function handleConfirm() {
    if (!pendingAction) return;
    if (pendingAction.type === "delete") onConfirmDelete(pendingAction.item);
    else if (pendingAction.type === "set-featured")
      onConfirmFeatured(pendingAction.item, pendingAction.isFeatured);
    else onConfirmStatus(pendingAction.item, pendingAction.status);
    setPendingAction(null);
  }

  return (
    <>
      <NewsList
        items={items}
        onView={onView}
        onEdit={onEdit}
        onDelete={(item) => setPendingAction({ type: "delete", item })}
        onSetFeatured={(item, isFeatured) =>
          setPendingAction({ type: "set-featured", item, isFeatured })
        }
        onSetStatus={(item, status) => setPendingAction({ type: "set-status", item, status })}
      />
      <ConfirmDialog
        action={pendingAction}
        isPending={isPending}
        onConfirm={handleConfirm}
        onCancel={() => setPendingAction(null)}
      />
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Card = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 16px;

  ${media.desktop} {
    gap: 24px;
    padding: 16px 24px;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;

  ${media.desktop} {
    flex-direction: row;
    align-items: flex-start;
    /* ruang untuk tombol ⋮ absolut di kanan */
    padding-right: 48px;
  }
`;

const Thumb = styled(NewsCover)`
  width: 100%;
  aspect-ratio: 16 / 9;

  ${media.desktop} {
    width: 150px;
    height: 80px;
    flex-shrink: 0;
    aspect-ratio: auto;
  }
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  flex: 1;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  ${media.desktop} {
    flex-direction: row;
    align-items: flex-start;
    gap: 10px;
  }
`;

const Title = styled.h3`
  margin: 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #1d2520;
  flex: 1;
  min-width: 0;
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

/** Badge status: hijau=published, merah=archived, abu=draft. */
const Badge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
  text-transform: capitalize;

  ${({ $status }) =>
    $status === "published"
      ? css`
          background: #dcfce7;
          color: #166534;
        `
      : $status === "archived"
        ? css`
            background: #fee2e2;
            color: #991b1b;
          `
        : css`
            background: #f3f4f6;
            color: #6b7280;
          `}
`;

/** Badge is_featured — biru. */
const FeaturedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 10px;
  border-radius: 999px;
  background: #dbeafe;
  color: #1e40af;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
`;

const Excerpt = styled.p`
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #667a6c;
`;

const DateText = styled.p`
  margin: 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #667a6c;
`;

const MoreButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: #ffffff;
  border: 1px solid #d6dcd8;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f6f8f7;
  }

  ${media.desktop} {
    top: 50%;
    transform: translateY(-50%);
  }
`;

const MenuContent = styled(DropdownMenuContent)`
  display: flex;
  flex-direction: column;
  min-width: 218px;
  padding: 8px;
  gap: 0;
  border: none;
  border-radius: 16px;
  box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.25);
`;

const MenuItem = styled(DropdownMenuItem)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 10px 12px;
  border-radius: 8px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #455249;
  cursor: pointer;
`;

// ─── Confirm dialog styles ─────────────────────────────────────────────────────

const ConfirmCard = styled(DialogContent)`
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

const ConfirmHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #ecefed;
`;

const ConfirmTitle = styled(DialogTitle)`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
  color: #1d2520;
`;

const ConfirmBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
`;

const ConfirmMessage = styled(DialogDescription)`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #1d2520;
`;

const ConfirmSub = styled.p`
  margin: 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #667a6c;
`;

const ConfirmFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
`;

const confirmButtonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 10px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const ConfirmOk = styled.button<{ $destructive?: boolean }>`
  ${confirmButtonBase}
  border: none;
  background: ${({ $destructive }) => ($destructive ? "#dc2626" : "#175fe2")};
  color: #ffffff;
`;

const ConfirmCancel = styled.button`
  ${confirmButtonBase}
  background: #ffffff;
  border: 1.5px solid #d6dcd8;
  color: #667a6c;
`;
