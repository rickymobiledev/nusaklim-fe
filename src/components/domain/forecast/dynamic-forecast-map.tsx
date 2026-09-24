"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Leaflet menyentuh `window` saat di-import, jadi WAJIB di-load tanpa SSR.
export const DynamicForecastMap = dynamic(
  () => import("./forecast-map").then((mod) => mod.ForecastMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[262px] w-full rounded-[20px] xl:h-full" />,
  },
);
