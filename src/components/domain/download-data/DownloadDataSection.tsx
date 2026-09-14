"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { format, parse } from "date-fns";
import { id } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import type { ColumnDef } from "@tanstack/react-table";
import { useStations } from "@/hooks/use-stations";
import { useDownloadData } from "@/hooks/use-download-data";
import { DownloadDataTable, DownloadDataPagination } from "./DownloadDataTable";
import { DataState } from "@/components/shared/DataState";
import { buildDownloadDataCsv, downloadCsvFile } from "@/lib/download-data-csv-utils";
import type { DataGranularity, DownloadDataRow } from "@/types/domain";
import { DownloadDataFilters } from "./DownloadDataFilters";

type DisplayRow = {
  no: number;
  tanggal: string;
  rerataTemperaturUdara: string;
  rerataKelembapanRelatif: string;
  totalCurahHujan: string;
  totalRadiasiMatahari: string;
  rerataTekananUdara: string;
  rerataKecepatanAngin: string;
  arahMataAngin: string;
};

// `size` di sini dipakai `DownloadDataTable` buat lebar kolom persis Figma
// (No 40px, Tanggal 160px, 7 kolom metrik 170px) lewat `<colgroup>`.
const columns: ColumnDef<DisplayRow>[] = [
  { accessorKey: "no", header: "No", size: 40 },
  { accessorKey: "tanggal", header: "Tanggal", size: 160 },
  { accessorKey: "rerataTemperaturUdara", header: "Rerata Temperatur Udara", size: 170 },
  {
    accessorKey: "rerataKelembapanRelatif",
    header: "Rerata Kelembapan Relatif",
    size: 170,
  },
  { accessorKey: "totalCurahHujan", header: "Total Curah Hujan", size: 170 },
  { accessorKey: "totalRadiasiMatahari", header: "Total Radiasi Matahari", size: 170 },
  { accessorKey: "rerataTekananUdara", header: "Rerata Tekanan Udara", size: 170 },
  { accessorKey: "rerataKecepatanAngin", header: "Rerata Kecepatan Angin", size: 170 },
  { accessorKey: "arahMataAngin", header: "Arah Mata Angin", size: 170 },
];

/** `row.tanggal` bentuknya beda tergantung granularitas — lihat docblock
 *  `DownloadDataRow` (`types/domain.ts`): "harian" → `"yyyy-MM-dd"` dari
 *  `/weathers/daily`, granularitas lain → datetime asli
 *  `"dd-MM-yyyy HH:mm"` dari `/weathers/filter` (satu baris = satu
 *  pembacaan mentah, jadi tampilkan jamnya juga). */
function formatTanggal(tanggal: string, granularity: DataGranularity): string {
  if (granularity === "harian") {
    return format(parse(tanggal, "yyyy-MM-dd", new Date()), "dd/MM/yyyy", { locale: id });
  }
  return format(parse(tanggal, "dd-MM-yyyy HH:mm", new Date()), "dd/MM/yyyy HH:mm", {
    locale: id,
  });
}

// `maximumFractionDigits: 20` (batas maksimum Intl.NumberFormat) — supaya
// TIDAK PERNAH membulatkan nilai asli dari API, cuma nambah pemisah ribuan
// "id-ID". Tanpa `minimumFractionDigits`, bilangan bulat (mis. radiasi
// matahari) tampil polos tanpa ".0" tambahan.
function fmtNumber(value: number | null, unit: string): string {
  if (value == null) return "--";
  return `${value.toLocaleString("id-ID", { maximumFractionDigits: 20 })} ${unit}`;
}

