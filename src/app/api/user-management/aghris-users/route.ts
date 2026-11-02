import { NextResponse } from "next/server";
import type { CreateAghrisUserInput } from "@/types/user-management";
import { aghrisUsersApi } from "@/lib/api";
import { requireAdmin, apiErrorResponse } from "@/lib/api/route-guard";

export async function GET() {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  try {
    const result = await aghrisUsersApi.getAghrisUsers();
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  const body = (await request.json().catch(() => ({}))) as Partial<CreateAghrisUserInput>;
  if (!body.nipSap?.trim() || !body.roleCode) {
    return NextResponse.json(
      { code: "AGHRIS_INVALID_INPUT", message: "Semua field wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const result = await aghrisUsersApi.createAghrisUser({
      nipSap: body.nipSap.trim(),
      roleCode: body.roleCode,
    });
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
