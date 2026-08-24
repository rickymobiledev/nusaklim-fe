"use client";

import styled from "styled-components";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { ApiMeta } from "@/types/api";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.sm};
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${(p) => p.theme.spacing.sm};
  padding-top: ${(p) => p.theme.spacing.xs};
`;

const PageInfo = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.neutral[500]};
`;

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  emptyMessage?: string;
  /** Kalau disediakan bareng `onPageChange`, DataTable render kontrol
   *  pagination bawaan (dari kontrak types/api.ts). */
  meta?: ApiMeta;
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  columns,
  data,
  emptyMessage = "Data Tidak Tersedia",
  meta,
  onPageChange,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const pageCount = meta ? Math.max(1, Math.ceil(meta.total / meta.pageSize)) : undefined;
  const showPagination = !!(meta && onPageChange && pageCount && pageCount > 1);

  return (
    <Wrapper>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="tabular-data">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-muted-foreground py-10 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {showPagination && (
        <Pagination>
          <PageInfo>
            Halaman {meta.page} dari {pageCount}
          </PageInfo>
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page <= 1}
            onClick={() => onPageChange(meta.page - 1)}
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={meta.page >= pageCount}
            onClick={() => onPageChange(meta.page + 1)}
          >
            Berikutnya
          </Button>
        </Pagination>
      )}
    </Wrapper>
  );
}