export function DownloadDataSection() {
  // TIDAK auto-select stasiun pertama — Unduh Data tidak ikut daftar
  // pengecualian auto-select (Beranda/Water Balance/Lama Penyinaran/VPD/
  // Dry Spell), lihat CLAUDE.md.
  const [stationId, setStationId] = useState<string>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [granularity, setGranularity] = useState<DataGranularity>("harian");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: stationsResponse, isLoading: isLoadingStations } = useStations();
  const stations = stationsResponse?.data ?? [];

  const dateFrom = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "";
  const dateTo = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "";

  // TANPA page/pageSize — `useDownloadData` fetch SELURUH baris hasil
  // filter sekali per (stasiun, tanggal, granularitas), pagination di
  // bawah murni slice client-side supaya pindah halaman/ganti "Jumlah
  // data perbaris" tidak memicu fetch/loading lagi (permintaan user).
  const { data, isLoading, isFetching, isError, error } = useDownloadData({
    stationId,
    dateFrom,
    dateTo,
    granularity,
  });

  const fullRows = useMemo<DownloadDataRow[]>(() => data?.data ?? [], [data]);
  const total = fullRows.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  // Derived, BUKAN useEffect+setPage (ditolak lint react-hooks/set-state-in-effect)
  // — jaga-jaga kalau ganti filter bikin total baris menyusut di bawah
  // halaman yang lagi aktif.
  const effectivePage = Math.min(page, pageCount);

  const rows = useMemo<DisplayRow[]>(() => {
    const start = (effectivePage - 1) * pageSize;
    return fullRows.slice(start, start + pageSize).map((row, index) => ({
      no: start + index + 1,
      tanggal: formatTanggal(row.tanggal, granularity),
      rerataTemperaturUdara: fmtNumber(row.rerataTemperatur, "°C"),
      rerataKelembapanRelatif: fmtNumber(row.rerataKelembapanRelatif, "%"),
      totalCurahHujan: fmtNumber(row.totalCurahHujan, "mm"),
      totalRadiasiMatahari: fmtNumber(row.totalRadiasi, "W/m²"),
      rerataTekananUdara: fmtNumber(row.rerataTekananUdara, "mbar"),
      rerataKecepatanAngin: fmtNumber(row.rerataKecepatanAngin, "m/s"),
      arahMataAngin: row.arahMataAngin ?? "--",
    }));
  }, [fullRows, effectivePage, pageSize, granularity]);

  function handleStationIdChange(id: string) {
    setStationId(id);
    setPage(1);
  }

  function handleDateRangeChange(range: DateRange | undefined) {
    setDateRange(range);
    setPage(1);
  }

  function handleGranularityChange(next: DataGranularity) {
    setGranularity(next);
    setPage(1);
  }

  function handlePageSizeChange(next: number) {
    setPageSize(next);
    setPage(1);
  }

  function handleDownload() {
    // `fullRows` SUDAH seluruh baris hasil filter (bukan cuma halaman
    // aktif) — tidak perlu fetch lagi, tinggal build CSV langsung.
    if (fullRows.length === 0) return;
    downloadCsvFile(
      `unduh-data_${dateFrom}_${dateTo}.csv`,
      buildDownloadDataCsv(fullRows),
    );
  }

  return (
    <Wrapper>
      <PageTitle>Unduh Data</PageTitle>

      {/* "Frame 55" Figma: filter row + card tabel, gap 12 — footer
          pagination di BAWAH grup ini (sibling "Frame 73" di layer Figma,
          bukan di dalam card). */}
      <FilterAndTableGroup>
        <DownloadDataFilters
          stations={stations}
          isLoadingStations={isLoadingStations}
          stationId={stationId}
          onStationIdChange={handleStationIdChange}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          granularity={granularity}
          onGranularityChange={handleGranularityChange}
          onDownload={handleDownload}
          downloadDisabled={fullRows.length === 0}
        />

        <Card>
          <DataState
            isLoading={isLoading}
            isError={isError}
            error={error}
            isEmpty={!isFetching && rows.length === 0}
            emptyMessage={
              isFetching
                ? "Memuat data..."
                : !stationId || !dateFrom || !dateTo
                  ? "Pilih stasiun dan rentang tanggal untuk melihat data."
                  : "Data Tidak Tersedia"
            }
          >
            <DownloadDataTable columns={columns} data={rows} />
          </DataState>
        </Card>
      </FilterAndTableGroup>

      <DownloadDataPagination
        meta={{ page: effectivePage, pageSize, total }}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-family: var(--font-heading), sans-serif;
  font-size: 24px;
  line-height: 28px;
  font-weight: 700;
  color: #000000;
`;

const FilterAndTableGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7ea;
  border-radius: 16px;
`;
