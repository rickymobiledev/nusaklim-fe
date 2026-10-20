import { NextResponse } from "next/server";
import { regionalApi } from "@/lib/api";
import { requireUser, apiErrorResponse, resolveCompanyId } from "@/lib/api/route-guard";

/** Stasiun milik satu regional (`?companyCode=`). Role non-lintas-company
 *  dipaksa ke company sendiri, `companyCode` dari client diabaikan. */
export async function GET(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const { searchParams } = new URL(request.url);
  const companyCode = resolveCompanyId(
    user,
    searchParams.get("companyCode") ?? undefined,
  );
  if (!companyCode) {
    return NextResponse.json(
      { code: "COMPANY_REQUIRED", message: "Pilih company terlebih dahulu." },
      { status: 400 },
    );
  }

  try {
    const result = await regionalApi.getStationsByCompany(companyCode);
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
