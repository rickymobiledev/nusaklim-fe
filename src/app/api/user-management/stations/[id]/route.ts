import { NextResponse } from "next/server";
import { stationsAdminApi } from "@/lib/api";
import { requireAdmin, apiErrorResponse } from "@/lib/api/route-guard";
import { INVALID_STATION_INPUT, parseStationBody } from "../validate";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  const { id } = await params;
  try {
    await stationsAdminApi.deleteStation(id);
    return NextResponse.json({ data: null });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  const { id } = await params;
  const input = parseStationBody(await request.json().catch(() => ({})));
  if (!input) return NextResponse.json(INVALID_STATION_INPUT, { status: 400 });

  try {
    return NextResponse.json(await stationsAdminApi.updateStation({ id, ...input }));
  } catch (error) {
    return apiErrorResponse(error);
  }
}
