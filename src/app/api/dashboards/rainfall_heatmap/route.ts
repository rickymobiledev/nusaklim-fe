import { NextResponse } from "next/server";
import { fetchRainfallHeatmap } from "@/lib/api/rainfall-heatmap-client";
import { requireUser, apiErrorResponse, resolveCompanyId } from "@/lib/api/route-guard";

export async function GET(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const { searchParams } = new URL(request.url);
  const weatherStationId =
    searchParams.get("weather_station_id") ??
    searchParams.get("stationId") ??
    "";
  const now = new Date();
  const year = parseInt(
    searchParams.get("year") ?? String(now.getFullYear()),
    10,
  );
  const month = parseInt(
    searchParams.get("month") ?? String(now.getMonth() + 1),
    10,
  );
  const companyId = resolveCompanyId(
    user,
    searchParams.get("companyId") ?? undefined,
  );

  if (!weatherStationId) {
    return NextResponse.json(
      { code: "INVALID_PARAMS", message: "weather_station_id wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const data = await fetchRainfallHeatmap(
      weatherStationId,
      year,
      month,
      companyId,
    );
    return NextResponse.json({ status: true, data });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
