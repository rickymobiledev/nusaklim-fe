"use client";

import styled from "styled-components";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Company } from "@/types/user-management";
import { CompanyLogo } from "./CompanyLogo";

/** Popup dari tombol ⋮ kartu (Figma): header biru + logo, nama, kode,
 *  footer Edit / Hapus. Hapus dilanjutkan ke `CompanyDeleteDialog` oleh
 *  pemanggil. */
export function CompanyDetailDialog({
  open,
  onOpenChange,
  company,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company | null;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Card showCloseButton={false}>
        {company && (
          <>
            <Hero>
              <LogoWrap>
                <CompanyLogo imageUrl={company.imageUrl} name={company.name} size={160} />
              </LogoWrap>
              <Name>{company.name}</Name>
              <Code>{company.code}</Code>
            </Hero>
            <Footer>
              <EditButton type="button" onClick={() => onEdit(company)}>
                Edit
              </EditButton>
              <DeleteButton type="button" onClick={() => onDelete(company)}>
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
  padding: 32px 24px 40px;
  background: #175fe2;
`;

/** Lingkaran putih di belakang logo (Figma). */
const LogoWrap = styled.div`
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
