import NextAuth from "next-auth";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { authConfig } from "./auth.config";
import { isCrossOriginMutation } from "./lib/security/same-origin";

// Next.js 16 renamed the "middleware.ts" convention to "proxy.ts" and does a
// static check for a literal function export — a destructured re-export
// (`export const { auth: proxy } = ...`) is NOT recognized even though it's
// a function at runtime, so we wrap it explicitly.
const { auth } = NextAuth(authConfig);
const authProxy = auth as unknown as (
  request: NextRequest,
  event: NextFetchEvent,
) => Promise<Response | undefined>;

export function proxy(request: NextRequest, event: NextFetchEvent) {
  // `app/api/**`: HANYA cek CSRF (VA-05), TANPA auth() — Route Handler cek
  // sesi sendiri lewat requireUser() (lib/api/route-guard.ts) dan balikin
  // JSON 401. Kalau auth() ikut jalan di sini, kegagalan sesi akan
  // di-redirect ke /login alih-alih JSON, yang salah untuk fetch() client.
  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (isCrossOriginMutation(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  return authProxy(request, event);
}

export const config = {
  // Semua route KECUALI file statis. app/api/** ikut supaya kena cek CSRF
  // di atas (tanpa auth()).
  //
  // images/ dan brand/ (public/images/**, public/brand/**) dikecualikan
  // — aset ini dipakai di halaman /login yang belum ada sesi, jadi kalau ikut
  // matcher ini requestnya di-redirect ke /login dan next/image gagal fetch
  // ("received null").
  matcher: ["/((?!_next/static|_next/image|images/|brand/|favicon.ico).*)"],
};
