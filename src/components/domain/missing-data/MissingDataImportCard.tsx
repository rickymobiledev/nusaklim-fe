"use client";

import { useRef, useState } from "react";
import styled from "styled-components";
import { toast } from "sonner";
import {
  ImportIcon,
  InfoEmptyIcon,
  SubmitDocumentIcon,
} from "@/components/shared/DashboardIcons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useImportMissingData } from "@/hooks/use-missing-data";
import { media } from "@/lib/breakpoints";
import { IMPORT_FILE_EXTENSIONS, validateImportFile } from "@/lib/missing-data-import";

/** Kartu "Import File" (Figma "Frame 98") — pilih file Excel (.xlsx/.xls,
 *  maks 5 MB) lalu Import. Link "Unduh template" disabled sampai URL
 *  template dari BE ada. */
export function MissingDataImportCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const importMutation = useImportMissingData();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = event.target.files?.[0];
    // Reset supaya memilih file yang sama dua kali tetap memicu onChange.
    event.target.value = "";
    if (!picked) return;

    const invalid = validateImportFile(picked);
    if (invalid) {
      toast.error(invalid);
      return;
    }
    setFile(picked);
  }

  function handleImport() {
    if (!file) return;
    importMutation.mutate(file, { onSuccess: () => setFile(null) });
  }

  return (
    <Card>
      <Info>
        <TitleRow>
          <Title>Import File</Title>
          <Popover>
            <PopoverTrigger asChild>
              <InfoButton type="button" aria-label="Informasi import file">
                <InfoEmptyIcon size={16} color="#9EA2AE" />
              </InfoButton>
            </PopoverTrigger>
            <TooltipContent side="bottom" align="start">
              Unggah file excel untuk memperbaiki data yang hilang
            </TooltipContent>
          </Popover>
        </TitleRow>
        <Hint>
          {file
            ? `File dipilih: ${file.name}`
            : "Format File : .xlsx, .xls (Maksimal Size 5 MB)"}
        </Hint>
        <TemplateLink
          type="button"
          disabled
          title="Template belum tersedia"
          aria-label="Unduh template file import data (belum tersedia)"
        >
          <ImportIcon size={20} color="#175FE2" />
          Unduh template file import data
        </TemplateLink>
      </Info>

      <Actions>
        <input
          ref={inputRef}
          type="file"
          accept={IMPORT_FILE_EXTENSIONS.join(",")}
          hidden
          onChange={handleFileChange}
        />
        <OutlineButton type="button" onClick={() => inputRef.current?.click()}>
          <SubmitDocumentIcon size={24} color="#175FE2" />
          Pilih File
        </OutlineButton>
        <SolidButton
          type="button"
          onClick={handleImport}
          disabled={!file || importMutation.isPending}
        >
          <ImportIcon size={24} color="#FFFFFF" />
          {importMutation.isPending ? "Mengimpor..." : "Import"}
        </SolidButton>
      </Actions>
    </Card>
  );
}

const Card = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #d6dcd8;
  border-radius: 16px;
  box-shadow:
    0px 6px 14px -6px rgba(19, 25, 39, 0.12),
    0px 10px 32px -4px rgba(19, 25, 39, 0.1);

  ${media.desktop} {
    flex: 2 1 0;
    min-width: 0;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-width: 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Title = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  color: #1d2520;
`;

const InfoButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;

const TooltipContent = styled(PopoverContent)`
  width: auto;
  max-width: 260px;
  padding: 8px 12px;
  background: #ffffff;
  border: none;
  border-radius: 12px;
  box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.25);
  font-family: var(--font-body), sans-serif;
  font-size: 13px;
  line-height: 20px;
  color: #175fe2;
`;

const Hint = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 13px;
  line-height: 20px;
  color: #667a6c;
  overflow-wrap: anywhere;
`;

const TemplateLink = styled.button`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 4px;
  padding: 0;
  border: none;
  background: transparent;
  font-family: var(--font-body), sans-serif;
  font-size: 13px;
  line-height: 20px;
  color: #175fe2;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Actions = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  gap: 8px;
`;

const buttonBase = `
  display: flex;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 48px;
  padding: 14px 20px;
  border-radius: 12px;
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
`;

const OutlineButton = styled.button`
  ${buttonBase}
  min-width: 142px;
  color: #175fe2;
  background: #ffffff;
  border: 1.5px solid #8db5ff;

  &:hover {
    background: #eff5ff;
  }
`;

const SolidButton = styled.button`
  ${buttonBase}
  min-width: 133px;
  color: #ffffff;
  background: #175fe2;
  border: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
