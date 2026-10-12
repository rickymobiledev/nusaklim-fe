"use client";

import styled from "styled-components";
import { InfoEmptyIcon } from "@/components/shared/DashboardIcons";
import { formatSyncDate } from "@/lib/sync-date";

/** Alert info biru (Figma "Alert") di bawah banner peringatan tiap kartu
 *  sidebar kanan Beranda: tanggal sinkronisasi terakhir. Tidak dirender
 *  kalau `lastUpdate` kosong/tidak valid (BE belum mengirim field-nya —
 *  lihat `last_update` di `dashboard-sidebar-client.ts`). Ejaan
 *  "Sinkronisasi" sengaja dikoreksi dari "sinkornisasi" di Figma. `z-index`
 *  di atas lapisan latar dekoratif kartu, sama seperti
 *  `SidePanelWarningBanner`. */
export function SidePanelSyncAlert({ lastUpdate }: { lastUpdate?: string | null }) {
  const date = formatSyncDate(lastUpdate);
  // if (!date) return null;

  return (
    <Alert>
      <InfoEmptyIcon size={20} color="#175FE2" />
      <AlertText>
        Sinkronisasi terakhir: <strong>{date}</strong>
      </AlertText>
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

  strong {
    font-weight: 600;
  }
`;
