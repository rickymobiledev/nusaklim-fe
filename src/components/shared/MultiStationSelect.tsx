"use client";

import { useState } from "react";
import styled from "styled-components";
import { X, ChevronDown } from "lucide-react";
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
  const selected = stations.filter((s) => selectedIds.includes(s.id));
  const visible = selected.slice(0, MAX_VISIBLE_CHIPS);
  const overflowCount = selected.length - visible.length;

  function toggleStation(id: string) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : [...selectedIds, id],
    );
  }

  function removeStation(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    onChange(selectedIds.filter((s) => s !== id));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
      <PopoverContent className="w-72 p-2" align="start">
        <List>
          {stations.map((s) => (
            <ListItem key={s.id} onClick={() => toggleStation(s.id)}>
              <Checkbox
                checked={selectedIds.includes(s.id)}
                onCheckedChange={() => toggleStation(s.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <ListItemLabel>{s.nama}</ListItemLabel>
            </ListItem>
          ))}
        </List>
      </PopoverContent>
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
  background: #f6f8f7;
  border: 1.5px solid #e5e7ea;
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

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 280px;
  overflow-y: auto;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f6f8f7;
  }
`;

const ListItemLabel = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 14px;
  color: #1d2520;
`;
