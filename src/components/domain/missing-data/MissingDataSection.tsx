"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { format, isValid, parse, startOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { ColumnDef } from "@tanstack/react-table";
import { useStations } from "@/hooks/use-stations";
import { useMissingData } from "@/hooks/use-missing-data";
import { DataState } from "@/components/shared/DataState";
import { AlertTriangleIcon } from "@/components/shared/DashboardIcons";
import {
  DownloadDataTable,
  DownloadDataPagination,
} from "@/components/domain/download-data/DownloadDataTable";
import type { MissingDataRow } from "@/types/domain";
import { MissingDataSummary } from "./MissingDataSummary";
import { MissingDataFilters } from "./MissingDataFilters";

const PAGE_SIZE_DEFAULT = 10;

/** Baris untuk tabel — metrik `null` = Missing (dirender jadi badge merah). */
type DisplayRow = {
  no: number;
  stasiun: string;
  datetime: string;
  temperaturUdara: string | null;
  kelembapanUdara: string | null;
  curahHujan: string | null;
  radiasiMatahari: string | null;
  tekananUdara: string | null;
  kecepatanAngin: string | null;
  arahMataAngin: string | null;
};

type MetricKey = Exclude<keyof DisplayRow, "no" | "stasiun" | "datetime">;

function MissingBadge() {
  return (
    <Badge>
      <AlertTriangleIcon size={16} color="#FFFFFF" />
      Missing
    </Badge>
  );
}

function metricColumn(key: MetricKey, header: string): ColumnDef<DisplayRow> {
  return {
    accessorKey: key,
    header,
    size: 139,
    cell: ({ getValue }) => {
      const value = getValue<string | null>();
      return value == null ? <MissingBadge /> : value;
    },
  };
}

// `size` dipakai `DownloadDataTable` buat lebar kolom lewat `<colgroup>`
// (Figma: No 40, Stasiun & Tanggal 190, 7 metrik ~139).
const columns: ColumnDef<DisplayRow>[] = [
  { accessorKey: "no", header: "No", size: 40 },
  { accessorKey: "stasiun", header: "Stasiun", size: 190 },
  { accessorKey: "datetime", header: "Tanggal dan Jam", size: 190 },
  metricColumn("temperaturUdara", "Temperatur Udara"),
  metricColumn("kelembapanUdara", "Kelembapan Udara"),
  metricColumn("curahHujan", "Curah Hujan"),
  metricColumn("radiasiMatahari", "Radiasi Matahari"),
  metricColumn("tekananUdara", "Tekanan Udara"),
  metricColumn("kecepatanAngin", "Kecepatan Angin"),
  metricColumn("arahMataAngin", "Arah Mata Angin"),
];

const METRIC_KEYS: (keyof MissingDataRow)[] = [
  "temperaturUdara",
  "kelembapanUdara",
  "curahHujan",
  "radiasiMatahari",
  "tekananUdara",
  "kecepatanAngin",
  "arahMataAngin",
];

function fmtNumber(value: number | null, unit: string, minFraction = 0): string | null {
  if (value == null) return null;
  const text = value.toLocaleString("id-ID", {
    minimumFractionDigits: minFraction,
    maximumFractionDigits: 20,
  });
  return `${text} ${unit}`;
}

function parseDatetime(datetime: string): Date | null {
  const parsed = parse(datetime, "dd-MM-yyyy HH:mm", new Date());
  return isValid(parsed) ? parsed : null;
}

function toDisplayRow(row: MissingDataRow, no: number): DisplayRow {
  const parsed = parseDatetime(row.datetime);
  return {
    no,
    stasiun: row.stasiun,
    datetime: parsed ? format(parsed, "dd/MM/yyyy, HH:mm") : row.datetime,
    temperaturUdara: fmtNumber(row.temperaturUdara, "°C"),
    kelembapanUdara: fmtNumber(row.kelembapanUdara, "%"),
    curahHujan: fmtNumber(row.curahHujan, "mm", 2),
    radiasiMatahari: fmtNumber(row.radiasiMatahari, "W/m²"),
    tekananUdara: fmtNumber(row.tekananUdara, "mbar"),
    kecepatanAngin: fmtNumber(row.kecepatanAngin, "m/s"),
    arahMataAngin: row.arahMataAngin,
  };
}

