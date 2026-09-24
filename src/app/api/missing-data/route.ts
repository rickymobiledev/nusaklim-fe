import { NextResponse } from "next/server";
import { missingDataApi } from "@/lib/api";
import { requireAdmin, resolveCompanyId, apiErrorResponse } from "@/lib/api/route-guard";

export async function GET() {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  try {
    const result = await missingDataApi.getMissingData({
      companyId: resolveCompanyId(user),
    });
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
