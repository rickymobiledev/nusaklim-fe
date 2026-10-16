"use client";

import styled from "styled-components";
import { EXPORT_FORMAT_LABEL, type ExportFormat } from "@/lib/export";

/** Pilihan format (chip bergaya segmented) untuk popover unduh yang
 *  masih butuh pilihan stasiun — dipakai menu unduh halaman chart. */
export function ExportFormatPicker({
  formats,
  value,
  onChange,
}: {
  formats: ExportFormat[];
  value: ExportFormat;
  onChange: (format: ExportFormat) => void;
}) {
  return (
    <Row role="radiogroup" aria-label="Format unduhan">
      {formats.map((format) => (
        <Chip
          key={format}
          type="button"
          role="radio"
          aria-checked={format === value}
          $active={format === value}
          onClick={() => onChange(format)}
        >
          {EXPORT_FORMAT_LABEL[format]}
        </Chip>
      ))}
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  gap: 8px;
`;

const Chip = styled.button<{ $active: boolean }>`
  flex: 1;
  height: 32px;
  border-radius: 8px;
  border: 1.5px solid ${({ $active }) => ($active ? "#175fe2" : "#d6dcd8")};
  background: ${({ $active }) => ($active ? "#eff5ff" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#175fe2" : "#1d2520")};
  font-family: var(--font-body), sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;
