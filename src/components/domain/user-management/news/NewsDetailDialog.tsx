"use client";

import styled from "styled-components";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNewsDetail } from "@/hooks/use-news-management";
import type { NewsItem } from "@/types/domain";
import { NewsHtml } from "./NewsContent";
import { NewsCover, formatNewsDate } from "./NewsCover";

/** Popup dari menu ⋮ → Lihat: cover, judul, tanggal, ringkasan, footer
 *  Edit / Hapus. Hapus dilanjutkan ke `CompanyDeleteDialog` oleh pemanggil. */
export function NewsDetailDialog({
  open,
  onOpenChange,
  item,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: NewsItem | null;
  onEdit: (item: NewsItem) => void;
  onDelete: (item: NewsItem) => void;
}) {
  // Isi lengkap (HTML) baru ada di detail — dimuat saat dialog dibuka.
  const detail = useNewsDetail(open && item ? item.id : null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Card showCloseButton={false}>
        {item && (
          <>
            <Cover src={item.coverImage} alt={item.title} />
            <Content>
              <Title>{item.title}</Title>
              <DateText>{formatNewsDate(item.createdAt)}</DateText>
              {detail.isLoading && <Status>Memuat isi berita...</Status>}
              {detail.isError && <Status>Isi berita gagal dimuat.</Status>}
              {detail.data && <NewsHtml html={detail.data.content} />}
            </Content>
            <Footer>
              <EditButton type="button" onClick={() => onEdit(item)}>
                Edit
              </EditButton>
              <DeleteButton type="button" onClick={() => onDelete(item)}>
                Hapus
              </DeleteButton>
            </Footer>
          </>
        )}
      </Card>
    </Dialog>
  );
}

const Card = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  width: 480px;
  max-width: calc(100% - 2rem);
  max-height: calc(100% - 2rem);
  padding: 0;
  gap: 0;
  overflow-y: auto;
  border: none;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.25);
`;

const Cover = styled(NewsCover)`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px 24px 8px;
`;

const Title = styled(DialogTitle)`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
  color: #1d2520;
`;

const DateText = styled.p`
  margin: 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #667a6c;
`;

const Status = styled(DialogDescription)`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #667a6c;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 16px 24px;
`;

const buttonBase = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 96px;
  padding: 14px 20px;
  border-radius: 12px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
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
