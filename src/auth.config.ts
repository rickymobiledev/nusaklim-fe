import type { NextAuthConfig } from "next-auth";

/**
 * Konfigurasi yang "edge-safe" — dipisah dari `auth.ts` karena file ini juga
 * di-import oleh `middleware.ts` yang berjalan di Edge Runtime. Jangan taruh
 * provider yang butuh Node.js API (bcrypt, driver DB, dll) di sini.
 */
/** Durasi sesi saat "Ingat Saya" dicentang — lihat `app/api/auth/remember-me/route.ts`
 *  yang menulis ulang cookie ini tanpa `maxAge` (jadi session cookie) kalau tidak dicentang. */
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
    // Dipanggil oleh middleware untuk memutuskan apakah request boleh lanjut.
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = request.nextUrl.pathname.startsWith("/login");

      if (isOnLogin) {
        // Sudah login tapi buka /login -> lempar ke dashboard.
        return isLoggedIn ? Response.redirect(new URL("/", request.nextUrl)) : true;
      }

      // Semua route lain wajib login.
      return isLoggedIn;
    },
  },
  providers: [], // provider sesungguhnya didaftarkan di auth.ts
};
