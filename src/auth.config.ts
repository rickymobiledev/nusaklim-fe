import type { NextAuthConfig } from "next-auth";
import { validateSessionToken } from "./lib/auth/session-probe";

/**
 * Konfigurasi yang "edge-safe" — dipisah dari `auth.ts` karena file ini juga
 * di-import oleh `middleware.ts` yang berjalan di Edge Runtime. Jangan taruh
 * provider yang butuh Node.js API (bcrypt, driver DB, dll) di sini.
 */
/** Umur maksimum cookie/JWT. Ini BUKAN batas sesi sebenarnya — batas absolut
 *  & idle (berbeda untuk "Ingat Saya") ditegakkan di server lewat
 *  `SESSION_LIMITS` di lib/auth/session-probe.ts. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 hari

export const sessionCookie = {
  name: "nusaklim.session-token",
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  },
};

export { isAccessTokenExpired } from "./lib/auth/session-probe";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
  },
  cookies: {
    sessionToken: sessionCookie,
  },
  callbacks: {
    // Sesi mati kalau access token backend expired ATAU sudah di-revoke
    // (logout) — return null membuat Auth.js menghapus cookie sesi
    // (berlaku juga di proxy). Lihat lib/auth/session-probe.ts.
    jwt({ token }) {
      return validateSessionToken(token);
    },
    // Dipanggil oleh middleware untuk memutuskan apakah request boleh lanjut.
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      // Halaman auth publik (belum ada sesi): login & lupa password.
      const isOnLogin =
        pathname.startsWith("/login") || pathname.startsWith("/forgot-password");

      if (isOnLogin) {
        // Sudah login tapi buka /login -> lempar ke dashboard.
        return isLoggedIn ? Response.redirect(new URL("/", request.nextUrl)) : true;
      }

      // Semua route lain wajib login. Redirect manual ke /login (tanpa
      // `?callbackUrl=`) — kalau return false, NextAuth menambahkannya otomatis.
      return isLoggedIn || Response.redirect(new URL("/login", request.nextUrl));
    },
  },
  providers: [], // provider sesungguhnya didaftarkan di auth.ts
};
