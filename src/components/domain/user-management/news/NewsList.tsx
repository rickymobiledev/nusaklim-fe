"use client";

import styled from "styled-components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { media } from "@/lib/breakpoints";
import type { NewsItem } from "@/types/domain";
import { EyeIcon, MoreVertIcon, PencilIcon, TrashIcon } from "../companies/CompaniesGrid";
import { NewsCover, formatNewsDate } from "./NewsCover";

/** Daftar kartu berita (Figma): desktop satu baris (thumbnail 150x80 di kiri,
 *  judul + ringkasan 2 baris, ⋮ di kanan, tanggal di bawah); mobile thumbnail
 *  full-width di atas dengan ⋮ di pojok kanan atas. */
export function NewsList({
  items,
  onView,
  onEdit,
  onDelete,
}: {
  items: NewsItem[];
  onView: (item: NewsItem) => void;
  onEdit: (item: NewsItem) => void;
  onDelete: (item: NewsItem) => void;
}) {
  return (
    <List>
      {items.map((item) => (
        <Card key={item.id}>
          <Body>
            <Thumb src={item.coverImage} alt={item.title} />
            <Text>
              <Title>{item.title}</Title>
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
              <MenuItem onSelect={() => onView(item)}>
                <EyeIcon />
                Lihat
              </MenuItem>
              <MenuItem onSelect={() => onEdit(item)}>
                <PencilIcon />
                Ubah Data
              </MenuItem>
              <MenuItem variant="destructive" onSelect={() => onDelete(item)}>
                <TrashIcon />
                Hapus Data
              </MenuItem>
            </MenuContent>
          </DropdownMenu>
        </Card>
      ))}
    </List>
  );
}

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
    align-items: center;
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
    aspect-ratio: auto;
  }
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
`;

const Title = styled.h3`
  margin: 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #1d2520;
`;

const Excerpt = styled.p`
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #1d2520;
`;

const DateText = styled.p`
  margin: 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #667a6c;
`;

const MoreButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
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
