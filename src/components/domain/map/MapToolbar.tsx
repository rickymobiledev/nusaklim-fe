"use client";

import styled from "styled-components";
import { Printer, Maximize, Minimize } from "lucide-react";
import { DownloadFormatMenu } from "@/components/shared/DownloadFormatMenu";
import { ALL_FORMATS, type ExportFormat } from "@/lib/export";
import { MAP_EXPORT_IGNORE_ATTR } from "@/lib/map-image";

export function MapToolbar({
  isFullscreen,
  onPrint,
  onToggleFullscreen,
  onDownload,
}: {
  isFullscreen: boolean;
  onPrint: () => void;
  onToggleFullscreen: () => void;
  onDownload: (format: ExportFormat) => void;
}) {
  return (
    <Row {...{ [MAP_EXPORT_IGNORE_ATTR]: "" }}>
      <IconButton type="button" title="Cetak" onClick={onPrint}>
        <Printer size={18} strokeWidth={1.5} color="#6d717f" />
      </IconButton>
      <IconButton
        type="button"
        title={isFullscreen ? "Keluar layar penuh" : "Perbesar layar penuh"}
        onClick={onToggleFullscreen}
      >
        {isFullscreen ? (
          <Minimize size={18} strokeWidth={1.5} color="#6d717f" />
        ) : (
          <Maximize size={18} strokeWidth={1.5} color="#6d717f" />
        )}
      </IconButton>
      <DownloadFormatMenu
        variant="toolbar"
        label="Unduh"
        formats={ALL_FORMATS}
        onSelect={onDownload}
      />
    </Row>
  );
}

const Row = styled.div`
  position: absolute;
  left: 25px;
  top: 24px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(41.5px);
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.85);
  }
`;
