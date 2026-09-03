"use client";

import styled from "styled-components";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { mapDeviceStatus } from "@/lib/status";
import { media } from "@/lib/breakpoints";
import type { Station } from "@/types/domain";

/** Chip Aktif/Tidak Aktif di panel ini SENGAJA biru untuk Aktif (bukan hijau
 *  seperti `STATION_STATUS_BADGE`/legend/popup peta) — persis warna Figma
 *  untuk "Daftar Stasiun" (Blue/50+Blue/500), beda dari dot marker & legend
 *  yang tetap hijau/merah. Ini quirk visual Figma sendiri, diikuti apa
 *  adanya per elemen, bukan disamakan paksa. */
const CHIP_STYLE: Record<
  "aktif" | "tidak_aktif",
  { bg: string; border: string; text: string }
> = {
  aktif: { bg: "#E6F4FF", border: "#0095FF", text: "#0095FF" },
  tidak_aktif: { bg: "#FDECEC", border: "#EE443F", text: "#EE443F" },
};

export function MapStationList({
  stations,
  searchTerm,
  onSearchTermChange,
  selectedStationId,
  onSelectStation,
}: {
  stations: Station[];
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  selectedStationId: string | null;
  onSelectStation: (id: string) => void;
}) {
  const filtered = stations.filter((s) =>
    s.nama.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card>
      <Heading>Daftar Stasiun</Heading>

      <SearchWrap>
        <Input
          placeholder="Cari Stasiun"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pr-9"
        />
        <SearchIcon size={16} />
      </SearchWrap>

      <List>
        {filtered.map((s) => {
          const status = mapDeviceStatus(s.status);
          const chip = CHIP_STYLE[status];
          return (
            <StationCard
              key={s.id}
              type="button"
              $active={s.id === selectedStationId}
              onClick={() => onSelectStation(s.id)}
            >
              <StationName $active={status === "aktif"}>{s.nama}</StationName>
              <Chip $bg={chip.bg} $border={chip.border} $text={chip.text}>
                {status === "aktif" ? "Aktif" : "Tidak Aktif"}
              </Chip>
            </StationCard>
          );
        })}

        {filtered.length === 0 && <EmptyText>Stasiun tidak ditemukan.</EmptyText>}
      </List>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 20px;

  ${media.desktop} {
    width: 300px;
    height: 560px;
    flex-shrink: 0;
  }
`;

const Heading = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #000000;
`;

const SearchWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  right: 12px;
  color: #8b9c90;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  min-height: 0;
`;

const StationCard = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 16px;
  background: "#EFF5FF";
  border: 1px solid #e5e7ea;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition:
    background-color 0.15s,
    border-color 0.15s;
  box-sizing: border-box;
  flex-direction: row;

  &:hover {
    background: #f9fafb;
  }
`;

const StationName = styled.span<{ $active: boolean }>`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  line-height: 16px;
  color: ${(p) => (p.$active ? "#1d2520" : "#667a6c")};
`;

const Chip = styled.span<{ $bg: string; $border: string; $text: string }>`
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 16px;
  border-radius: 100px;
  background: ${(p) => p.$bg};
  border: 1.5px solid ${(p) => p.$border};
  color: ${(p) => p.$text};
  font-family: var(--font-body), sans-serif;
  font-size: 10px;
  font-weight: 600;
  line-height: 12px;
  white-space: nowrap;
`;

const EmptyText = styled.p`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  color: #8b9c90;
  text-align: center;
  padding: 16px 0;
`;
