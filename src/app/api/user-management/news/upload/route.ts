import { NextResponse } from "next/server";
import { newsApi } from "@/lib/api";
import { validateNewsCoverFile } from "@/lib/news-cover";
import { requireAdmin, apiErrorResponse } from "@/lib/api/route-guard";

/** Upload gambar untuk isi berita (editor rich-text) → `{ url }`. */
export async function POST(request: Request) {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  const form = await request.formData().catch(() => null);
  const file = form?.get("upload");
  const fileError =
    file instanceof File && file.size > 0
      ? validateNewsCoverFile(file)
      : "File gambar wajib diisi.";
  if (fileError || !(file instanceof File)) {
    return NextResponse.json(
      { code: "NEWS_INVALID_INPUT", message: fileError ?? "File gambar wajib diisi." },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json({ url: await newsApi.uploadNewsImage(file) });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
