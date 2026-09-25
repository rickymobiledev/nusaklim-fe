"use client";

import styled from "styled-components";
import { ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";

type Props = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

/** Pagination angka ala Figma: « 1 2 3 4 … N ». Halaman ≤ 6 tampil semua;
 *  lebih dari itu → 4 halaman awal (bergeser mengikuti halaman aktif),
 *  elipsis, halaman terakhir. */
export function NewsPagination({ page, pageCount, onPageChange }: Props) {
  if (pageCount <= 1) return null;

  const items = buildItems(page, pageCount);

  return (
    <Nav aria-label="Pagination berita">
      <Control
        type="button"
        aria-label="Halaman pertama"
        disabled={page === 1}
        onClick={() => onPageChange(1)}
      >
        <ChevronsLeftIcon size={16} />
      </Control>
      {items.map((item, index) =>
        item === "gap" ? (
          <Gap key={`gap-${index}`}>…</Gap>
        ) : (
          <PageButton
            key={item}
            type="button"
            $active={item === page}
            aria-current={item === page ? "page" : undefined}
            onClick={() => onPageChange(item)}
          >
            {item}
          </PageButton>
        ),
      )}
      <Control
        type="button"
        aria-label="Halaman terakhir"
        disabled={page === pageCount}
        onClick={() => onPageChange(pageCount)}
      >
        <ChevronsRightIcon size={16} />
      </Control>
    </Nav>
  );
}

function buildItems(page: number, pageCount: number): Array<number | "gap"> {
  if (pageCount <= 6) return Array.from({ length: pageCount }, (_, i) => i + 1);

  const start = Math.min(Math.max(page - 1, 1), pageCount - 4);
  const window = [start, start + 1, start + 2, start + 3];
  const items: Array<number | "gap"> = [];
  if (start > 1) items.push(1, "gap");
  items.push(...window.filter((n) => n < pageCount));
  if (window[window.length - 1] < pageCount - 1) items.push("gap");
  items.push(pageCount);
  return items;
}

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 0;
`;

const buttonBase = `
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
`;

const Control = styled.button`
  ${buttonBase}
  background: #ffffff;
  border: 1px solid #f1f1f1;
  color: #455249;

  &:disabled {
    color: #b7c2bb;
    cursor: not-allowed;
  }
`;

const PageButton = styled.button<{ $active: boolean }>`
  ${buttonBase}
  background: ${({ $active }) => ($active ? "#175fe2" : "#ffffff")};
  border: ${({ $active }) => ($active ? "none" : "1px solid #f1f1f1")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#333333")};
`;

const Gap = styled.span`
  ${buttonBase}
  color: #333333;
`;
