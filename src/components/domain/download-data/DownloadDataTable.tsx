"use client";

import { useState } from "react";
import styled from "styled-components";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingFn,
  type SortingState,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkeletonBlock } from "@/components/shared/SkeletonBlock";
import { media } from "@/lib/breakpoints";
import type { ApiMeta } from "@/types/api";

/** Nilai sel sudah berupa string terformat ("12,5 °C", "1.234 mm",
 *  "05/03/2026 10:30", "--"), jadi sort string biasa salah (mis. "10" < "9").
 *  Tanggal & angka format id-ID diurai dulu; nilai kosong ("--") selalu di
 *  akhir, apapun arah sort-nya. */
function toSortable(value: unknown): number | string | null {
  if (value == null) return null;
  if (typeof value === "number") return value;
  const text = String(value).trim();
  if (text === "" || text === "--") return null;
  const date = text.match(/^(\d{2})[/-](\d{2})[/-](\d{4})(?:\s+(\d{2}):(\d{2}))?$/);
  if (date) {
    const [, dd, mm, yyyy, hh = "0", mi = "0"] = date;
    return new Date(+yyyy, +mm - 1, +dd, +hh, +mi).getTime();
  }
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return new Date(+iso[1], +iso[2] - 1, +iso[3]).getTime();
  const num = text.match(/^-?[\d.]+(?:,\d+)?/);
  if (num) {
    const parsed = Number(num[0].replace(/\./g, "").replace(",", "."));
    if (!Number.isNaN(parsed)) return parsed;
  }
  return text.toLowerCase();
}

function compareCells(a: number | string | null, b: number | string | null): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "id-ID");
}

const smartSort: SortingFn<unknown> = (rowA, rowB, columnId) => {
  const a = toSortable(rowA.getValue(columnId));
  const b = toSortable(rowB.getValue(columnId));
  if (a === b) return 0;
  // Kosong selalu di akhir: dikompensasi arah sort supaya tetap di bawah.
  const desc = rowA.getAllCells()[0]?.getContext().table.getState().sorting[0]?.desc;
  if (a === null) return desc ? -1 : 1;
  if (b === null) return desc ? 1 : -1;
  return compareCells(a, b);
};

/** Tabel Unduh Data — SENGAJA tidak reuse `components/shared/DataTable.tsx`
 *  (dipakai juga Ramalan Cuaca yang belum di-redesign Figma). Warna/lebar
 *  kolom/tinggi baris di sini persis Figma (header bold `#09275F` center,
 *  zebra baris `#F6F8F7`/`#FFFFFF`, dst) — kalau didorong ke komponen
 *  shared, Ramalan Cuaca ikut berubah tampilannya, di luar scope. Markup
 *  `<table>` mentah + styled-components (bukan reuse `components/ui/table.tsx`)
 *  biar tidak baku hantam sama class Tailwind bawaan shadcn di situ. */
export function DownloadDataTable<T>({
  columns,
  data,
  emptyMessage = "Data Tidak Tersedia",
  headerHeight = 88,
}: {
  columns: ColumnDef<T>[];
  data: T[];
  emptyMessage?: string;
  /** Tinggi baris header (px) — default 88 (Unduh Data), halaman lain
   *  yang reuse tabel ini boleh override (mis. Missing Data: 64). */
  headerHeight?: number;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    defaultColumn: { sortingFn: smartSort as SortingFn<T> },
    sortDescFirst: false,
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  return (
    <ScrollArea>
      <Table>
        <colgroup>
          {headerGroups[0]?.headers.map((header) => (
            <col key={header.id} style={{ width: header.getSize() }} />
          ))}
        </colgroup>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  key={header.id}
                  $height={headerHeight}
                  aria-sort={
                    header.column.getIsSorted() === "asc"
                      ? "ascending"
                      : header.column.getIsSorted() === "desc"
                        ? "descending"
                        : undefined
                  }
                >
                  {header.isPlaceholder ? null : (
                    <SortButton
                      type="button"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <SortIcon $active={!!header.column.getIsSorted()}>
                        {header.column.getIsSorted() === "asc" ? (
                          <ArrowUp size={14} />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ArrowDown size={14} />
                        ) : (
                          <ArrowUpDown size={14} />
                        )}
                      </SortIcon>
                    </SortButton>
                  )}
                </Th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, index) => (
              <Tr key={row.id} $odd={index % 2 === 0}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))
          ) : (
            <tr>
              <EmptyCell colSpan={columns.length}>{emptyMessage}</EmptyCell>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}

/** Skeleton tabel: kolom (lebar dari `size`), tinggi header & baris sama
 *  dengan `DownloadDataTable` asli supaya card tidak melompat saat data datang. */
