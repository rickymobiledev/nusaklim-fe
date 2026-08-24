import { NextResponse } from "next/server";
import { weatherApi } from "@/lib/api";
import { requireUser, apiErrorResponse, resolveCompanyId } from "@/lib/api/route-guard";

export async function GET(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const { searchParams } = new URL(request.url);
  const stationId = searchParams.get("stationId") ?? "";
  const companyId = resolveCompanyId(user, searchParams.get("companyId") ?? undefined);

  try {
    const result = await weatherApi.getWeatherMetrics(stationId, companyId);
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
