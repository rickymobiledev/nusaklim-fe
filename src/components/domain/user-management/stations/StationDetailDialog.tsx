"use client";

import styled from "styled-components";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Station } from "@/types/domain";
import { StationAvatar } from "./StationAvatar";

/** Popup dari menu ⋮ (Figma): header biru + avatar, nama, kode; rincian
 *  Perusahaan/Merek/Longitude/Latitude; footer Edit / Hapus. Hapus
 *  dilanjutkan ke dialog konfirmasi oleh pemanggil. */
export function StationDetailDialog({
  open,
  onOpenChange,
  station,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  station: Station | null;
  onEdit: (station: Station) => void;
  onDelete: (station: Station) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Card showCloseButton={false}>
        {station && (
          <>
            <Hero>
              <AvatarWrap>
                <StationAvatar size={160} />
              </AvatarWrap>
              <Name>{station.nama}</Name>
              <Code>Kode: {station.id}</Code>
            </Hero>
            <Details>
              <Row>
                <Label>Perusahaan</Label>
                <Value>{station.companyName}</Value>
              </Row>
              <Row>
                <Label>Merek</Label>
                <Value>{station.brand}</Value>
              </Row>
              <Row>
                <Label>Longitude</Label>
                <Value>{station.long}</Value>
              </Row>
              <Row>
                <Label>Latitude</Label>
                <Value>{station.lat}</Value>
              </Row>
            </Details>
            <Footer>
              <EditButton type="button" onClick={() => onEdit(station)}>
                Edit
              </EditButton>
              <DeleteButton type="button" onClick={() => onDelete(station)}>
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
  width: 400px;
  max-width: calc(100% - 2rem);
  padding: 0;
  gap: 0;
  overflow: hidden;
  border: none;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.25);
`;

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 24px 24px;
  background: #175fe2;
`;

const AvatarWrap = styled.div`
  display: flex;
  margin-bottom: 8px;
  border-radius: 50%;
  background: #ffffff;
`;

const Name = styled(DialogTitle)`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
  text-align: center;
  color: #ffffff;
`;

const Code = styled(DialogDescription)`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #ffffff;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 24px 8px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

const Label = styled.span`
  flex: none;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #667a6c;
`;

const Value = styled.span`
  min-width: 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  text-align: right;
  color: #1d2520;
  overflow-wrap: anywhere;
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