export function DownloadDataTableSkeleton<T>({
  columns,
  rows = 10,
  headerHeight = 88,
}: {
  columns: ColumnDef<T>[];
  rows?: number;
  headerHeight?: number;
}) {
  return (
    <ScrollArea>
      <Table>
        <colgroup>
          {columns.map((column, col) => (
            <col key={col} style={{ width: column.size }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((_, col) => (
              <Th key={col} $height={headerHeight}>
                <SkeletonBlock $w="60%" $h="16px" style={{ margin: "0 auto" }} />
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, row) => (
            <Tr key={row} $odd={row % 2 === 0}>
              {columns.map((_, col) => (
                <Td key={col}>
                  <SkeletonBlock $w="60%" $h="16px" style={{ margin: "0 auto" }} />
                </Td>
              ))}
            </Tr>
          ))}
        </tbody>
      </Table>
    </ScrollArea>
  );
}

/** Footer "Jumlah data perbaris" + "Menampilkan X-Y dari Z data" + panah —
 *  di Figma ini SIBLING di bawah card tabel (bukan di dalamnya, lihat
 *  layer "Frame 73" ada di luar "Frame 16"), makanya dirender terpisah
 *  dari `DownloadDataTable` di atas (bukan digabung 1 komponen), supaya
 *  `DownloadDataSection.tsx` bisa taruh `Card` cuma di sekeliling tabelnya
 *  saja. */
export function DownloadDataPagination({
  meta,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  isLoading = false,
}: {
  meta?: ApiMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  /** Selama data dimuat, teks "Menampilkan X-Y dari Z data" diganti skeleton. */
  isLoading?: boolean;
}) {
  if (!meta) return null;

  const pageCount = Math.max(1, Math.ceil(meta.total / meta.pageSize));
  const rangeStart = meta.total > 0 ? (meta.page - 1) * meta.pageSize + 1 : 0;
  const rangeEnd = Math.min(meta.page * meta.pageSize, meta.total);

  return (
    <Footer>
      <PageSizeGroup>
        <FooterLabel>Jumlah data perbaris</FooterLabel>
        <Select
          value={String(meta.pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <PageSizeTrigger aria-label="Jumlah data perbaris">
            <SelectValue />
          </PageSizeTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageSizeGroup>

      {isLoading ? (
        <SkeletonBlock $w="140px" $h="12px" />
      ) : (
        <FooterLabel>
          {meta.total > 0
            ? `Menampilkan ${rangeStart}-${rangeEnd} dari ${meta.total} data`
            : "Tidak ada data"}
        </FooterLabel>
      )}

      <ArrowButton
        type="button"
        aria-label="Halaman sebelumnya"
        disabled={meta.page <= 1}
        onClick={() => onPageChange(meta.page - 1)}
      >
        <ChevronLeft size={18} />
      </ArrowButton>
      <ArrowButton
        type="button"
        aria-label="Halaman berikutnya"
        disabled={meta.page >= pageCount}
        onClick={() => onPageChange(meta.page + 1)}
      >
        <ChevronRight size={18} />
      </ArrowButton>
    </Footer>
  );
}

const ScrollArea = styled.div`
  overflow-x: auto;
  border-radius: 16px;
`;

const Table = styled.table`
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  table-layout: fixed;
`;

const Th = styled.th<{ $height: number }>`
  box-sizing: border-box;
  height: ${(p) => p.$height}px;
  padding: 8px 12px;
  background: #ffffff;
  text-align: center;
  vertical-align: middle;
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  color: #09275f;
`;

const SortButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  max-width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  font: inherit;
  color: inherit;
  text-align: center;
  cursor: pointer;
`;

const SortIcon = styled.span<{ $active: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  color: ${(p) => (p.$active ? "#175fe2" : "#9ca3af")};
`;

const Tr = styled.tr<{ $odd: boolean }>`
  height: 50px;
  background: ${(p) => (p.$odd ? "#f6f8f7" : "#ffffff")};
  border-bottom: 1px solid #ecefed;
`;

const Td = styled.td`
  box-sizing: border-box;
  height: 50px;
  padding: 10px 12px;
  text-align: center;
  vertical-align: middle;
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #1d2520;
`;

const EmptyCell = styled.td`
  padding: 40px 12px;
  text-align: center;
  font-family: var(--font-body), sans-serif;
  font-size: 14px;
  color: #6d717f;
`;

// Mobile: grid 2 kolom — baris 1 [page size | "Menampilkan..."], baris 2
// [panah kiri | panah kanan]. Desktop: satu baris flex.
const Footer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  row-gap: 16px;
  column-gap: 12px;

  & > :nth-child(2) {
    justify-self: end;
  }

  & > :nth-child(4) {
    justify-self: end;
  }

  ${media.desktop} {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
`;

const PageSizeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FooterLabel = styled.span`
  font-family: var(--font-caption), sans-serif;
  font-size: 12px;
  color: #6d717f;
`;

/* Lebar mengikuti isi (min 51px sesuai Figma): 51px tetap cuma menyisakan
 * 32px untuk angka + gap + chevron 16px (34px) sehingga angka terpotong. */
const PageSizeTrigger = styled(SelectTrigger)`
  width: auto;
  min-width: 51px;
  flex-shrink: 0;
  height: 24px;
  padding: 4px 8px;
  gap: 4px;
  background: #f9fafb;
  border: 1.5px solid #e5e7ea;
  border-radius: 12px;
  font-family: var(--font-caption), sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #131927;
`;

const ArrowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: none;
  background: transparent;
  padding: 0;
  color: #6d717f;
  cursor: pointer;

  &:disabled {
    color: #d2d5db;
    cursor: default;
    pointer-events: none;
  }
`;
