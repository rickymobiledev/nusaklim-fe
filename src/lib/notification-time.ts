import { differenceInHours, differenceInMinutes, format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

/** Parser tanggal notifikasi — menangani format database `"YYYY-MM-DD HH:mm:ss"`
 *  maupun ISO `"YYYY-MM-DDTHH:mm:ss"`. */
export function parseNotificationDate(createdAt: string): Date {
  if (!createdAt) return new Date();
  const normalized = createdAt.includes("T")
    ? createdAt
    : createdAt.replace(" ", "T");
  const parsed = parseISO(normalized);
  return isNaN(parsed.getTime()) ? new Date(createdAt) : parsed;
}

/** Format waktu relatif popup Notifikasi ("5 menit lalu", "2 jam lalu")
 *  yang beralih ke tanggal absolut ("8 Sep, 14:20") setelah 24 jam. */
export function formatNotificationTime(createdAt: string): string {
  const date = parseNotificationDate(createdAt);
  const now = new Date();

  const minutes = differenceInMinutes(now, date);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = differenceInHours(now, date);
  if (hours < 24) return `${hours} jam lalu`;

  return format(date, "d MMM, HH:mm", { locale: id });
}
