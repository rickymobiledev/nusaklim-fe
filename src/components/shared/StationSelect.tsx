"use client";

import styled from "styled-components";
import { useStations } from "@/hooks/use-stations";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.xs};
`;

export function StationSelect({
  value,
  onChange,
}: {
  value?: string;
  onChange: (stationId: string) => void;
}) {
  const { data: stationsResponse, isLoading } = useStations();
  const stations = stationsResponse?.data;

  return (
    <Field>
      <Label htmlFor="station-select">Stasiun</Label>
      <Select value={value} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger id="station-select" className="w-[220px]">
          <SelectValue placeholder={isLoading ? "Memuat stasiun..." : "Pilih Stasiun"} />
        </SelectTrigger>
        <SelectContent>
          {stations?.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.nama}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
