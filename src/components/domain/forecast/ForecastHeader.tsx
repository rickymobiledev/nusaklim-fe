"use client";

import styled from "styled-components";
import { MapPin } from "lucide-react";
import { StationSearchSelect } from "@/components/shared/StationSearchSelect";
import { media } from "@/lib/breakpoints";
import type { Station } from "@/types/domain";
import type { ForecastModel } from "@/types/forecast";
import { ForecastModelTabs } from "./ForecastModelTabs";

export function ForecastHeader({
  stations,
  isLoadingStations,
  stationId,
  onStationIdChange,
  model,
  onModelChange,
}: {
  stations: Station[];
  isLoadingStations: boolean;
  stationId?: string;
  onStationIdChange: (stationId: string) => void;
  model: ForecastModel;
  onModelChange: (model: ForecastModel) => void;
}) {
  return (
    <Row>
      <TitleBlock>
        <Title>Ramalan Cuaca</Title>
        <Subtitle>Grafik prediksi parameter cuaca harian untuk 7 hari ke depan</Subtitle>
      </TitleBlock>

      <Controls>
        <ForecastModelTabs active={model} onChange={onModelChange} />
        <Field>
          <FieldLabel htmlFor="forecast-station">Pilih Stasiun</FieldLabel>
          <StationSearchSelect
            id="forecast-station"
            variant="outlined"
            icon={<MapPin size={24} strokeWidth={1.5} color="#175FE2" />}
            stations={stations}
            value={stationId}
            onChange={onStationIdChange}
            isLoading={isLoadingStations}
          />
        </Field>
      </Controls>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;

  ${media.desktop} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  font-family: var(--font-manrope), sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  color: #000000;
`;

const Subtitle = styled.p`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #667a6c;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;

  ${media.desktop} {
    flex-direction: row;
    align-items: flex-start;
    gap: 24px;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;

  ${media.desktop} {
    flex-direction: row;
    align-items: center;
  }
`;

const FieldLabel = styled.label`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #1d2520;
`;
