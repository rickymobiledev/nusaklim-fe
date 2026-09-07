"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Leaflet menyentuh `window` saat di-import, jadi WAJIB di-load tanpa SSR.
export const DynamicDrySpellMap = dynamic(
  () => import("./dry-spell-map").then((mod) => mod.DrySpellMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-140 w-full rounded-[20px]" />,
  },
);
