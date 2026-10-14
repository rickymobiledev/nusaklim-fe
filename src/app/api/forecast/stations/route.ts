import { NextResponse } from "next/server";
import { regionalApi } from "@/lib/api";
import { requireUser, apiErrorResponse, resolveCompanyId } from "@/lib/api/route-guard";

/** Daftar stasiun dropdown halaman Ramalan Cuaca — `GET /devices`. Role
 *  non-lintas-company dipaksa ke company sendiri; admin/peneliti = semua. */
export async function GET() {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const companyCode = resolveCompanyId(user, undefined);

  try {
    const result = await regionalApi.getStationsByCompany(companyCode);
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
