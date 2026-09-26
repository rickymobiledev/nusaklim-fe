import { ApiError, type ApiListResponse } from "@/types/api";
import type { NotificationItem } from "@/types/domain";
import { createApiClient } from "./fetcher";
import {
  mapRawNotification,
  type RawNotification,
} from "./adapters/notification-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { NotificationApi } from "./notification-api";

/** Implementasi Notifikasi — hit `GET /notification?notifiable_id={userId}`. */
export const notificationClient: NotificationApi = {
  async getNotifications(
    notifiableId?: string,
  ): Promise<ApiListResponse<NotificationItem>> {
    try {
      const client = createApiClient();
      const res = await client.get<{
        status: boolean;
        message?: string;
        data: RawNotification[];
      }>("/notification", {
        params: notifiableId ? { notifiable_id: notifiableId } : undefined,
      });

      if (!res.data.status) {
        throw new ApiError(
          "NOTIFICATION_FETCH_FAILED",
          res.data.message || "Gagal mengambil data notifikasi dari server.",
        );
      }

      const rawItems = Array.isArray(res.data.data) ? res.data.data : [];
      const data = rawItems.map(mapRawNotification);

      return {
        data,
        meta: { page: 1, pageSize: data.length, total: data.length },
      };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "NOTIFICATION_FETCH_FAILED",
        extractBackendErrorMessage(err) ??
          "Gagal terhubung ke server notifikasi.",
      );
    }
  },
};
