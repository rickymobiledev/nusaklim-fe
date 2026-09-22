import type { NotificationItem } from "@/types/domain";

/** Bentuk mentah `GET /notification` — BELUM dikonfirmasi lewat tes
 *  langsung ke backend (user cuma kasih screenshot tabel database, bukan
 *  contoh response JSON), diasumsikan ikut envelope `{status, message,
 *  data: RawNotification[]}` yang sama seperti semua endpoint lain di app
 *  ini. Kolom `notifiable_type`/`notifiable_id`/`updated_at` sengaja
 *  diabaikan (tidak dipakai UI). `data` adalah STRING JSON, bukan objek
 *  langsung. */
export interface RawNotification {
  id: number | string;
  notifiable_type: string;
  notifiable_id: number | string;
  data: string;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

/** `data` mentah = string JSON `{title, message}` — dibungkus try/catch,
 *  fallback string kosong kalau satu baris korup, JANGAN sampai gagalkan
 *  seluruh list gara-gara satu notifikasi tidak valid. */
function parseNotificationData(raw: string): { title: string; message: string } {
  try {
    const parsed = JSON.parse(raw) as { title?: unknown; message?: unknown };
    return {
      title: typeof parsed.title === "string" ? parsed.title : "",
      message: typeof parsed.message === "string" ? parsed.message : "",
    };
  } catch {
    return { title: "", message: "" };
  }
}

export function mapRawNotification(raw: RawNotification): NotificationItem {
  const { title, message } = parseNotificationData(raw.data);
  return {
    id: String(raw.id),
    judul: title,
    pesan: message,
    sudahDibaca: raw.read_at !== null,
    dibuatPada: raw.created_at,
  };
}
