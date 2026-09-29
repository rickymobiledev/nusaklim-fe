import { NextResponse } from "next/server";
import { rainfallTodayApi } from "@/lib/api";
import { requireUser, apiErrorResponse, resolveCompanyId } from "@/lib/api/route-guard";

export async function GET(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const { searchParams } = new URL(request.url);
  // `/devices/rainfall_today` WAJIB `company_code`: role lintas-company
  // (ADMINISTRATOR/RESEARCHER) yang tidak memilih company jatuh ke company
  // dari respons login (sesi server), bukan tanpa filter.
  const companyId =
    resolveCompanyId(user, searchParams.get("companyId") ?? undefined) ??
    user.companyCode;

  try {
    const result = await rainfallTodayApi.getStationRainfallToday({ companyId });
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
