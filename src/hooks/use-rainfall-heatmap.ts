"use client";

import { useMemo } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useRainfallChart } from "./use-rainfall-chart";
import { getRainfallHeatmapLevel } from "@/lib/rainfall-heatmap-level";
import type { RainfallHeatmapHari } from "@/types/domain";

/** Data kartu "Heatmap Curah Hujan" Beranda — REUSE `useRainfallChart()`
 *  (endpoint & fetch logic SAMA dengan halaman `/rainfall`), TIDAK ada
 *  route/API baru. Hook ini murni shaping di client: (1) paksa rentang
 *  = bulan BERJALAN (statis, tanpa navigasi prev/next, sesuai keputusan
 *  user), (2) zip `points[i]` dari `fetchRainfallRange` dengan
 *  `eachDayOfInterval` (aman index-by-index karena urutan keduanya
 *  dijamin sama — lihat loop berurutan dari `startDate` di
 *  `fetchRainfallRange`, `lib/api/weather-daily-client.ts`), (3) override
 *  level jadi `tidak_ada_data` untuk tanggal > hari ini (BE tidak bisa
 *  membedakan dari default 0mm-nya `fetchRainfallRange`), (4) tambah sel
 *  padding `null` di awal/akhir grid 7 kolom (Min..Sab). */
export function useRainfallHeatmap(stationId?: string) {
  const { start, end, today } = useMemo(() => {
    const now = new Date();
    return { start: startOfMonth(now), end: endOfMonth(now), today: startOfDay(now) };
  }, []);

  const stationIds = useMemo(() => (stationId ? [stationId] : []), [stationId]);

  const { data, isLoading } = useRainfallChart(stationIds, { from: start, to: end });

  const hariKalender = useMemo<(RainfallHeatmapHari | null)[]>(() => {
    const points = data?.[0]?.points ?? [];
    const hariDalamBulan: RainfallHeatmapHari[] = eachDayOfInterval({ start, end }).map(
      (tanggal, i) => {
        const masaDepan = isAfter(startOfDay(tanggal), today);
        const curahHujan = masaDepan ? null : (points[i]?.value ?? 0);
        return {
          tanggal: format(tanggal, "yyyy-MM-dd"),
          tanggalAngka: tanggal.getDate(),
          curahHujan,
          level: getRainfallHeatmapLevel(curahHujan, masaDepan),
        };
      },
    );

    // Min=0 ... Sab=6, sejajar urutan kolom weekday di Figma
    const leading = Array<null>(start.getDay()).fill(null);
    const totalTerisi = leading.length + hariDalamBulan.length;
    const trailing = Array<null>((7 - (totalTerisi % 7)) % 7).fill(null);

    return [...leading, ...hariDalamBulan, ...trailing];
  }, [start, end, today, data]);

  return {
    isLoading,
    bulanLabel: format(start, "MMMM yyyy", { locale: localeId }),
    hariKalender,
  };
}
