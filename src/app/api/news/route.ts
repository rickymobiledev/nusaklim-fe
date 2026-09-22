import { NextResponse } from "next/server";
import { newsApi } from "@/lib/api";
import { requireUser, apiErrorResponse } from "@/lib/api/route-guard";

/** TIDAK panggil `resolveCompanyId()` seperti Route Handler lain — `/news`
 *  tidak ter-scope company (lihat catatan di `lib/api/news-api.ts`).
 *  `requireUser()` tetap wajib, semua halaman dashboard di balik sesi
 *  login lewat `src/proxy.ts`. */
export async function GET() {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  try {
    const result = await newsApi.getNews();
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
