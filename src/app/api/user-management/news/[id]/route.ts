import { NextResponse } from "next/server";
import { newsApi } from "@/lib/api";
import { parseNewsForm } from "@/lib/news-form";
import { requireAdmin, apiErrorResponse } from "@/lib/api/route-guard";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  const { id } = await params;
  try {
    return NextResponse.json(await newsApi.getNewsById(id));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, unauthorized } = await requireAdmin();
  if (!user) return unauthorized;

  const { id } = await params;
  try {
    const result = await newsApi.deleteNews(id);
    return NextResponse.json({ data: null, message: result.message });
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

  const { id } = await params;
  const parsed = await parseNewsForm(request);
  if (!parsed.ok) return parsed.response;

  try {
    return NextResponse.json(await newsApi.updateNews({ id, ...parsed.input }));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export const POST = PUT;
