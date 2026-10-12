"use client";

import styled from "styled-components";
import { InfoEmptyIcon } from "@/components/shared/DashboardIcons";

/** Alert info biru (Figma "Alert") di bawah banner peringatan tiap kartu
 *  sidebar kanan Beranda. Isinya field `title` dari BE apa adanya (mis.
 *  "Lama Penyinaran Matahari Kemarin") — tanpa format/prefix tambahan.
 *  Tidak dirender kalau `title` kosong. `z-index` di atas lapisan latar
 *  dekoratif kartu, sama seperti `SidePanelWarningBanner`. */
export function SidePanelSyncAlert({ title }: { title?: string | null }) {
  if (!title) return null;

  return (
    <Alert>
      <InfoEmptyIcon size={20} color="#175FE2" />
      <AlertText>{title}</AlertText>
    </Alert>
  );
}

const Alert = styled.div`
  position: relative;
  z-index: 3;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  align-self: stretch;
  gap: 8px;
  padding: 4px 8px;
  background: #eff5ff;
  border: 1.5px solid #175fe2;
  border-radius: 12px;

  svg {
    flex: none;
  }
`;

const AlertText = styled.p`
  margin: 0;
  flex: 1;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #667a6c;
`;
