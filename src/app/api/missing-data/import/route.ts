import { NextResponse } from "next/server";
import { missingDataApi } from "@/lib/api";
import { validateImportFile } from "@/lib/missing-data-import";
import { requireAdmin, apiErrorResponse } from "@/lib/api/route-guard";

export async function POST(request: Request) {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { code: "MISSING_DATA_IMPORT_INVALID", message: "File belum dipilih." },
      { status: 400 },
    );
  }

  const invalid = validateImportFile(file);
  if (invalid) {
    return NextResponse.json(
      { code: "MISSING_DATA_IMPORT_INVALID", message: invalid },
      { status: 400 },
    );
  }

  try {
    const result = await missingDataApi.importData(file);
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
