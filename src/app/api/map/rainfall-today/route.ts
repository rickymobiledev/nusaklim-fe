import { NextResponse } from "next/server";
import { rainfallTodayApi } from "@/lib/api";
import { requireUser, apiErrorResponse, resolveCompanyId } from "@/lib/api/route-guard";

export async function GET(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const { searchParams } = new URL(request.url);
  // VIEWER_* selalu dipaksa ke company sendiri oleh `resolveCompanyId()`.
  // ADMINISTRATOR/RESEARCHER yang tidak memilih company → `undefined` →
  // request ke BE TANPA `company_code` (semua company).
  const companyId = resolveCompanyId(user, searchParams.get("companyId") ?? undefined);

  try {
    const result = await rainfallTodayApi.getStationRainfallToday({ companyId });
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
