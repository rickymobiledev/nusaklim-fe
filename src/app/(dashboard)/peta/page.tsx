"use client";

import { DynamicStationMap } from "@/components/domain/peta/dynamic-station-map";
import { useStations } from "@/hooks/use-stations";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function PetaPage() {
  const { data: stationsResponse, isLoading } = useStations();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            <Skeleton className="h-[520px] w-full" />
          ) : (
            <DynamicStationMap stations={stationsResponse?.data ?? []} />
          )}
        </CardContent>
      </Card>
      <p className="text-muted-foreground text-xs">
        Titik hijau = stasiun aktif, titik merah = stasiun tidak aktif.
      </p>
    </div>
  );
}
