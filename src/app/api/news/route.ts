import { NextResponse } from "next/server";
import { newsApi } from "@/lib/api";
import { requireUser, apiErrorResponse } from "@/lib/api/route-guard";

/** Cache respons ini di CDN/ISR Next.js selama 15 menit (900 detik).
 *  Begitu cache kedaluwarsa, permintaan berikutnya otomatis re-fetch ke
 *  backend dan memperbarui cache. Client-side (TanStack Query) juga diberi
 *  `staleTime` 15 menit — sehingga perpindahan Beranda → Lihat Semua Berita
 *  tidak perlu hit API sama sekali selama data masih segar.
 *
 *  TIDAK panggil `resolveCompanyId()` seperti Route Handler lain — `/news`
 *  tidak ter-scope company (lihat catatan di `lib/api/news-api.ts`).
 *  `requireUser()` tetap wajib, semua halaman dashboard di balik sesi
 *  login lewat `src/proxy.ts`. */
export const revalidate = 900; // 15 menit

export async function GET() {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  try {
    const result = await newsApi.getPublishedNews();
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
