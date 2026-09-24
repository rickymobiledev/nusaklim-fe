import { NextResponse } from "next/server";
import { forgotPasswordClient } from "@/lib/api/forgot-password-client";
import { apiErrorResponse } from "@/lib/api/route-guard";
import { ApiError } from "@/types/api";

/** SENGAJA tanpa `requireUser()` — dipanggil dari halaman
 *  `/forgot-password` yang diakses user yang BELUM login. `app/api/**`
 *  sudah dikecualikan dari matcher `src/proxy.ts`, jadi tidak perlu ubah
 *  file itu. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string };
  const email = body.email?.trim();

  if (!email) {
    return apiErrorResponse(new ApiError("VALIDATION_ERROR", "Email wajib diisi."));
  }

  try {
    const result = await forgotPasswordClient.requestReset(email);
    return NextResponse.json({ data: result });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
