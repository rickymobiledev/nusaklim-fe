import { NextResponse } from "next/server";
import { companiesApi } from "@/lib/api";
import { requireAdmin, apiErrorResponse } from "@/lib/api/route-guard";

export async function GET() {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  try {
    const result = await companiesApi.getCompanies();
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
