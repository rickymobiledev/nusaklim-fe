import type { NextAuthConfig } from "next-auth";

/**
 * Konfigurasi yang "edge-safe" — dipisah dari `auth.ts` karena file ini juga
 * di-import oleh `middleware.ts` yang berjalan di Edge Runtime. Jangan taruh
 * provider yang butuh Node.js API (bcrypt, driver DB, dll) di sini.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
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