export function MissingDataSection() {
  const [stationId, setStationId] = useState<string>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);

  const { data: stationsResponse, isLoading: isLoadingStations } = useStations();
  const stations = stationsResponse?.data ?? [];
  const { data, isLoading, isError, error } = useMissingData();

  const allRows = useMemo<MissingDataRow[]>(() => data?.data ?? [], [data]);

  // Kartu ringkasan dihitung dari SEMUA baris (bukan yang terfilter): total
  // sel Missing & jumlah stasiun unik yang punya minimal 1 sel Missing.
  const { missingCount, affectedStationCount } = useMemo(() => {
    let missing = 0;
    const affected = new Set<string>();
    for (const row of allRows) {
      const rowMissing = METRIC_KEYS.filter((key) => row[key] == null).length;
      missing += rowMissing;
      if (rowMissing > 0) affected.add(row.stasiun);
    }
    return { missingCount: missing, affectedStationCount: affected.size };
  }, [allRows]);

  // Cocokkan berdasarkan NAMA stasiun (kontrak asli `/weathers/missing`
  // belum dikonfirmasi apakah membawa id device, jadi nama yang aman).
  const stationName = stations.find((s) => s.id === stationId)?.nama;
  const filteredRows = useMemo(() => {
    const from = dateRange?.from ? startOfDay(dateRange.from) : null;
    const to = dateRange?.to ? startOfDay(dateRange.to) : from;
    return allRows.filter((row) => {
      if (stationName && row.stasiun !== stationName) return false;
      if (from && to) {
        const parsed = parseDatetime(row.datetime);
        if (!parsed) return false;
        const day = startOfDay(parsed);
        if (day < from || day > to) return false;
      }
      return true;
    });
  }, [allRows, stationName, dateRange]);

  const total = filteredRows.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  // Derived, BUKAN useEffect+setPage (ditolak lint react-hooks/set-state-in-effect).
  const effectivePage = Math.min(page, pageCount);

  const rows = useMemo<DisplayRow[]>(() => {
    const start = (effectivePage - 1) * pageSize;
    return filteredRows
      .slice(start, start + pageSize)
      .map((row, index) => toDisplayRow(row, start + index + 1));
  }, [filteredRows, effectivePage, pageSize]);

  function handleStationIdChange(id: string) {
    setStationId(id);
    setPage(1);
  }

  function handleDateRangeChange(range: DateRange | undefined) {
    setDateRange(range);
    setPage(1);
  }

  function handlePageSizeChange(next: number) {
    setPageSize(next);
    setPage(1);
  }

  return (
    <Wrapper>
      <PageTitle>Missing Data</PageTitle>

      <MissingDataSummary
        missingCount={missingCount}
        affectedStationCount={affectedStationCount}
      />

      <FilterAndTableGroup>
        <MissingDataFilters
          stations={stations}
          isLoadingStations={isLoadingStations}
          stationId={stationId}
          onStationIdChange={handleStationIdChange}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
        />

        <TableCard>
          <DataState
            isLoading={isLoading}
            isError={isError}
            error={error}
            isEmpty={rows.length === 0}
            emptyMessage="Data Tidak Tersedia"
          >
            <DownloadDataTable columns={columns} data={rows} headerHeight={64} />
          </DataState>
        </TableCard>
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
`;

const TableCard = styled.div`
  margin-top: -1px;
  background: #ffffff;
  border: 1px solid #e5e7ea;
  border-radius: 0 0 16px 16px;
  overflow: hidden;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 8px;
  background: #ee443f;
  border-radius: 100px;
  font-family: var(--font-body), sans-serif;
  font-size: 10px;
  line-height: 12px;
  font-weight: 600;
  color: #ffffff;
`;
