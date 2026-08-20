"use client";

import { useStations } from "@/hooks/use-stations";
import { Label } from "@/components/ui/label";

export function StationSelect({
  value,
  onChange,
}: {
  value?: string;
  onChange: (stationId: string) => void;
}) {
  const { data: stations, isLoading } = useStations();

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="station-select">Stasiun</Label>
      <select
        id="station-select"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        <option value="" disabled>
          {isLoading ? "Memuat stasiun..." : "Pilih Stasiun"}
        </option>
        {stations?.map((s) => (
          <option key={s.id} value={s.id}>
            {s.nama}
          </option>
        ))}
      </select>
    </div>
  );
}
