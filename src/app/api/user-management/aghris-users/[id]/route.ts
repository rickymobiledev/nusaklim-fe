import { NextResponse } from "next/server";
import type { UpdateAghrisUserInput } from "@/types/user-management";
import { aghrisUsersApi } from "@/lib/api";
import { requireAdmin, apiErrorResponse } from "@/lib/api/route-guard";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  const { id } = await params;

  try {
    await aghrisUsersApi.deleteAghrisUser(id);
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
  const body = (await request.json().catch(() => ({}))) as Partial<
    Omit<UpdateAghrisUserInput, "id">
  >;
  if (!body.nipSap?.trim() || !body.roleId) {
    return NextResponse.json(
      { code: "AGHRIS_INVALID_INPUT", message: "Semua field wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const result = await aghrisUsersApi.updateAghrisUser({
      id,
      nipSap: body.nipSap.trim(),
      roleId: body.roleId,
    });
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
