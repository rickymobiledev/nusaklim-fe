import { NextResponse } from "next/server";
import { downloadApi } from "@/lib/api";
import type { GetDownloadDataParams } from "@/lib/api/download-api";
import { requireUser, apiErrorResponse, resolveCompanyId } from "@/lib/api/route-guard";

export async function GET(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const { searchParams } = new URL(request.url);
  const params: GetDownloadDataParams = {
    stationId: searchParams.get("stationId") ?? undefined,
    dateFrom: searchParams.get("dateFrom") ?? undefined,
    dateTo: searchParams.get("dateTo") ?? undefined,
    granularity: (searchParams.get("granularity") ??
      "harian") as GetDownloadDataParams["granularity"],
    companyId: resolveCompanyId(user, searchParams.get("companyId") ?? undefined),
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    pageSize: searchParams.get("pageSize")
      ? Number(searchParams.get("pageSize"))
      : undefined,
  };

  try {
    const result = await downloadApi.getDownloadData(params);
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
