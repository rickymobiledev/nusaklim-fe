"use client";

import { DynamicIndonesiaMap } from "@/components/map/dynamic-indonesia-map";
import { useStations } from "@/hooks/use-stations";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function PetaPage() {
  const { data: stations, isLoading } = useStations();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            <Skeleton className="h-[520px] w-full" />
          ) : (
            <DynamicIndonesiaMap stations={stations ?? []} />
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">
        Titik hijau = stasiun aktif, titik merah = stasiun tidak aktif.
      </p>
    </div>
  );
}
