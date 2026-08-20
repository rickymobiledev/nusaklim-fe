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
  // Lindungi semua route KECUALI: file statis, api/auth, dan halaman /login itu sendiri.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
