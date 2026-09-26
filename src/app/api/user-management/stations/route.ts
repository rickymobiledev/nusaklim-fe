import { NextResponse } from "next/server";
import { stationsAdminApi } from "@/lib/api";
import { requireAdmin, apiErrorResponse } from "@/lib/api/route-guard";
import { INVALID_STATION_INPUT, parseStationBody, parseStationId } from "./validate";

export async function GET() {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  try {
    return NextResponse.json(await stationsAdminApi.getStations());
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  const body = await request.json().catch(() => ({}));
  const id = parseStationId(body.id);
  const fields = parseStationBody(body);
  if (!id || !fields) return NextResponse.json(INVALID_STATION_INPUT, { status: 400 });

  try {
    return NextResponse.json(await stationsAdminApi.createStation({ id, ...fields }));
  } catch (error) {
    return apiErrorResponse(error);
  }
}
