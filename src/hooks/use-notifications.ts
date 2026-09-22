"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse } from "@/types/api";
import type { NotificationItem } from "@/types/domain";
import { fetchJson } from "@/lib/api/client-fetch";

/** Popup Notifikasi (bell icon Header) — lihat catatan risiko auth di
 *  `lib/api/notification-client.ts`. Polling ringan 60 detik (asumsi
 *  wajar utk data "live", tidak ada spec eksplisit), sama pola
 *  `use-rainfall-today.ts`. */
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchJson<ApiListResponse<NotificationItem>>("/api/notification"),
    select: (res) => res.data,
    refetchInterval: 60 * 1000,
  });
}
