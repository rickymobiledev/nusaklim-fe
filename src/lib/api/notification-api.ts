import type { ApiListResponse } from "@/types/api";
import type { NotificationItem } from "@/types/domain";

/** TIDAK ada `companyId` — notifikasi ini per-USER (`notifiable_id` di
 *  payload asli), bukan per-company seperti kebanyakan domain lain. Lihat
 *  `notification-client.ts` untuk catatan risiko auth (app ini tidak
 *  simpan token/cookie per-user dari backend). */
export interface NotificationApi {
  /** Ambil daftar notifikasi untuk user tertentu (`notifiable_id`). */
  getNotifications(notifiableId?: string): Promise<ApiListResponse<NotificationItem>>;
}
