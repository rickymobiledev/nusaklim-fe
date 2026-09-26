"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type { NotificationItem } from "@/types/domain";
import { fetchJson } from "@/lib/api/client-fetch";

const NOTIFICATION_QUERY_KEY = ["notifications"];
const REFETCH_15_MINUTES = 15 * 60 * 1000;

/** Popup Notifikasi (bell icon Header) — hit API `/api/notification`
 *  setiap 15 menit sekali (`refetchInterval: 15 * 60 * 1000`). */
export function useNotifications() {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEY,
    queryFn: () =>
      fetchJson<ApiListResponse<NotificationItem>>("/api/notification"),
    select: (res) => res.data,
    refetchInterval: REFETCH_15_MINUTES,
    staleTime: REFETCH_15_MINUTES,
  });
}

/** Detail satu notifikasi untuk halaman baca notifikasi (`/notification/[id]`). */
export function useNotificationDetail(id: string) {
  const { data: allNotifications } = useNotifications();
  const cachedItem = allNotifications?.find((n) => n.id === id);

  return useQuery({
    queryKey: [...NOTIFICATION_QUERY_KEY, "detail", id],
    queryFn: async () => {
      if (cachedItem) return { data: cachedItem };
      return fetchJson<ApiItemResponse<NotificationItem>>(
        `/api/notification/${encodeURIComponent(id)}`,
      );
    },
    select: (res) => res.data,
    initialData: cachedItem ? { data: cachedItem } : undefined,
    enabled: !!id,
    staleTime: REFETCH_15_MINUTES,
  });
}
