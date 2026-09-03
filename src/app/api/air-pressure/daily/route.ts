import { NextResponse } from "next/server";
import { getPressureSeries } from "@/lib/api/air-pressure-client";
import { requireUser, apiErrorResponse, resolveCompanyId } from "@/lib/api/route-guard";

export async function GET(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const { searchParams } = new URL(request.url);
  const stationIds = (searchParams.get("stationIds") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const companyId = resolveCompanyId(user, searchParams.get("companyId") ?? undefined);

  if (!startDate || !endDate) {
    return NextResponse.json(
      { code: "INVALID_PARAMS", message: "startDate dan endDate wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const result = await getPressureSeries(
      stationIds,
      new Date(startDate),
      new Date(endDate),
      companyId,
    );
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
