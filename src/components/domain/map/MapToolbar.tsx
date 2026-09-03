"use client";

import styled from "styled-components";
import { Printer, Maximize, Minimize, Download } from "lucide-react";

export function MapToolbar({
  isFullscreen,
  onPrint,
  onToggleFullscreen,
  onDownload,
}: {
  isFullscreen: boolean;
  onPrint: () => void;
  onToggleFullscreen: () => void;
  onDownload: () => void;
}) {
  return (
    <Row>
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
      <DownloadButton type="button" onClick={onDownload}>
        <Download size={18} strokeWidth={1.5} />
        Unduh
      </DownloadButton>
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

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 8px;
  background: #175fe2;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #ffffff;
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;

  &:hover {
    background: #124bb8;
  }
`;
