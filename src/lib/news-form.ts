import { NextResponse } from "next/server";
import type { CreateNewsInput } from "@/types/user-management";
import { validateNewsCoverFile } from "@/lib/news-cover";

/** Parse + validasi FormData tambah/ubah berita di Route Handler admin
 *  (title & content wajib; cover opsional, JPEG/PNG ≤ 2 MB). */
export async function parseNewsForm(
  request: Request,
): Promise<{ ok: true; input: CreateNewsInput } | { ok: false; response: NextResponse }> {
  const form = await request.formData().catch(() => null);
  const title = String(form?.get("title") ?? "").trim();
  const content = String(form?.get("content") ?? "").trim();
  const file = form?.get("cover");
  const cover = file instanceof File && file.size > 0 ? file : null;

  const coverError = cover ? validateNewsCoverFile(cover) : null;
  if (!title || !content || coverError) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          code: "NEWS_INVALID_INPUT",
          message: coverError ?? "Judul dan isi berita wajib diisi.",
        },
        { status: 400 },
      ),
    };
  }
  return { ok: true, input: { title, content, cover } };
}
