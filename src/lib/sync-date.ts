import { format } from "date-fns";
import { id } from "date-fns/locale";
import { parseNotificationDate } from "@/lib/notification-time";

/** Tanggal sinkronisasi siap-tampil ("31 Agustus 2026") dari timestamp BE
 *  (`"YYYY-MM-DD HH:mm:ss"` atau ISO); `null` kalau kosong/tidak valid. */
export function formatSyncDate(raw?: string | null): string | null {
  if (!raw) return null;
  const date = parseNotificationDate(raw);
  if (isNaN(date.getTime())) return null;
  return format(date, "d MMMM yyyy", { locale: id });
}
