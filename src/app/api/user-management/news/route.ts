import { NextResponse } from "next/server";
import { newsApi } from "@/lib/api";
import { parseNewsForm } from "@/lib/news-form";
import { requireAdmin, apiErrorResponse } from "@/lib/api/route-guard";

export async function GET() {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  try {
    return NextResponse.json(await newsApi.getNews());
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  const parsed = await parseNewsForm(request);
  if (!parsed.ok) return parsed.response;

  try {
    return NextResponse.json(await newsApi.createNews(parsed.input));
  } catch (error) {
    return apiErrorResponse(error);
  }
}
