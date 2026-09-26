import { NextResponse } from "next/server";
import { notificationApi } from "@/lib/api";
import { requireUser, apiErrorResponse } from "@/lib/api/route-guard";

/** TIDAK panggil `resolveCompanyId()` — notifikasi per-user, bukan
 *  per-company (lihat catatan risiko auth di `lib/api/notification-client.ts`).
 *  `requireUser()` tetap wajib, semua halaman dashboard di balik sesi
 *  login lewat `src/proxy.ts`. */
export async function GET() {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  try {
    const result = await notificationApi.getNotifications(user.id);
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
