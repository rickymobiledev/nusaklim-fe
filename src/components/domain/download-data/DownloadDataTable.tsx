"use client";

import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApiMeta } from "@/types/api";

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
}: {
  columns: ColumnDef<T>[];
  data: T[];
  emptyMessage?: string;
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
                <Th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
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
}: {
  meta?: ApiMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
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

      <FooterLabel>
        {meta.total > 0
          ? `Menampilkan ${rangeStart}-${rangeEnd} dari ${meta.total} data`
          : "Tidak ada data"}
      </FooterLabel>

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

const Th = styled.th`
  box-sizing: border-box;
  height: 88px;
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

const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
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

const PageSizeTrigger = styled(SelectTrigger)`
  width: 51px;
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
