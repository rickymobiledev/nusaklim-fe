import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { API_V2_URL } from "./constants";
import { detectLoginMethod } from "./lib/auth/detect-login-method";
import { MOCK_USERS } from "./lib/api/mock/auth";
import type { BackendUserProfile, UserRole } from "./types/auth";

/**
 * Backend TIDAK mengeluarkan token/JWT sendiri — cuma balikin profil user
 * (nik_sap, name, image_url, user_role_code, user_role_name, company_code,
 * company_name). Sesi yang dipakai app ini adalah JWT yang di-generate
 * Auth.js sendiri setelah verifikasi ke backend berhasil, bukan pass-through
 * token dari backend.
 */
function mapProfileToUser(profile: BackendUserProfile) {
  return {
    id: profile.nik_sap,
    name: profile.name,
    image: profile.image_url,
    nikSap: profile.nik_sap,
    role: profile.user_role_code,
    roleName: profile.user_role_name,
    companyCode: profile.company_code,
    companyName: profile.company_name,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "NIK SAP / Email / Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        const identifier = String(credentials.identifier);
        const method = detectLoginMethod(identifier);

        // Mode mock: supaya tim FE bisa `pnpm dev` dan langsung login tanpa
        // menunggu backend siap. Set NEXT_PUBLIC_USE_MOCK_API=false di
        // .env.local begitu backend sungguhan sudah bisa dipanggil.
        if (process.env.NEXT_PUBLIC_USE_MOCK_API === "true") {
          const mockUser = MOCK_USERS.find((u) => u[method] === identifier);
          if (!mockUser) return null;
          return mapProfileToUser(mockUser);
        }

        // Backend expose 3 cara login (NIK SAP / Email / Username) ke satu
        // endpoint yang sama — body-nya yang beda tergantung metode. Endpoint
        // asli expect x-www-form-urlencoded (dikonfirmasi Postman), bukan JSON.
        // Header "api-key" wajib — di collection Postman ini di-set sebagai
        // auth level collection (berlaku ke semua endpoint termasuk login),
        // bukan cuma endpoint data lain.
        const res = await fetch(`${API_V2_URL}/authentications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "api-key": process.env.API_KEY ?? "",
          },
          body: new URLSearchParams({
            [method]: identifier,
            password: credentials.password as string,
          }),
        });

        if (!res.ok) return null;

        const profile = (await res.json()) as BackendUserProfile;
        return mapProfileToUser(profile);
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      // Saat login pertama kali, `user` berisi hasil authorize() di atas.
      if (user) {
        token.nikSap = user.nikSap;
        token.role = user.role;
        token.roleName = user.roleName;
        token.companyCode = user.companyCode;
        token.companyName = user.companyName;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.nikSap = token.nikSap as string;
      session.user.role = token.role as UserRole;
      session.user.roleName = token.roleName as string;
      session.user.companyCode = token.companyCode as string;
      session.user.companyName = token.companyName as string;
      return session;
    },
  },
});
