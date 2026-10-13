import { NextResponse } from "next/server";
import { regionalApi } from "@/lib/api";
import { requireUser, apiErrorResponse, resolveCompanyId } from "@/lib/api/route-guard";

/** Daftar regional untuk filter Unduh Data. Role selain
 *  ADMINISTRATOR/RESEARCHER cuma dapat company-nya sendiri
 *  (`resolveCompanyId()` memaksa ke `user.companyCode`). */
export async function GET() {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  try {
    const result = await regionalApi.getCompanies(resolveCompanyId(user));
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
