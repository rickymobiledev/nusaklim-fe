"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { useStations } from "@/hooks/use-stations";
import { useWaterDeficit } from "@/hooks/use-water-deficit";
import { useDrySpellMap } from "@/hooks/use-dry-spell-map";
import { useRainfallToday } from "@/hooks/use-rainfall-today";
import { Skeleton } from "@/components/ui/skeleton";
import { MapTabs, type MapTab } from "./MapTabs";
import { StationInfoCard } from "./StationInfoCard";
import { DynamicStationMap } from "./dynamic-station-map";
import { DynamicWaterDeficitMap } from "./dynamic-water-deficit-map";
import { WaterDeficitPanel } from "./WaterDeficitPanel";
import { DynamicDrySpellMap } from "./dynamic-dry-spell-map";
import { DrySpellPanel } from "./DrySpellPanel";
import { DynamicRainfallTodayMap } from "./dynamic-rainfall-today-map";
import { RainfallTodayPanel } from "./RainfallTodayPanel";

export function MapSection() {
  const { data: stationsResponse, isLoading } = useStations();
  const stations = useMemo(() => stationsResponse?.data ?? [], [stationsResponse]);

  const { data: waterDeficitRows = [], isLoading: isWaterDeficitLoading } =
    useWaterDeficit();

  const { data: drySpellRows = [], isLoading: isDrySpellLoading } = useDrySpellMap();

  const { data: rainfallTodayRows = [], isLoading: isRainfallTodayLoading } =
    useRainfallToday();

  const [activeTab, setActiveTab] = useState<MapTab>("status-stasiun");
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

  return (
    <Wrapper>
      <MapTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "status-stasiun" ? (
        isLoading ? (
          <Wrapper>
            <Skeleton className="h-140 w-full rounded-[20px]" />
            <Skeleton className="h-96 w-full rounded-[16px]" />
          </Wrapper>
        ) : (
          <Wrapper>
            <DynamicStationMap
              stations={stations}
              selectedStationId={selectedStationId}
              onSelectStation={setSelectedStationId}
            />

            <StationInfoCard
              stations={stations}
              selectedStationId={selectedStationId}
              onSelectStation={setSelectedStationId}
            />
          </Wrapper>
        )
      ) : activeTab === "keseimbangan-air" ? (
        isWaterDeficitLoading ? (
          <Wrapper>
            <Skeleton className="h-140 w-full rounded-[20px]" />
            <Skeleton className="h-96 w-full rounded-[16px]" />
          </Wrapper>
        ) : (
          <Wrapper>
            <DynamicWaterDeficitMap rows={waterDeficitRows} />

            <WaterDeficitPanel rows={waterDeficitRows} />
          </Wrapper>
        )
      ) : activeTab === "dry-spell" ? (
        isDrySpellLoading ? (
          <Wrapper>
            <Skeleton className="h-140 w-full rounded-[20px]" />
            <Skeleton className="h-96 w-full rounded-[16px]" />
          </Wrapper>
        ) : (
          <Wrapper>
            <DynamicDrySpellMap rows={drySpellRows} />

            <DrySpellPanel rows={drySpellRows} />
          </Wrapper>
        )
      ) : isRainfallTodayLoading ? (
        <Wrapper>
          <Skeleton className="h-140 w-full rounded-[20px]" />
          <Skeleton className="h-96 w-full rounded-[16px]" />
        </Wrapper>
      ) : (
        <Wrapper>
          <DynamicRainfallTodayMap rows={rainfallTodayRows} />

          <RainfallTodayPanel rows={rainfallTodayRows} />
        </Wrapper>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
