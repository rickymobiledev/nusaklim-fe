import { NextResponse } from "next/server";
import { missingDataApi } from "@/lib/api";
import { requireRoles, resolveCompanyId, apiErrorResponse } from "@/lib/api/route-guard";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_PAGE_SIZE = 100;

function badRequest(message: string) {
  return NextResponse.json(
    { code: "MISSING_DATA_INVALID_PARAMS", message },
    { status: 400 },
  );
}

/** Filter (`stationId`, `dateFrom`, `dateTo`) + pagination (`page`,
 *  `pageSize`) SERVER-SIDE — diteruskan ke `GET /weathers/missing`. Station
 *  wajib; `companyId` ditentukan `resolveCompanyId()`, bukan dari query. */
export async function GET(request: Request) {
  const { user, unauthorized } = await requireRoles(["ADMINISTRATOR", "RESEARCHER"]);
  if (!user) return unauthorized;

  const { searchParams } = new URL(request.url);
  const stationId = searchParams.get("stationId")?.trim();
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");

  if (!stationId) return badRequest("Stasiun belum dipilih.");
  if (!DATE_PATTERN.test(dateFrom) || !DATE_PATTERN.test(dateTo)) {
    return badRequest("Rentang tanggal tidak valid.");
  }
  if (!Number.isInteger(page) || page < 1) return badRequest("Halaman tidak valid.");
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE) {
    return badRequest("Jumlah data per halaman tidak valid.");
  }

  try {
    const result = await missingDataApi.getMissingData({
      companyId: resolveCompanyId(user),
      stationId,
      dateFrom,
      dateTo,
      page,
      pageSize,
    });
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
