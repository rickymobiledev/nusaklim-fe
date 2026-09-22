"use client";

import Image from "next/image";
import { format } from "date-fns";
import styled from "styled-components";
import { useVPD } from "@/hooks/use-vpd";
import { SidePanelWarningBanner } from "@/components/domain/beranda/SidePanelWarningBanner";
import { InfoEmptyIcon } from "@/components/shared/DashboardIcons";
import { getErrorMessage } from "@/lib/api/error-messages";
import { media } from "@/lib/breakpoints";
import {
  DEFAULT_BATAS_AMAN_KPA,
  formatKpa,
  getVpdMessage,
  pickLatestVpd,
} from "@/lib/vpd-summary";

/** Kartu "VPD" di sidebar kanan Beranda. Endpoint per-stasiun yang SAMA
 *  dengan Monitoring > VPD (`useVPD`), rentang 1 Jan tahun berjalan s/d
 *  hari ini, lalu ambil baris bermakna TERBARU (`pickLatestVpd`) —
 *  mengikuti project lama (acuan kebenaran) yang menampilkan baris
 *  terakhir: BE belum punya baris hari ini, jadi yang tampil data kemarin
 *  (bukti: nilai 20 Sep pada screenshot project lama). BEDA dari kartu
 *  Lama Penyinaran yang memang hari ini saja (project lama-nya `--`).
 *  Rentang 1 Jan adalah dugaan dari bentuk respons project lama — kalau
 *  ternyata jendelanya lain, cukup ganti `dateFrom`. Respons "tidak ada
 *  baris" (HTTP 404 dari BE) sudah dijadikan daftar kosong di
 *  `vpd-client.ts`. "Batas Aman" dari baris BE, fallback
 *  `DEFAULT_BATAS_AMAN_KPA` tanpa baris (Figma & project lama tetap
 *  menampilkan "1.7 kPa"). Angka ditampilkan apa adanya (maks 6 desimal).
 *
 *  Ikon info di header dekoratif — Figma tidak menunjukkan isi tooltip-nya
 *  (TODO kalau user mau tooltip penjelasan VPD). Catatan data: nilai `SVP`
 *  asli ~600–7600 tampak satuan Pa, tapi Figma & project lama menulis
 *  "kPa" — diikuti apa adanya, butuh konfirmasi BE/Data Analyst. */
export function VpdSummaryCard({ stationId }: { stationId?: string }) {
  const now = new Date();
  const { data, isLoading, isError, error } = useVPD({
    stationId,
    dateFrom: `${now.getFullYear()}-01-01`,
    dateTo: format(now, "yyyy-MM-dd"),
  });

  const row = pickLatestVpd(data ?? []);
  const pending = !stationId || isLoading;

  const emptyText = pending ? "Memuat data..." : "—";

  let message: string;
  if (isError) message = getErrorMessage(error);
  else if (pending) message = "Memuat data...";
  else message = getVpdMessage(row);

  return (
    <Card>
      <Header>
        <Image src="/brand/vpd.png" alt="" width={50} height={50} />
        <Title>VPD</Title>
        <InfoEmptyIcon size={16} color="#8B9C90" />
      </Header>

      <Row>
        <Label>Batas Aman</Label>
        <Value $muted={false}>
          {formatKpa(row?.batasAman ?? DEFAULT_BATAS_AMAN_KPA)}
        </Value>
      </Row>
      <Row>
        <Label>SVP</Label>
        <Value $muted={!row}>{row ? formatKpa(row.svp) : emptyText}</Value>
      </Row>
      <Row>
        <Label>VPD</Label>
        <Value $muted={!row}>{row ? formatKpa(row.vpd) : emptyText}</Value>
      </Row>

      <SidePanelWarningBanner message={message} />
    </Card>
  );
}

/* Mobile: tanpa border/radius, tanpa padding kiri-kanan — dipisah dari
 * kartu sebelumnya lewat `border-top` (pengganti box penuh), bukan
 * card berbingkai seperti kartu sidebar lain. Desktop tetap card
 * berbingkai seperti sebelumnya. */
const Card = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  gap: 8px;
  width: 100%;
  padding: 16px 0 0;
  border-top: 1px solid #d6dcd8;

  ${media.desktop} {
    padding: 16px;
    border: 1px solid #d6dcd8;
    border-radius: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

/* Nunito Sans — Figma memakai font ini khusus judul kartu VPD (kartu
 * sidebar lain Plus Jakarta Sans), diikuti apa adanya. */
const Title = styled.span`
  font-family: var(--font-nunito-sans), sans-serif;
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
