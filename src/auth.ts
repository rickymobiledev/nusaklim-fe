import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { API_BASE_URL } from "./lib/constants";

/**
 * Asumsi arsitektur (ganti sesuai konfirmasi tim BE):
 *  - Backend punya endpoint POST {API_BASE_URL}/auth/login menerima
 *    { email, password } dan membalas { user, accessToken, refreshToken }.
 *  - Frontend TIDAK menyimpan token di localStorage. Token disimpan di dalam
 *    JWT sesi NextAuth, yang dienkripsi & disimpan sebagai httpOnly cookie.
 *  - Kalau BE ternyata pakai session cookie (bukan JWT), authorize() di bawah
 *    masih valid — tinggal sesuaikan apa yang disimpan ke dalam token NextAuth.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Mode mock: supaya tim FE bisa `npm run dev` dan langsung login tanpa
        // menunggu backend siap. Set NEXT_PUBLIC_USE_MOCK=false di .env.local
        // begitu backend sungguhan sudah bisa dipanggil.
        if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
          if (!credentials?.email || !credentials?.password) return null;
          return {
            id: "mock-user-1",
            name: "Guest",
            email: String(credentials.email),
            accessToken: "mock-access-token",
          };
        }

        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (!res.ok) return null;

        const data = await res.json();
        // Sesuaikan mapping ini dengan bentuk response BE yang sebenarnya.
        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          accessToken: data.accessToken as string,
          refreshToken: data.refreshToken as string | undefined,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      // Saat login pertama kali, `user` berisi hasil authorize() di atas.
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      // TODO: kalau backend pakai short-lived access token, cek kadaluarsa di
      // sini dan panggil endpoint refresh sebelum token dipakai lagi.
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});
