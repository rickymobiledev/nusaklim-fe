import { NextResponse } from "next/server";
import type { CreateCompanyInput } from "@/types/user-management";
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

export async function POST(request: Request) {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  const body = (await request.json().catch(() => ({}))) as Partial<CreateCompanyInput>;
  if (!body.name?.trim() || !body.code?.trim()) {
    return NextResponse.json(
      { code: "COMPANY_INVALID_INPUT", message: "Semua field wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const result = await companiesApi.createCompany({
      name: body.name.trim(),
      code: body.code.trim(),
    });
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
