import { NextResponse } from "next/server";
import { monitoringApi } from "@/lib/api";
import type { WaterBalanceFilterParams } from "@/lib/api/monitoring-api";
import type { WaterBalance } from "@/types/domain";
import {
  requireUser,
  apiErrorResponse,
  resolveCompanyId,
  type SessionUser,
} from "@/lib/api/route-guard";

/** `years` comma-separated (mis. `?years=2025,2024`) — satu Route Handler
 *  call bisa minta banding beberapa tahun sekaligus TANPA endpoint BE
 *  perlu terima array: di bawah, tiap tahun di-fan-out jadi call terpisah
 *  ke `monitoringApi.getWaterBalance` (yang di real client-nya nanti =
 *  satu request `GET /water_deficit?device_id=&year=` per tahun),
 *  Promise.all-kan, baru digabung di sini. Kosong/tidak valid -> default
 *  ke tahun berjalan saja. */
function parseYears(request: Request): number[] {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("years");
  if (!raw) return [new Date().getFullYear()];

  const years = raw
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isInteger(value));

  return years.length > 0 ? years : [new Date().getFullYear()];
}

function parseParams(request: Request, user: SessionUser): WaterBalanceFilterParams[] {
  const { searchParams } = new URL(request.url);
  const stationId = searchParams.get("stationId") ?? undefined;
  const companyId = resolveCompanyId(user, searchParams.get("companyId") ?? undefined);

  return parseYears(request).map((year) => ({ stationId, year, companyId }));
}

export async function GET(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  try {
    const results = await Promise.all(
      parseParams(request, user).map((params) => monitoringApi.getWaterBalance(params)),
    );
    const data: WaterBalance[] = results.map((result) => result.data);
    return NextResponse.json({
      data,
      meta: { page: 1, pageSize: data.length, total: data.length },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
