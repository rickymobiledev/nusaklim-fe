import { NextResponse } from "next/server";
import { validateAvatarFile } from "@/lib/user-avatar";
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

  const form = await request.formData().catch(() => null);
  const name = String(form?.get("name") ?? "").trim();
  const code = String(form?.get("code") ?? "").trim();
  const file = form?.get("image");
  const image = file instanceof File && file.size > 0 ? file : null;

  const imageError = image ? validateAvatarFile(image) : "Logo perusahaan wajib diunggah.";
  if (!name || !code || !image || imageError) {
    return NextResponse.json(
      {
        code: "COMPANY_INVALID_INPUT",
        message: imageError ?? "Semua field wajib diisi.",
      },
      { status: 400 },
    );
  }

  try {
    const result = await companiesApi.createCompany({ name, code, image });
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
