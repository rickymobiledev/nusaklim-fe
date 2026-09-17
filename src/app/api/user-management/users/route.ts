import { NextResponse } from "next/server";
import { usersApi } from "@/lib/api";
import { requireAdmin, apiErrorResponse } from "@/lib/api/route-guard";
import type { CreateUserInput } from "@/types/user-management";

export async function GET() {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  try {
    const result = await usersApi.getUsers();
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  const body = (await request.json().catch(() => ({}))) as Partial<CreateUserInput>;
  if (
    !body.name ||
    !body.username ||
    !body.email ||
    !body.password ||
    !body.userRoleId ||
    !body.companyId
  ) {
    return NextResponse.json(
      { code: "USER_INVALID_INPUT", message: "Semua field wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const result = await usersApi.createUser(body as CreateUserInput);
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
