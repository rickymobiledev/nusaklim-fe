import { ApiError, type ApiListResponse } from "@/types/api";
import type { NotificationItem } from "@/types/domain";
import { createApiClient } from "./fetcher";
import {
  mapRawNotification,
  type RawNotification,
} from "./adapters/notification-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { NotificationApi } from "./notification-api";

// TODO(sementara — cek visual lokal): true = pakai data mock di bawah,
// BUKAN hit backend asli. Set balik ke `false` (atau hapus blok ini)
// begitu auth /notification sudah diverifikasi benar identifikasi user.
const TEMP_USE_MOCK_NOTIFICATIONS = true;

const now = Date.now();
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    judul: "Alat Tidak Aktif",
    pesan: "Alat di Stasiun Bukit Sentang Tidak Aktif",
    sudahDibaca: false,
    dibuatPada: new Date(now - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    judul: "Curah Hujan Tinggi Terdeteksi",
    pesan: "Curah hujan di Stasiun Medan mencapai 78 mm/hari dan masuk kategori tinggi.",
    sudahDibaca: false,
    dibuatPada: new Date(now - 42 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    judul: "12 Hari Tanpa Hujan",
    pesan:
      "Stasiun Marlihat mulai memasuki periode kering setelah tidak terjadi hujan signifikan.",
    sudahDibaca: true,
    dibuatPada: new Date(now - 42 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    judul: "Kemarau Berkepanjangan",
    pesan:
      "Kebun Timur telah mengalami 21 hari tanpa hujan signifikan. Pantau kondisi tanaman dan ketersediaan air.",
    sudahDibaca: true,
    dibuatPada: "2026-09-08T14:20:00.000Z",
  },
];

/** Satu-satunya implementasi popup Notifikasi — pola trio persis
 *  `news-client.ts`/`rainfall-today-client.ts` (`createApiClient()` TANPA
 *  companyId, cek `res.data.status`, `ApiError` kalau gagal, sintesis
 *  `meta`).
 *
 *  RISIKO AUTH — DISADARI & DITERIMA USER (bukan asumsi aman seperti
 *  domain company-scoped lain): notifikasi ini per-USER (`notifiable_id`
 *  di payload asli), tapi app ini TIDAK PERNAH simpan token/cookie
 *  per-user dari backend (`auth.ts` — login cuma balikin profil, sesi
 *  dikelola Auth.js sendiri, bukan pass-through token backend). Kalau
 *  backend sebenarnya infer identitas user dari cookie session (bukan
 *  dari `api-key` yang shared semua user/company), request ini BISA
 *  SUKSES secara HTTP tapi balikin data user lain / kosong / salah —
 *  BUKAN cuma gagal 401/403 seperti domain lain. TODO: setelah dites
 *  manual, konfirmasi ke user apakah data yang muncul benar milik user
 *  yang login, lalu update komentar ini (dikonfirmasi benar / perlu
 *  cookie).
 *
 *  Bentuk envelope response JUGA belum dikonfirmasi tes langsung (lihat
 *  `notification-adapter.ts`). */
export const notificationClient: NotificationApi = {
  async getNotifications(): Promise<ApiListResponse<NotificationItem>> {
    if (TEMP_USE_MOCK_NOTIFICATIONS) {
      return {
        data: MOCK_NOTIFICATIONS,
        meta: {
          page: 1,
          pageSize: MOCK_NOTIFICATIONS.length,
          total: MOCK_NOTIFICATIONS.length,
        },
      };
    }

    try {
      const client = createApiClient();
      const res = await client.get<{
        status: boolean;
        message: string;
        data: RawNotification[];
      }>("/notification");

      if (!res.data.status) {
        throw new ApiError(
          "NOTIFICATION_FETCH_FAILED",
          res.data.message || "Gagal mengambil data notifikasi dari server.",
        );
      }

      const data = res.data.data.map(mapRawNotification);

      return { data, meta: { page: 1, pageSize: data.length, total: data.length } };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "NOTIFICATION_FETCH_FAILED",
        extractBackendErrorMessage(err) ?? "Gagal terhubung ke server notifikasi.",
      );
    }
  },
};
