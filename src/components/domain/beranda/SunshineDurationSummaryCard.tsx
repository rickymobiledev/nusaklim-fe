"use client";

import Image from "next/image";
import { format } from "date-fns";
import styled from "styled-components";
import { useSunshineDuration } from "@/hooks/use-sunshine-duration";
import { SidePanelWarningBanner } from "@/components/domain/beranda/SidePanelWarningBanner";
import { getErrorMessage } from "@/lib/api/error-messages";
import {
  DEFAULT_BATAS_BAWAH_JAM,
  formatHours,
  getSunshineDurationMessage,
  pickLatestSunshineDuration,
} from "@/lib/sunshine-duration-summary";

/** Kartu "Lama Penyinaran" di sidebar kanan Beranda. Endpoint per-stasiun
 *  yang SAMA dengan Monitoring > Lama Penyinaran (`useSunshineDuration`),
 *  tapi HANYA hari ini (dateFrom = dateTo) — sama project lama, yang jadi
 *  acuan kebenaran: baris hari ini belum ada (lama penyinaran baru lengkap
 *  sore/malam) → "Data Belum Tersedia". Sempat memakai fallback "baris
 *  terbaru dalam 7 hari" tapi itu menampilkan angka kemarin tanpa label
 *  tanggal dan berbeda dari project lama. Respons "tidak ada baris" (HTTP
 *  404 dari BE) sudah dijadikan daftar kosong di `sunshine-duration-client`.
 *  "Batas Bawah" dari baris BE, fallback `DEFAULT_BATAS_BAWAH_JAM` tanpa
 *  baris (Figma & project lama tetap menampilkan "3 Jam"). */
export function SunshineDurationSummaryCard({ stationId }: { stationId?: string }) {
  const today = format(new Date(), "yyyy-MM-dd");
  const { data, isLoading, isError, error } = useSunshineDuration({
    stationId,
    dateFrom: today,
    dateTo: today,
  });

  const row = pickLatestSunshineDuration(data ?? []);
  const pending = !stationId || isLoading;

  let durationText = "Data Belum Tersedia";
  if (pending) durationText = "Memuat data...";
  else if (row) durationText = formatHours(row.lamaPenyinaranJam);

  let message: string;
  if (isError) message = getErrorMessage(error);
  else if (pending) message = "Memuat data...";
  else message = getSunshineDurationMessage(row);

  return (
    <Card>
      <Header>
        <Image src="/brand/lama-penyinaran.png" alt="" width={50} height={50} />
        <Title>Lama Penyinaran</Title>
      </Header>

      <Row>
        <Label>Batas Bawah</Label>
        <Value $muted={false}>
          {formatHours(row?.batasBawahJam ?? DEFAULT_BATAS_BAWAH_JAM)}
        </Value>
      </Row>
      <Row>
        <Label>Lama Penyinaran</Label>
        <Value $muted={!row}>{durationText}</Value>
      </Row>

      <SidePanelWarningBanner message={message} />
    </Card>
  );
}

const Card = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  gap: 8px;
  padding: 16px;
  border: 1px solid #d6dcd8;
  border-radius: 16px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #1d2520;
`;

const Row = styled.div`
  display: flex;
  align-self: stretch;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const Label = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #6d717f;
`;

const Value = styled.span<{ $muted: boolean }>`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  text-align: right;
  color: ${(p) => (p.$muted ? "#8b9c90" : "#1d2520")};
`;
