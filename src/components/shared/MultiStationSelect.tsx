"use client";

import { useState } from "react";
import styled from "styled-components";
import { X, ChevronDown, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import type { Station } from "@/types/domain";

const MAX_VISIBLE_CHIPS = 2;

export function MultiStationSelect({
  stations,
  selectedIds,
  onChange,
  isLoading = false,
}: {
  stations: Station[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  isLoading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selected = stations.filter((s) => selectedIds.includes(s.id));
  const visible = selected.slice(0, MAX_VISIBLE_CHIPS);
  const overflowCount = selected.length - visible.length;

  const filteredStations = stations.filter((s) =>
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const allFilteredSelected =
    filteredStations.length > 0 &&
    filteredStations.every((s) => selectedIds.includes(s.id));

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) setSearchTerm("");
  }

  function toggleStation(id: string) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : [...selectedIds, id],
    );
  }

  function toggleAllFiltered() {
    const filteredIds = filteredStations.map((s) => s.id);
    onChange(
      allFilteredSelected
        ? selectedIds.filter((id) => !filteredIds.includes(id))
        : [...selectedIds, ...filteredIds.filter((id) => !selectedIds.includes(id))],
    );
  }

  function removeStation(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    onChange(selectedIds.filter((s) => s !== id));
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Trigger role="button" tabIndex={0}>
          {visible.length === 0 ? (
            <Placeholder>{isLoading ? "Memuat stasiun..." : "Pilih Stasiun"}</Placeholder>
          ) : (
            <Chips>
              {visible.map((s) => (
                <Chip key={s.id}>
                  {s.nama}
                  <RemoveButton
                    onClick={(e) => removeStation(e, s.id)}
                    aria-label={`Hapus ${s.nama}`}
                  >
                    <X size={12} strokeWidth={2} />
                  </RemoveButton>
                </Chip>
              ))}
              {overflowCount > 0 && <OverflowChip>+{overflowCount}</OverflowChip>}
            </Chips>
          )}
          <ChevronDown size={20} color="#9EA2AE" />
        </Trigger>
      </PopoverTrigger>
      <MenuContent align="start">
        <HeaderSection>
          <SearchBox>
            <Search size={24} color="#8B9C90" />
            <SearchInput
              type="text"
              placeholder="Cari Stasiun"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </SearchBox>

          <CheckboxRow onClick={toggleAllFiltered}>
            <Checkbox
              checked={allFilteredSelected}
              onCheckedChange={toggleAllFiltered}
              onClick={(e) => e.stopPropagation()}
            />
            <CheckboxLabel>Pilih Semua Stasiun</CheckboxLabel>
          </CheckboxRow>
        </HeaderSection>

        <Divider />

        <List>
          {filteredStations.map((s) => (
            <CheckboxRow key={s.id} onClick={() => toggleStation(s.id)}>
              <Checkbox
                checked={selectedIds.includes(s.id)}
                onCheckedChange={() => toggleStation(s.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <CheckboxLabel>{s.nama}</CheckboxLabel>
            </CheckboxRow>
          ))}
        </List>
      </MenuContent>
    </Popover>
  );
}

const Trigger = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 280px;
  padding: 12px;
  background: #ffffff;
  border: 1.5px solid #E5E7EA;
  border-radius: 12px;
  cursor: pointer;
  box-sizing: border-box;
  flex-direction: row;
`;

const Placeholder = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 14px;
  color: #8b9c90;
`;

const Chips = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
`;

const Chip = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #dce9ff;
  border: 1px solid #175fe2;
  border-radius: 50px;
  font-family: var(--font-caption), sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #131927;
  white-space: nowrap;
`;

const OverflowChip = styled(Chip)`
  background: #dce9ff;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b9c90;
`;

const MenuContent = styled(PopoverContent)`
  display: flex;
  flex-direction: column;
  width: 364px;
  padding: 0;
  background: #ffffff;
  border: none;
  border-radius: 16px;
  box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.25);
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 16px 8px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 12px;
  background: #ffffff;
  border: 1.5px solid #d6dcd8;
  border-radius: 12px;
  box-sizing: border-box;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #1d2520;

  &::placeholder {
    color: #8b9c90;
  }
`;

const Divider = styled.div`
  border-top: 1px solid #d6dcd8;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 16px;
  max-height: 256px;
  overflow-y: auto;
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
