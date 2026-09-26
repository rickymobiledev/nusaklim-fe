"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { id as localeId } from "date-fns/locale";
import { fetchJson } from "@/lib/api/client-fetch";
import { getRainfallHeatmapLevel } from "@/lib/rainfall-heatmap-level";
import type { RainfallHeatmapHari } from "@/types/domain";
import type { RawRainfallHeatmapData } from "@/lib/api/rainfall-heatmap-client";

/** Hook data kartu "Heatmap Curah Hujan" Beranda — hit endpoint dedicated
 *  `/api/v2/dashboards/rainfall_heatmap?weather_station_id=&year=&month=`.
 *  Jika stasiun, tahun, atau bulan berubah, query otomatis fetch ulang data baru. */
export function useRainfallHeatmap(
  stationId?: string,
  year?: number,
  month?: number,
) {
  const now = new Date();
  const currentYear = year ?? now.getFullYear();
  const currentMonth = month ?? now.getMonth() + 1; // 1-12

  const { start, end, today } = useMemo(() => {
    const monthDate = new Date(currentYear, currentMonth - 1, 1);
    return {
      start: startOfMonth(monthDate),
      end: endOfMonth(monthDate),
      today: startOfDay(new Date()),
    };
  }, [currentYear, currentMonth]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["rainfall-heatmap", stationId, currentYear, currentMonth],
    queryFn: () =>
      fetchJson<{ status: boolean; data: RawRainfallHeatmapData }>(
        `/api/dashboards/rainfall_heatmap?weather_station_id=${encodeURIComponent(
          stationId ?? "",
        )}&year=${currentYear}&month=${currentMonth}`,
      ),
    enabled: !!stationId && !!currentYear && !!currentMonth,
    select: (res) => res.data,
  });

  const hariKalender = useMemo<(RainfallHeatmapHari | null)[]>(() => {
    const weathers = data?.weathers ?? [];
    const weatherMap = new Map<string, number>();
    weathers.forEach((w) => {
      const val =
        typeof w.rainfall === "number"
          ? w.rainfall
          : parseFloat(String(w.rainfall)) || 0;
      weatherMap.set(w.date, val);
    });

    const hariDalamBulan: RainfallHeatmapHari[] = eachDayOfInterval({
      start,
      end,
    }).map((tanggal) => {
      const dateStr = format(tanggal, "yyyy-MM-dd");
      const masaDepan = isAfter(startOfDay(tanggal), today);
      const curahHujan = masaDepan
        ? null
        : weatherMap.has(dateStr)
          ? weatherMap.get(dateStr)!
          : 0;
      return {
        tanggal: dateStr,
        tanggalAngka: tanggal.getDate(),
        curahHujan,
        level: getRainfallHeatmapLevel(curahHujan, masaDepan),
      };
    });

    // Min=0 ... Sab=6, sejajar urutan kolom weekday di Figma
    const leading = Array<null>(start.getDay()).fill(null);
    const totalTerisi = leading.length + hariDalamBulan.length;
    const trailing = Array<null>((7 - (totalTerisi % 7)) % 7).fill(null);

    return [...leading, ...hariDalamBulan, ...trailing];
  }, [start, end, today, data]);

  return {
    isLoading,
    isError,
    error,
    bulanLabel: format(start, "MMMM yyyy", { locale: localeId }),
    stationName: data?.weather_station_name,
    hariKalender,
  };
}
