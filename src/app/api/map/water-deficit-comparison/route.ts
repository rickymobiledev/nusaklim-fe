import { NextResponse } from "next/server";
import { waterDeficitComparisonApi } from "@/lib/api";
import { getDefaultWaterDeficitPeriod } from "@/lib/api/water-deficit-api";
import { requireUser, apiErrorResponse, resolveCompanyId } from "@/lib/api/route-guard";

/** TODO: endpoint ini masih pakai mock (`waterDeficitComparisonApi` di
 *  `lib/api/index.ts`) — belum ada kontrak BE untuk panel "Perbandingan
 *  Defisit Air", beda dari `app/api/map/water-deficit/route.ts` (peta,
 *  sudah real). Lihat catatan di `lib/api/mock/water-deficit-comparison-api.ts`. */
export async function GET(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const { searchParams } = new URL(request.url);
  const companyId = resolveCompanyId(user, searchParams.get("companyId") ?? undefined);

  // Konsisten dengan app/api/map/water-deficit/route.ts (peta) — pakai
  // periode bulan LALU yang sama, biar keduanya "bicara" periode yang
  // sama walau sumber datanya beda (mock vs real).
  const defaultPeriod = getDefaultWaterDeficitPeriod();
  const year = Number(searchParams.get("year")) || defaultPeriod.year;
  const month = Number(searchParams.get("month")) || defaultPeriod.month;

  try {
    const result = await waterDeficitComparisonApi.getStationWaterDeficit({
      companyId,
      year,
      month,
    });
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
