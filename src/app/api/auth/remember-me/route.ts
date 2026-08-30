import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { SESSION_MAX_AGE, sessionCookie } from "@/auth.config";

/**
 * Dipanggil sekali dari `login/page.tsx` setelah `signIn()` sukses. Auth.js
 * selalu men-set cookie sesi dengan `maxAge` panjang (`SESSION_MAX_AGE`) —
 * kalau checkbox "Ingat Saya" TIDAK dicentang, tulis ulang cookie yang sama
 * TANPA `maxAge`/`expires` supaya jadi session cookie (hilang saat browser
 * ditutup). Nama & opsi cookie di-reuse dari `auth.config.ts` supaya tidak
 * ada tebak-tebakan soal default internal Auth.js.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = await cookies();
  const current = store.get(sessionCookie.name);
  if (!current) {
    return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 401 });
  }

  const { rememberMe } = (await request.json()) as { rememberMe?: boolean };

  store.set(sessionCookie.name, current.value, {
    ...sessionCookie.options,
    ...(rememberMe ? { maxAge: SESSION_MAX_AGE } : {}),
  });

  return NextResponse.json({ ok: true });
}
