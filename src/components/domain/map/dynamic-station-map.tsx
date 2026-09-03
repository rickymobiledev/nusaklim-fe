"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Leaflet menyentuh `window` saat di-import, jadi WAJIB di-load tanpa SSR.
export const DynamicStationMap = dynamic(
  () => import("./station-map").then((mod) => mod.StationMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[560px] w-full rounded-[20px]" />,
  },
);
