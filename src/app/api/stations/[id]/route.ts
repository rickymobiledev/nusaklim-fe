import { NextResponse } from "next/server";
import { stationApi } from "@/lib/api";
import { requireUser, apiErrorResponse, resolveCompanyId } from "@/lib/api/route-guard";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const companyId = resolveCompanyId(user, searchParams.get("companyId") ?? undefined);

  try {
    const result = await stationApi.getStationDetail(id, companyId);
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
