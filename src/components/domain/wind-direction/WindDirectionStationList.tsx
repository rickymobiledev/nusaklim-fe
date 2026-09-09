"use client";

import styled from "styled-components";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getLatestValue } from "@/lib/wind-direction-chart-utils";

interface StationSeries {
  stationId: string;
  stationName: string;
  color: string;
  points: { date: string; value: number | null }[];
}

export function WindDirectionStationList({
  series,
  searchTerm,
  onSearchTermChange,
}: {
  series: StationSeries[];
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
}) {
  const filtered = series.filter((s) =>
    s.stationName.toLowerCase().includes(searchTerm.toLowerCase()),
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
          const latest = getLatestValue(s.points);
          return (
            <StationCard key={s.stationId}>
              <StationHeader>
                <Stripe $color={s.color} />
                <StationName>{s.stationName}</StationName>
              </StationHeader>

              <TodayRow>
                <TodayLabel>Arah Mata Angin Hari Ini</TodayLabel>
                <TodayValue>{latest ?? "--"}</TodayValue>
              </TodayRow>
            </StationCard>
          );
        })}
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

  @media (min-width: 1280px) {
    width: 260px;
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
`;

const StationCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border: 1px solid #e5e7ea;
  border-radius: 8px;
`;

const StationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Stripe = styled.span<{ $color: string }>`
  width: 4px;
  height: 18px;
  border-radius: 50px;
  background: ${(p) => p.$color};
  flex-shrink: 0;
`;

const StationName = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  color: #1d2520;
`;

const TodayRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: #eff5ff;
  border: 1px solid #dce9ff;
  border-radius: 8px;

  box-sizing: border-box;

  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
`;

const TodayLabel = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  color: #6d717f;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
`;

const TodayValue = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #175fe2;

  line-height: 16px;
`;
