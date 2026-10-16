"use client";

import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { Download } from "lucide-react";
import { EXPORT_FORMAT_LABEL, type ExportFormat } from "@/lib/export";

/** Tombol "Unduh Data" yang membuka daftar format (CSV/XLSX, plus PNG/SVG
 *  kalau ada grafik/peta) — klik satu format langsung memicu unduhan.
 *  Dropdown-nya dirender INLINE (bukan portal Radix) supaya tetap tampil
 *  saat dipakai di dalam elemen fullscreen (toolbar peta). */
export function DownloadFormatMenu<F extends ExportFormat>({
  formats,
  onSelect,
  disabled,
  variant = "outline",
  label = "Unduh Data",
}: {
  formats: F[];
  onSelect: (format: F) => void;
  disabled?: boolean;
  variant?: "outline" | "toolbar";
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <Root ref={rootRef}>
      <Trigger
        type="button"
        $variant={variant}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Download size={variant === "toolbar" ? 18 : 20} strokeWidth={1.5} />
        {label}
      </Trigger>
      {open && (
        <List role="menu">
          {formats.map((format) => (
            <Item
              key={format}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onSelect(format);
              }}
            >
              {EXPORT_FORMAT_LABEL[format]}
            </Item>
          ))}
        </List>
      )}
    </Root>
  );
}

const Root = styled.div`
  position: relative;
  display: inline-flex;
`;

const Trigger = styled.button<{ $variant: "outline" | "toolbar" }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  font-family: var(--font-body), sans-serif;
  font-weight: 600;

  ${({ $variant }) =>
    $variant === "toolbar"
      ? css`
          gap: 6px;
          height: 32px;
          padding: 8px;
          background: #175fe2;
          border: none;
          border-radius: 8px;
          color: #ffffff;
          font-size: 12px;
          line-height: 16px;

          &:hover {
            background: #124bb8;
          }
        `
      : css`
          gap: 8px;
          height: 40px;
          padding: 12px 16px;
          background: #ffffff;
          border: 1.5px solid #175fe2;
          border-radius: 12px;
          color: #175fe2;
          font-size: 14px;

          &:hover {
            background: #eff5ff;
          }
        `}

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

const List = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  min-width: 120px;
  padding: 4px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.25);
`;

const Item = styled.button`
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-family: var(--font-body), sans-serif;
  font-size: 14px;
  color: #1d2520;

  &:hover {
    background: #f6f8f7;
  }
`;
