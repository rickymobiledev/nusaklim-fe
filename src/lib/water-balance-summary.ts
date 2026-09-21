import type { WaterBalance, WaterBalanceMonth } from "@/types/domain";
import { getWaterDeficitLevel } from "@/lib/water-deficit-level";

/** Ambang "Hari Hujan > 20" ikut teks contoh di Figma kartu Keseimbangan
 *  Air (sidebar Beranda). BELUM ada konfirmasi resmi dari Data Analyst —
 *  threshold & kalimat banner di bawah sementara, status "belum final"
 *  sama seperti `getWaterDeficitLevel`. */
const RAINY_DAYS_HIGH = 20;

/** Bulan terakhir yang SUDAH SELESAI (bulan lalu) — agregat bulan
 *  berjalan belum lengkap (alasan sama dengan default periode tab Peta >
 *  Keseimbangan Air). Januari → Desember tahun lalu. `monthIndex` 0-based. */
export function getLastCompletedMonth(now: Date): { year: number; monthIndex: number } {
  const month = now.getMonth();
  return month === 0
    ? { year: now.getFullYear() - 1, monthIndex: 11 }
    : { year: now.getFullYear(), monthIndex: month - 1 };
}

function hasAnyValue(month: WaterBalanceMonth): boolean {
  return (
    month.rainfall !== null ||
    month.waterDeficit !== null ||
    month.rainyDays !== null ||
    month.waterSurplus !== null
  );
}

/** Mulai dari `monthIndex`, mundur sampai Januari pada tahun yang SAMA
 *  sampai ketemu bulan yang punya data (minimal satu metrik non-null).
 *  Sengaja TIDAK menyeberang ke tahun sebelumnya (butuh request tahun
 *  kedua) — kalau semua bulan sampai Januari kosong, hasilnya `null`. */
export function pickLatestWaterBalanceMonth(
  balance: WaterBalance | undefined,
  monthIndex: number,
): WaterBalanceMonth | null {
  if (!balance) return null;
  for (let i = Math.min(monthIndex, balance.months.length - 1); i >= 0; i--) {
    if (hasAnyValue(balance.months[i])) return balance.months[i];
  }
  return null;
}

/** Kalimat banner kartu — urutan prioritas: kekeringan > genangan > normal.
 *  Hanya kalimat genangan yang datang dari Figma; sisanya usulan (belum
 *  final). Catatan: data contoh Figma (11 hari hujan, kelebihan 9.30)
 *  sendiri tidak memenuhi syarat kalimat genangan, jadi kondisi ini bukan
 *  turunan langsung dari mockup. */
export function getWaterBalanceMessage(month: WaterBalanceMonth | null): string {
  if (!month) return "Data keseimbangan air belum tersedia.";
  if (getWaterDeficitLevel(month.waterDeficit) === "tinggi") {
    return "Defisit Air > 200 mm: tanaman berisiko mengalami cekaman kekeringan.";
  }
  if (
    month.rainyDays !== null &&
    month.rainyDays > RAINY_DAYS_HIGH &&
    month.waterSurplus !== null &&
    month.waterSurplus > 0
  ) {
    return "Kelebihan Air tinggi + Hari Hujan > 20: “Waspada potensi genangan – drainase perlu dicek”";
  }
  return "Keseimbangan air dalam kondisi normal.";
}
