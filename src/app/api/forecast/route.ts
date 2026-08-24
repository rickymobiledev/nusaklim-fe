import { NextResponse } from "next/server";
import { ramalanCuacaApi } from "@/lib/api";
import { requireUser, apiErrorResponse, resolveCompanyId } from "@/lib/api/route-guard";

/** POST, bukan GET — cocok dengan `POST /api/v2/forecast` di API asli. */
export async function POST(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const body = (await request.json().catch(() => ({}))) as {
    stationId?: string;
    companyId?: string;
  };
  const companyId = resolveCompanyId(user, body.companyId);

  try {
    const result = await ramalanCuacaApi.getForecast(body.stationId ?? "", companyId);
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
