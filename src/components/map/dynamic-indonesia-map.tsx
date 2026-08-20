"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Leaflet menyentuh `window` saat di-import, jadi WAJIB di-load tanpa SSR.
export const DynamicIndonesiaMap = dynamic(
  () => import("./indonesia-map").then((mod) => mod.IndonesiaMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[520px] w-full" />,
  },
);
