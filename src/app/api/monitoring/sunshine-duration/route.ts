import { NextResponse } from "next/server";
import { monitoringApi } from "@/lib/api";
import type { MonitoringFilterParams } from "@/lib/api/monitoring-api";
import {
  requireUser,
  apiErrorResponse,
  resolveCompanyId,
  type SessionUser,
} from "@/lib/api/route-guard";

function parseParams(request: Request, user: SessionUser): MonitoringFilterParams {
  const { searchParams } = new URL(request.url);
  return {
    stationId: searchParams.get("stationId") ?? undefined,
    dateFrom: searchParams.get("dateFrom") ?? undefined,
    dateTo: searchParams.get("dateTo") ?? undefined,
    companyId: resolveCompanyId(user, searchParams.get("companyId") ?? undefined),
  };
}

export async function GET(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  try {
    const result = await monitoringApi.getSunshineDuration(parseParams(request, user));
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
