"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { useStations } from "@/hooks/use-stations";
import { useForecast } from "@/hooks/use-forecast";
import { DataState } from "@/components/shared/DataState";
import {
  findHeavyRainDay,
  getParameterUnit,
  type ForecastParameter,
} from "@/lib/forecast-display";
import { media } from "@/lib/breakpoints";
import { ForecastHeader } from "./ForecastHeader";
import { ForecastDayStrip } from "./ForecastDayStrip";
import { ForecastTodayPanel } from "./ForecastTodayPanel";
import { ForecastTrendChart } from "./ForecastTrendChart";
import { ForecastAlert } from "./ForecastAlert";
import { DynamicForecastMap } from "./dynamic-forecast-map";

export function ForecastSection() {
  const { data: stationsResponse, isLoading: isLoadingStations } = useStations();
  const stations = useMemo(() => stationsResponse?.data ?? [], [stationsResponse]);

  const [selectedStationId, setSelectedStationId] = useState<string>();
  const [selectedDate, setSelectedDate] = useState<string>();
  const [parameter, setParameter] = useState<ForecastParameter>("rainfall");

  // Auto-select stasiun PERTAMA begitu daftar termuat — derived value, bukan
  // useEffect+setState (ditolak lint `react-hooks/set-state-in-effect`),
  // pola sama Beranda/Water Balance.
  const stationId = selectedStationId ?? stations[0]?.id;

  const { data, isLoading, isError, error } = useForecast(stationId);
  // Panjang ikut array `forecast` apa adanya (horizon bisa berubah, jangan
  // hardcode 7). Tanggal terpilih yang tidak ada di data baru (ganti
  // stasiun) otomatis jatuh ke hari pertama.
  const days = useMemo(() => data?.forecast ?? [], [data]);
  const activeDay = days.find((d) => d.date === selectedDate) ?? days[0];
  const units = data?.units ?? {};

  function handleStationChange(id: string) {
    setSelectedStationId(id);
    setSelectedDate(undefined);
  }

  return (
    <Page>
      <ForecastHeader
        stations={stations}
        isLoadingStations={isLoadingStations}
        stationId={stationId}
        onStationIdChange={handleStationChange}
      />

      <DataState
        isLoading={isLoadingStations || (!!stationId && isLoading)}
        isError={isError}
        error={error}
        isEmpty={!data || !activeDay}
        emptyMessage="Pilih stasiun untuk melihat ramalan cuaca."
      >
        {data && activeDay && (
          <>
            <TopRow>
              <MapSlot>
                <DynamicForecastMap lat={data.latitude} long={data.longitude} />
              </MapSlot>
              <Left>
                <ForecastDayStrip
                  days={days}
                  activeDate={activeDay.date}
                  rainfallUnit={getParameterUnit("rainfall", units)}
                  onSelect={setSelectedDate}
                />
                <ForecastTodayPanel days={days} day={activeDay} units={units} />
              </Left>
            </TopRow>

            <ForecastTrendChart
              days={days}
              units={units}
              stationName={data.stationName}
              parameter={parameter}
              onParameterChange={setParameter}
            />

            <ForecastAlert day={findHeavyRainDay(days)} />
          </>
        )}
      </DataState>
    </Page>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* DOM order = urutan mobile (peta dulu, sesuai mockup); di desktop peta
 * dipindah ke kolom kanan lewat `grid-column`/`grid-row`. */
const TopRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${media.desktop} {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 366px;
    align-items: stretch;
  }
`;

const MapSlot = styled.div`
  min-width: 0;

  ${media.desktop} {
    grid-column: 2;
    grid-row: 1;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 16px;

  ${media.desktop} {
    grid-column: 1;
    grid-row: 1;
  }
`;
