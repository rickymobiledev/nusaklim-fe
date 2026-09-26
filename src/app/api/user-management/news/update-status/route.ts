import { NextResponse } from "next/server";
import { newsApi } from "@/lib/api";
import { requireAdmin, apiErrorResponse } from "@/lib/api/route-guard";

/** `POST /api/user-management/news/update-status`
 *  Body JSON: `{ id: string, status: "draft" | "published" | "archived" }` */
export async function POST(request: Request) {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  try {
    const { id, status } = (await request.json()) as {
      id: string;
      status: "draft" | "published" | "archived";
    };
    const result = await newsApi.updateStatus(id, status);
    return NextResponse.json({ data: null, message: result.message });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
