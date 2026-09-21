"use client";

import Image from "next/image";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import styled from "styled-components";
import { useDrySpell } from "@/hooks/use-dry-spell";
import { SidePanelWarningBanner } from "@/components/domain/beranda/SidePanelWarningBanner";
import { getErrorMessage } from "@/lib/api/error-messages";
import {
  DRY_SPELL_MESSAGE,
  getDrySpellLevel,
  pickLatestDrySpellReport,
} from "@/lib/dry-spell-level";

/** Kartu "Deret Hari Terpanjang Tidak Hujan" di sidebar kanan Beranda.
 *  Pakai endpoint per-stasiun yang SAMA dengan Monitoring > Deret Hari
 *  Tanpa Hujan (`useDrySpell`), rentang 1 Jan tahun berjalan s/d hari ini
 *  — BUKAN `useDrySpellMap` (endpoint company-wide tab Peta). Warna kartu
 *  tetap kuning untuk semua level (keputusan user, Figma cuma punya satu
 *  varian) — hanya kalimat banner yang berganti. */
export function DrySpellSummaryCard({ stationId }: { stationId?: string }) {
  const today = new Date();
  const { data, isLoading, isError, error } = useDrySpell({
    stationId,
    dateFrom: `${today.getFullYear()}-01-01`,
    dateTo: format(today, "yyyy-MM-dd"),
  });

  const latest = pickLatestDrySpellReport(data ?? []);
  const level = getDrySpellLevel(latest?.totalHariKering ?? null);

  let dateText: string;
  if (!stationId || isLoading) dateText = "Memuat data...";
  else if (isError) dateText = "Data tidak dapat dimuat";
  else if (!latest) dateText = "Belum ada periode tercatat tahun ini";
  else
    dateText = `${formatDate(latest.tanggalMulai)} — ${formatDate(latest.tanggalSelesai)}`;

  return (
    <Card>
      <GlowFrame aria-hidden>
        <Glow src="/brand/dry-spell-glow.webp" alt="" width={520} height={520} />
      </GlowFrame>

      <Content>
        <Title>Deret Hari Terpanjang Tidak Hujan</Title>
        <ValueRow>
          <Image src="/brand/dry-spell.png" alt="" width={50} height={50} />
          <Value>{latest ? `${latest.totalHariKering} Hari` : "—"}</Value>
        </ValueRow>
      </Content>

      <DateText>{dateText}</DateText>

      <SidePanelWarningBanner
        message={isError ? getErrorMessage(error) : DRY_SPELL_MESSAGE[level]}
      />
    </Card>
  );
}

function formatDate(value: string): string {
  return format(parseISO(value), "d MMM yyyy", { locale: id });
}

const Card = styled.div`
  position: relative;
  isolation: isolate;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  gap: 8px;
  padding: 16px;
  overflow: hidden;
  background: linear-gradient(277.11deg, #ffeeb7 2.38%, #ffe100 73.49%);
  border: 1px solid #e89b00;
  border-radius: 16px;
`;

/* Frame "Background" Figma (tinggi 106px, clip content) — glow 520px
 * sengaja menjulur keluar frame, cuma bagian atas yang kelihatan. Clip
 * mentah di 106px bikin garis batas tegas di layar asli (Figma tidak
 * menampakkannya), jadi bagian bawah frame dipudarkan lewat mask —
 * bukan bagian spec Figma, penyesuaian visual. */
const GlowFrame = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 106px;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  -webkit-mask-image: linear-gradient(to bottom, #000 30%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 30%, transparent 100%);
`;

/* Opacity < 1 supaya lingkaran putih di tengah glow tidak terlalu
 * mencolok (di Figma tampil redup) — nilai perkiraan visual. */
const Glow = styled(Image)`
  position: absolute;
  top: -247px;
  right: -242px;
  width: 520px;
  height: 520px;
  max-width: none;
  opacity: 0.55;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #b57900;
`;

const ValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Value = styled.span`
  font-family: var(--font-manrope), sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  color: #8c5e00;
`;

const DateText = styled.span`
  position: relative;
  z-index: 2;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.5);
`;
