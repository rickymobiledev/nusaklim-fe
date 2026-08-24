import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ApiError } from "@/types/api";
import type { UserRole } from "@/types/auth";

/** Bentuk `user` yang dibalikin `requireUser()` — dipakai Route Handler
 *  yang perlu meneruskan `user` (bukan cuma `companyCode`) ke helper lain,
 *  mis. `parseParams(request, user)` di route monitoring. */
export type SessionUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/**
 * Dipanggil di awal tiap Route Handler internal (`app/api/**`) yang butuh
 * sesi. `src/proxy.ts` sengaja TIDAK meng-cover `app/api/**` (selain
 * `api/auth`) — kalau ikut ke-cover, gagal sesi bikin NextAuth redirect ke
 * `/login` (cocok untuk halaman, salah untuk endpoint yang dipanggil
 * `fetch()` dari client, yang butuh JSON 401), jadi tiap Route Handler cek
 * sesi sendiri di sini.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      user: null,
      unauthorized: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { user, unauthorized: null };
}

const CROSS_COMPANY_ROLES: UserRole[] = ["ADMINISTRATOR", "RESEARCHER"];

/**
 * SATU-SATUNYA tempat yang boleh menentukan `companyId` final untuk query
 * data — Route Handler WAJIB pakai ini, JANGAN PERNAH pakai
 * `searchParams.get("companyId")` mentah (itu IDOR: client bisa minta
 * data company lain lewat query string). `VIEWER_ANPER`/`VIEWER_HOLDING`
 * SELALU dipaksa ke `user.companyCode` — `requestedCompanyId` dari client
 * DIABAIKAN buat role ini, apapun isinya. `ADMINISTRATOR`/`RESEARCHER`
 * SEMENTARA boleh lintas company (`requestedCompanyId` dipakai kalau ada,
 * `undefined` = tanpa filter/semua company) — **ini belum keputusan final
 * dari PM**, lihat CLAUDE.md bagian "companyId (multi-tenant)" sebelum
 * menganggap perilaku ini permanen.
 */
export function resolveCompanyId(
  user: { companyCode: string; role: UserRole },
  requestedCompanyId?: string,
): string | undefined {
  if (CROSS_COMPANY_ROLES.includes(user.role)) {
    return requestedCompanyId;
  }
  return user.companyCode;
}

/** Satu tempat konversi `ApiError` (dari `lib/api/*`) jadi response JSON —
 *  dipakai di blok `catch` tiap Route Handler. */
export function apiErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { code: error.code, message: error.message },
      { status: 400 },
    );
  }
  return NextResponse.json(
    { code: "UNKNOWN", message: "Terjadi kesalahan yang tidak diketahui." },
    { status: 500 },
  );
}
