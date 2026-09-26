import { NextResponse } from "next/server";
import { notificationApi } from "@/lib/api";
import { requireUser, apiErrorResponse } from "@/lib/api/route-guard";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const { id } = await params;
  try {
    const result = await notificationApi.getNotifications(user.id);
    const item = result.data.find((n) => n.id === id);
    if (!item) {
      return NextResponse.json(
        { code: "NOTIFICATION_NOT_FOUND", message: "Notifikasi tidak ditemukan." },
        { status: 404 },
      );
    }
    return NextResponse.json({ data: item });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
