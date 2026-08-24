import { NextResponse } from "next/server";
import { stationApi } from "@/lib/api";
import type { GetStationsParams } from "@/lib/api/station-api";
import { requireUser, apiErrorResponse, resolveCompanyId } from "@/lib/api/route-guard";

export async function GET(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const { searchParams } = new URL(request.url);
  const params: GetStationsParams = {
    companyId: resolveCompanyId(user, searchParams.get("companyId") ?? undefined),
    status: (searchParams.get("status") as GetStationsParams["status"]) ?? undefined,
  };

  try {
    const result = await stationApi.getStations(params);
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
