"use client";

import styled from "styled-components";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { AghrisUser } from "@/types/user-management";
import { AghrisUserAvatar } from "./AghrisUserAvatar";

/** Kartu detail Pengguna Aghris — persis Figma (header biru avatar/nama/
 *  NIP SAP, badan Perusahaan & Peran, footer Edit/Hapus). Edit/Hapus
 *  menutup dialog dulu (lihat `AghrisUsersSection.tsx`). */
export function AghrisUserViewDialog({
  open,
  onOpenChange,
  user,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AghrisUser | null;
  onEdit: (user: AghrisUser) => void;
  onDelete: (user: AghrisUser) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Card showCloseButton={false}>
        {user && (
          <>
            <Header>
              <AghrisUserAvatar imageUrl={user.imageUrl} name={user.name} />
              <Identity>
                <Name>{user.name}</Name>
                <Nip>NIP SAP: {user.nipSap}</Nip>
              </Identity>
            </Header>

            <Body>
              <DetailRow>
                <DetailLabel>Perusahaan</DetailLabel>
                <DetailValue>{user.companyName}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Peran</DetailLabel>
                <DetailValue>{user.roleName}</DetailValue>
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

const Identity = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const Name = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
  color: #ffffff;
`;

const Nip = styled.span`
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

const DetailValue = styled.span`
  flex: 1;
  min-width: 0;
  text-align: right;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #1d2520;
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
