import { NextResponse } from "next/server";
import { newsApi } from "@/lib/api";
import { requireUser, apiErrorResponse } from "@/lib/api/route-guard";

/** Detail berita untuk semua user login (bukan admin-only, beda dari
 *  `app/api/user-management/news/[id]`). Sama seperti `/api/news`, tidak
 *  ter-scope company. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  try {
    const { id } = await params;
    const result = await newsApi.getNewsById(id);
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
