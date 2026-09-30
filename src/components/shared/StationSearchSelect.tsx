"use client";

import { useState, type ReactNode } from "react";
import styled, { css } from "styled-components";
import { Check, ChevronDown, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { media } from "@/lib/breakpoints";
import type { Station } from "@/types/domain";

/** Pilih satu stasiun dengan kolom cari (filter `nama` stasiun, case-insensitive).
 *  Versi single-select dari `MultiStationSelect`.
 *  `variant`: "glass" (default, hero Beranda) atau "outlined" (putih + border,
 *  Ramalan Cuaca); `icon` = ikon opsional di kiri teks trigger. */
export function StationSearchSelect({
  stations,
  value,
  onChange,
  isLoading = false,
  id,
  variant = "glass",
  icon,
}: {
  stations: Station[];
  value?: string;
  onChange: (stationId: string) => void;
  isLoading?: boolean;
  id?: string;
  variant?: "glass" | "outlined";
  icon?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selected = stations.find((s) => s.id === value);

  const term = searchTerm.trim().toLowerCase();
  const filteredStations = term
    ? stations.filter(
        (s) =>
          s.nama.toLowerCase().includes(term) ||
          (s.companyName ?? "").toLowerCase().includes(term),
      )
    : stations;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) setSearchTerm("");
  }

  function select(stationId: string) {
    onChange(stationId);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Trigger id={id} type="button" disabled={isLoading} $variant={variant}>
          <TriggerContent>
            {icon}
            <TriggerText $placeholder={!selected}>
              {selected?.nama ?? (isLoading ? "Memuat stasiun..." : "Pilih Stasiun")}
            </TriggerText>
          </TriggerContent>
          <ChevronDown size={20} color={variant === "outlined" ? "#8b9c90" : "#667a6c"} />
        </Trigger>
      </PopoverTrigger>
      <MenuContent align="start">
        <SearchSection>
          <SearchBox>
            <Search size={20} color="#8B9C90" />
            <SearchInput
              type="text"
              placeholder="Cari Stasiun atau Kebun"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filteredStations.length > 0) {
                  e.preventDefault();
                  select(filteredStations[0].id);
                }
              }}
              autoFocus
            />
          </SearchBox>
        </SearchSection>

        <Divider />

        <List>
          {filteredStations.length === 0 ? (
            <EmptyText>Stasiun tidak ditemukan.</EmptyText>
          ) : (
            filteredStations.map((s) => (
              <Item
                key={s.id}
                type="button"
                $selected={s.id === value}
                onClick={() => select(s.id)}
              >
                <ItemText>
                  <ItemLabel>{s.nama}</ItemLabel>
                  {s.companyName && <ItemSubLabel>{s.companyName}</ItemSubLabel>}
                </ItemText>
                {s.id === value && <Check size={16} color="#175fe2" />}
              </Item>
            ))
          )}
        </List>
      </MenuContent>
    </Popover>
  );
}

const Trigger = styled.button<{ $variant: "glass" | "outlined" }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-sizing: border-box;
  height: 48px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;

  ${(p) =>
    p.$variant === "outlined"
      ? css`
          width: 100%;
          background: #ffffff;
          border: 1.5px solid #d6dcd8;

          ${media.desktop} {
            width: 291px;
          }
        `
      : css`
          width: 300px;
          max-width: 100%;
          background: rgba(255, 255, 255, 0.6);
          border: none;

          ${media.desktop} {
            width: 410px;
          }
        `}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const TriggerContent = styled.span`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const TriggerText = styled.span<{ $placeholder: boolean }>`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  color: ${(p) => (p.$placeholder ? "#8b9c90" : "#1d2520")};
`;

const MenuContent = styled(PopoverContent)`
  display: flex;
  flex-direction: column;
  width: max(var(--radix-popover-trigger-width), 300px);
  max-width: calc(100vw - 32px);
  padding: 0;
  background: #ffffff;
  border: none;
  border-radius: 16px;
  box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.25);
`;

const SearchSection = styled.div`
  padding: 12px 12px 8px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 44px;
  padding: 10px 12px;
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
  padding: 8px 12px 12px;
  max-height: 256px;
  overflow-y: auto;
`;

const Item = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: ${(p) => (p.$selected ? "#f6f8f7" : "transparent")};
  cursor: pointer;
  text-align: left;

  &:hover {
    background: #f6f8f7;
  }
`;

const ItemText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const ItemLabel = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #1d2520;
`;

/* Nama kebun (= `companyName`, diambil BE lewat company code). */
const ItemSubLabel = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #8b9c90;
`;

const EmptyText = styled.p`
  margin: 0;
  padding: 12px;
  font-family: var(--font-body), sans-serif;
  font-size: 14px;
  color: #8b9c90;
`;
