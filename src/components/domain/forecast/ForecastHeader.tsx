"use client";

import styled from "styled-components";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { media } from "@/lib/breakpoints";
import type { Station } from "@/types/domain";

export function ForecastHeader({
  stations,
  isLoadingStations,
  stationId,
  onStationIdChange,
}: {
  stations: Station[];
  isLoadingStations: boolean;
  stationId?: string;
  onStationIdChange: (stationId: string) => void;
}) {
  return (
    <Row>
      <TitleBlock>
        <Title>Ramalan Cuaca</Title>
        <Subtitle>Grafik prediksi paramter cuaca harian untuk 7 hari ke depan</Subtitle>
      </TitleBlock>

      <Field>
        <FieldLabel htmlFor="forecast-station">Pilih Stasiun</FieldLabel>
        <Select
          value={stationId}
          onValueChange={onStationIdChange}
          disabled={isLoadingStations}
        >
          <StationTrigger id="forecast-station" aria-label="Pilih Stasiun">
            <TriggerContent>
              <MapPin size={24} strokeWidth={1.5} color="#175FE2" />
              <SelectValue
                placeholder={isLoadingStations ? "Memuat stasiun..." : "Pilih Stasiun"}
              />
            </TriggerContent>
          </StationTrigger>
          <SelectContent>
            {stations.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
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

const StationTrigger = styled(SelectTrigger)`
  width: 100%;
  height: 48px;
  padding: 12px;
  background: #ffffff;
  border: 1.5px solid #d6dcd8;
  border-radius: 12px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #1d2520;

  ${media.desktop} {
    width: 291px;
  }

  & svg:last-child {
    color: #8b9c90;
  }
`;

const TriggerContent = styled.span`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;
