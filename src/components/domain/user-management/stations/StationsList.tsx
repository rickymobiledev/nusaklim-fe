"use client";

import styled from "styled-components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { media } from "@/lib/breakpoints";
import type { Station } from "@/types/domain";
import { EyeIcon, MoreVertIcon, PencilIcon, TrashIcon } from "../companies/CompaniesGrid";
import { StationAvatar } from "./StationAvatar";

/** Daftar kartu stasiun (Figma): desktop satu baris (avatar, nama+kode,
 *  perusahaan, merek, ⋮); mobile ditumpuk vertikal dengan ⋮ di pojok kanan
 *  atas. "Kode" = id stasiun (`Station` tidak punya field kode terpisah). */
export function StationsList({
  stations,
  onView,
  onEdit,
  onDelete,
}: {
  stations: Station[];
  onView: (station: Station) => void;
  onEdit: (station: Station) => void;
  onDelete: (station: Station) => void;
}) {
  return (
    <List>
      {stations.map((station) => (
        <Card key={station.id}>
          <AvatarWrap>
            <StationAvatar size={86} />
          </AvatarWrap>
          <Identity>
            <Name>{station.nama}</Name>
            <Code>Kode: {station.id}</Code>
          </Identity>
          <Field>
            <FieldLabel>Nama Perusahaan</FieldLabel>
            <FieldValue>{station.companyName}</FieldValue>
          </Field>
          <Field>
            <FieldLabel>Merek</FieldLabel>
            <FieldValue>{station.brand}</FieldValue>
          </Field>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreButton type="button" aria-label={`Menu ${station.nama}`}>
                <MoreVertIcon />
              </MoreButton>
            </DropdownMenuTrigger>
            <MenuContent align="end">
              <MenuItem onSelect={() => onView(station)}>
                <EyeIcon />
                Lihat
              </MenuItem>
              <MenuItem onSelect={() => onEdit(station)}>
                <PencilIcon />
                Ubah Data
              </MenuItem>
              <MenuItem variant="destructive" onSelect={() => onDelete(station)}>
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
  gap: 12px;
`;

const Card = styled.div`
  position: relative;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: 16px;
  row-gap: 8px;
  align-items: center;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 16px;

  ${media.desktop} {
    grid-template-columns: auto minmax(0, 1.3fr) minmax(0, 1.6fr) minmax(0, 1.2fr) auto;
    column-gap: 32px;
    padding: 20px 32px 20px 20px;
  }
`;

const AvatarWrap = styled.div`
  display: flex;
`;

const Identity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding-right: 40px;

  ${media.desktop} {
    padding-right: 0;
  }
`;

const Name = styled.p`
  margin: 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #1d2520;
`;

const Code = styled.p`
  margin: 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #1d2520;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  grid-column: 1 / -1;

  ${media.desktop} {
    grid-column: auto;
  }
`;

const FieldLabel = styled.p`
  margin: 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #667a6c;
`;

const FieldValue = styled.p`
  margin: 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #1d2520;
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
    position: static;
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
