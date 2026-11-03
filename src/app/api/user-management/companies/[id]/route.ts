import { NextResponse } from "next/server";
import { validateAvatarFile } from "@/lib/user-avatar";
import { companiesApi } from "@/lib/api";
import { requireAdmin, apiErrorResponse } from "@/lib/api/route-guard";

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) ? id : null;
}

const INVALID_ID = () =>
  NextResponse.json(
    { code: "COMPANY_INVALID_INPUT", message: "ID perusahaan tidak valid." },
    { status: 400 },
  );

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  const id = parseId((await params).id);
  if (id === null) return INVALID_ID();

  try {
    await companiesApi.deleteCompany(id);
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

  const id = parseId((await params).id);
  if (id === null) return INVALID_ID();

  const form = await request.formData().catch(() => null);
  const name = String(form?.get("name") ?? "").trim();
  const file = form?.get("image");
  const image = file instanceof File && file.size > 0 ? file : null;
  const imageError = image ? validateAvatarFile(image) : null;
  if (!name || imageError) {
    return NextResponse.json(
      {
        code: "COMPANY_INVALID_INPUT",
        message: imageError ?? "Nama perusahaan wajib diisi.",
      },
      { status: 400 },
    );
  }

  try {
    const result = await companiesApi.updateCompany({
      id,
      name,
      image,
    });
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
