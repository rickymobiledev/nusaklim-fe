"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { useStations } from "@/hooks/use-stations";
import { Skeleton } from "@/components/ui/skeleton";
import { media } from "@/lib/breakpoints";
import { MapTabs, type MapTab } from "./MapTabs";
import { ComingSoonCard } from "./ComingSoonCard";
import { MapStationList } from "./MapStationList";
import { DynamicStationMap } from "./dynamic-station-map";

const COMING_SOON_LABEL: Record<Exclude<MapTab, "status-stasiun">, string> = {
  "keseimbangan-air": "Keseimbangan Air",
  "dry-spell": "Deret Terpanjang Hari Tidak Hujan",
  "curah-hujan-hari-ini": "Curah Hujan Hari Ini",
};

export function MapSection() {
  const { data: stationsResponse, isLoading } = useStations();
  const stations = useMemo(() => stationsResponse?.data ?? [], [stationsResponse]);

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
              <Skeleton className="h-[560px] w-full rounded-[20px]" />
            </MapColumn>
            <Skeleton className="h-[560px] w-full shrink-0 rounded-[20px] xl:w-[300px]" />
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
