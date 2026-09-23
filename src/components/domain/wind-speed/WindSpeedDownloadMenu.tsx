"use client";

import { useState } from "react";
import styled from "styled-components";
import { Download } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import type { Station } from "@/types/domain";

export function WindSpeedDownloadMenu({
  stations,
  onDownload,
  disabled,
}: {
  stations: Station[];
  onDownload: (stationIds: string[]) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) setCheckedIds([]);
  }

  function toggleStation(id: string) {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  const allChecked = stations.length > 0 && checkedIds.length === stations.length;

  function toggleAll() {
    setCheckedIds(allChecked ? [] : stations.map((s) => s.id));
  }

  function handleSubmit() {
    onDownload(checkedIds);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Trigger type="button" disabled={disabled}>
          <Download size={24} />
          Unduh Data
        </Trigger>
      </PopoverTrigger>
      <DownloadMenuContent align="end">
        <SelectAllSection>
          <CheckboxRow onClick={toggleAll}>
            <Checkbox
              checked={allChecked}
              onCheckedChange={toggleAll}
              onClick={(e) => e.stopPropagation()}
            />
            <CheckboxLabel>Pilih Semua</CheckboxLabel>
          </CheckboxRow>
        </SelectAllSection>

        <Divider />

        <StationListSection>
          {stations.map((s) => (
            <CheckboxRow key={s.id} onClick={() => toggleStation(s.id)}>
              <Checkbox
                checked={checkedIds.includes(s.id)}
                onCheckedChange={() => toggleStation(s.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <CheckboxLabel>{s.nama}</CheckboxLabel>
            </CheckboxRow>
          ))}
        </StationListSection>

        <Divider />

        <SubmitSection>
          <SubmitButton
            type="button"
            disabled={checkedIds.length === 0}
            onClick={handleSubmit}
          >
            Unduh Data
          </SubmitButton>
        </SubmitSection>
      </DownloadMenuContent>
    </Popover>
  );
}

const Trigger = styled.button`
  color: #175fe2;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  gap: 8px;

  background: #ffffff;
  border: 1.5px solid #175fe2;
  border-radius: 12px;

  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  text-align: center;

  &:hover {
    background: #eff5ff;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

const DownloadMenuContent = styled(PopoverContent)`
  display: flex;
  flex-direction: column;
  width: 297px;
  padding: 0;
  background: #ffffff;
  border: none;
  border-radius: 16px;
  box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.25);
`;

const SelectAllSection = styled.div`
  padding: 16px 16px 8px;
`;

const StationListSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 16px;
  max-height: 256px;
  overflow-y: auto;
`;

const SubmitSection = styled.div`
  padding: 16px;
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f6f8f7;
  }
`;

const CheckboxLabel = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #1d2520;
`;

const Divider = styled.div`
  border-top: 1px solid #d6dcd8;
`;

const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 12px 16px;

  background: #175fe2;
  border-radius: 12px;

  font-family: var(--font-body), sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;
