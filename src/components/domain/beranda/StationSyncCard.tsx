"use client";

import { format } from "date-fns";
import styled, { keyframes } from "styled-components";
import { useStations } from "@/hooks/use-stations";
import { media } from "@/lib/breakpoints";
import { RefreshDoubleIcon } from "@/components/shared/DashboardIcons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StationSyncCard({
  value,
  onChange,
}: {
  value?: string;
  onChange: (stationId: string) => void;
}) {
  const { data: stationsResponse, isLoading, isFetching, refetch } = useStations();
  const stations = stationsResponse?.data;
  const selectedStation = stations?.find((s) => s.id === value);

  const syncText = selectedStation?.sinkronisasiTerakhir
    ? `${format(new Date(selectedStation.sinkronisasiTerakhir), "dd-MM-yyyy HH:mm")}.`
    : "Belum ada data.";

  return (
    <Card>
      <Field>
        <Label htmlFor="station-select">Pilih Stasiun</Label>
        <Select value={value} onValueChange={onChange} disabled={isLoading}>
          <Trigger id="station-select">
            <SelectValue
              placeholder={isLoading ? "Memuat stasiun..." : "Pilih Stasiun"}
            />
          </Trigger>
          <SelectContent>
            {stations?.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <SyncBlock>
        <SyncTextBlock>
          <SyncLabel>Sinkronisasi terakhir</SyncLabel>
          <SyncValue>{syncText}</SyncValue>
        </SyncTextBlock>
        <RefreshButton type="button" onClick={() => refetch()} disabled={isFetching}>
          <SpinningIcon $spinning={isFetching} size={24} />
          Refresh
        </RefreshButton>
      </SyncBlock>
    </Card>
  );
}

const Card = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid #ecefed;
  border-radius: 16px;

  ${media.desktop} {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }
`;

/* Label di atas, select di bawah (stack) di mobile — dikoreksi setelah
 * user laporkan bug (sebelumnya row/inline di semua breakpoint, salah
 * untuk mobile). Desktop tetap row/inline seperti sebelumnya. */
const Field = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;

  ${media.desktop} {
    flex-direction: row;
    align-items: center;
    width: auto;
    flex: 1 1 auto;
    min-width: 0;
  }
`;

const Label = styled.label`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #ffffff;
  white-space: nowrap;
`;

const Trigger = styled(SelectTrigger)`
  width: 300px;
  max-width: 100%;
  height: 48px;
  padding: 12px;
  gap: 12px;
  background: rgba(255, 255, 255, 0.6);
  border: none;
  border-radius: 12px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  color: #1d2520;

  ${media.desktop} {
    width: 410px;
  }
`;

/* Dulu punya box gelap `rgba(0,0,0,0.2)` pembungkus khusus mobile —
 * dihapus setelah user kasih CSS Figma mobile persis, yang ternyata
 * flat (tanpa box tambahan) sama seperti desktop. */
const SyncBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;

  ${media.desktop} {
    width: auto;
  }
`;

/* 2 baris terpisah (label + tanggal bold) di mobile — dikoreksi setelah
 * user laporkan bug (sebelumnya 1 baris kalimat gabungan di semua
 * breakpoint). Di desktop tetap 1 baris seperti sebelumnya (label+value
 * inline, tanpa bold). */
const SyncTextBlock = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;

  ${media.desktop} {
    flex-direction: row;
    gap: 4px;
    flex: none;
    min-width: auto;
  }
`;

const SyncLabel = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: #ffffff;
`;

const SyncValue = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #ffffff;

  ${media.desktop} {
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const SpinningIcon = styled(RefreshDoubleIcon)<{ $spinning: boolean }>`
  animation: ${(p) => (p.$spinning ? spin : "none")} 0.8s linear infinite;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: 8px;
  padding: 8px 12px;
  background: #ffffff;
  border: none;
  border-radius: 8px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #175fe2;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
