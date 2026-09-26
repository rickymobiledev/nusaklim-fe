import { NextResponse } from "next/server";
import { newsApi } from "@/lib/api";
import { requireAdmin, apiErrorResponse } from "@/lib/api/route-guard";

/** `POST /api/user-management/news/update-featured`
 *  Body JSON: `{ id: string, is_featured: boolean }` */
export async function POST(request: Request) {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  try {
    const { id, is_featured } = (await request.json()) as {
      id: string;
      is_featured: boolean;
    };
    const result = await newsApi.updateFeatured(id, is_featured);
    return NextResponse.json({ data: null, message: result.message });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
