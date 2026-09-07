import { NextResponse } from "next/server";
import { waterDeficitApi } from "@/lib/api";
import { getDefaultWaterDeficitPeriod } from "@/lib/api/water-deficit-api";
import { requireUser, apiErrorResponse, resolveCompanyId } from "@/lib/api/route-guard";

export async function GET(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const { searchParams } = new URL(request.url);
  const companyId = resolveCompanyId(user, searchParams.get("companyId") ?? undefined);

  // `year`/`month` WAJIB di endpoint asli (lihat catatan di
  // lib/api/water-deficit-api.ts) — belum ada UI pemilih periode di tab
  // ini, jadi default ke bulan LALU (bulan penuh terakhir) kalau client
  // tidak kirim — bulan berjalan biasanya belum lengkap datanya di BE.
  const defaultPeriod = getDefaultWaterDeficitPeriod();
  const year = Number(searchParams.get("year")) || defaultPeriod.year;
  const month = Number(searchParams.get("month")) || defaultPeriod.month;

  try {
    const result = await waterDeficitApi.getStationWaterDeficit({
      companyId,
      year,
      month,
    });
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
