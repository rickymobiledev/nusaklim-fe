"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { useStations } from "@/hooks/use-stations";
import { useWaterDeficit } from "@/hooks/use-water-deficit";
import { useWaterDeficitComparison } from "@/hooks/use-water-deficit-comparison";
import { useDrySpellMap } from "@/hooks/use-dry-spell-map";
import { Skeleton } from "@/components/ui/skeleton";
import { media } from "@/lib/breakpoints";
import { MapTabs, type MapTab } from "./MapTabs";
import { ComingSoonCard } from "./ComingSoonCard";
import { MapStationList } from "./MapStationList";
import { DynamicStationMap } from "./dynamic-station-map";
import { DynamicWaterDeficitMap } from "./dynamic-water-deficit-map";
import { WaterDeficitPanel } from "./WaterDeficitPanel";
import { DynamicDrySpellMap } from "./dynamic-dry-spell-map";
import { DrySpellPanel } from "./DrySpellPanel";

const COMING_SOON_LABEL: Record<
  Exclude<MapTab, "status-stasiun" | "keseimbangan-air" | "dry-spell">,
  string
> = {
  "curah-hujan-hari-ini": "Curah Hujan Hari Ini",
};

export function MapSection() {
  const { data: stationsResponse, isLoading } = useStations();
  const stations = useMemo(() => stationsResponse?.data ?? [], [stationsResponse]);

  const { data: waterDeficitRows = [], isLoading: isWaterDeficitLoading } =
    useWaterDeficit();
  // TODO: panel "Perbandingan Defisit Air" masih mock, beda sumber dari
  // peta di atas — lihat catatan di use-water-deficit-comparison.ts.
  const { data: waterDeficitComparisonRows = [], isLoading: isComparisonLoading } =
    useWaterDeficitComparison();

  const { data: drySpellRows = [], isLoading: isDrySpellLoading } = useDrySpellMap();

  const [activeTab, setActiveTab] = useState<MapTab>("status-stasiun");
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Wrapper>
      <MapTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "status-stasiun" ? (
        isLoading ? (
          <ContentRow>
            <MapColumn>
              <Skeleton className="h-140 w-full rounded-[20px]" />
            </MapColumn>
            <Skeleton className="h-140 xl:w-75 w-full shrink-0 rounded-[20px]" />
          </ContentRow>
        ) : (
          <ContentRow>
            <MapColumn>
              <DynamicStationMap
                stations={stations}
                selectedStationId={selectedStationId}
                onSelectStation={setSelectedStationId}
              />
            </MapColumn>

            <MapStationList
              stations={stations}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              selectedStationId={selectedStationId}
              onSelectStation={setSelectedStationId}
            />
          </ContentRow>
        )
      ) : activeTab === "keseimbangan-air" ? (
        isWaterDeficitLoading || isComparisonLoading ? (
          <ContentRow>
            <MapColumn>
              <Skeleton className="h-140 w-full rounded-[20px]" />
            </MapColumn>
            <Skeleton className="h-140 xl:w-75 w-full shrink-0 rounded-[20px]" />
          </ContentRow>
        ) : (
          <ContentRow>
            <MapColumn>
              <DynamicWaterDeficitMap rows={waterDeficitRows} />
            </MapColumn>

            <WaterDeficitPanel rows={waterDeficitComparisonRows} />
          </ContentRow>
        )
      ) : activeTab === "dry-spell" ? (
        isDrySpellLoading ? (
          <ContentRow>
            <MapColumn>
              <Skeleton className="h-140 w-full rounded-[20px]" />
            </MapColumn>
            <Skeleton className="h-140 xl:w-75 w-full shrink-0 rounded-[20px]" />
          </ContentRow>
        ) : (
          <ContentRow>
            <MapColumn>
              <DynamicDrySpellMap rows={drySpellRows} />
            </MapColumn>

            <DrySpellPanel rows={drySpellRows} />
          </ContentRow>
        )
      ) : (
        <ComingSoonCard label={COMING_SOON_LABEL[activeTab]} />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ContentRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${media.desktop} {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const MapColumn = styled.div`
  min-width: 0;
  flex: 1;
`;
