import { NextResponse } from "next/server";
import { usersApi } from "@/lib/api";
import { requireAdmin, apiErrorResponse } from "@/lib/api/route-guard";
import type { UpdateUserInput } from "@/types/user-management";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as Partial<
    Omit<UpdateUserInput, "id">
  >;
  if (!body.name || !body.username || !body.userRoleId || !body.companyId) {
    return NextResponse.json(
      { code: "USER_INVALID_INPUT", message: "Semua field wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const result = await usersApi.updateUser({ id, ...body } as UpdateUserInput);
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  const { id } = await params;

  try {
    await usersApi.deleteUser(id);
    return NextResponse.json({ data: null });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
