import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Next.js 16 renamed the "middleware.ts" convention to "proxy.ts" and does a
// static check for a literal function export — a destructured re-export
// (`export const { auth: proxy } = ...`) is NOT recognized even though it's
// a function at runtime, so we wrap it explicitly.
const { auth } = NextAuth(authConfig);

export function proxy(...args: Parameters<typeof auth>) {
  return auth(...args);
}

export const config = {
  // Lindungi semua route KECUALI: file statis dan seluruh app/api/**.
  // Route Handler internal (app/api/stations, app/api/weather, dst) cek
  // sesi sendiri lewat requireUser() (lib/api/route-guard.ts) dan balikin
  // JSON 401 — kalau ikut matcher ini, kegagalan sesi akan di-redirect ke
  // /login oleh NextAuth alih-alih dibalikin sebagai JSON, yang salah untuk
  // endpoint yang dipanggil fetch() dari client.
  //
  // images/ dan brand/ (public/images/**, public/brand/**) juga dikecualikan
  // — aset ini dipakai di halaman /login yang belum ada sesi, jadi kalau ikut
  // matcher ini requestnya di-redirect ke /login dan next/image gagal fetch
  // ("received null").
  matcher: ["/((?!api/|_next/static|_next/image|images/|brand/|favicon.ico).*)"],
};
