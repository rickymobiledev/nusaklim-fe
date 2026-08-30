import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { API_V2_URL } from "./constants";
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
    id: profile.id,
    name: profile.name,
    image: profile.image_url,
    nikSap: profile.id,
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
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const username = String(credentials.username);

        // Login SELALU ke backend asli — tidak ada jalur mock (dihapus
        // sengaja supaya tidak ada risiko demo/produksi ke-toggle balik
        // ke kredensial contoh). Domain data lain (weather/monitoring/dst)
        // masih mock, lihat lib/api/index.ts.
        // Backend expose 3 cara login (NIK SAP / Email / Username) ke satu
        // endpoint yang sama, body field beda per mode — app ini fix pakai
        // mode "Username" (dikonfirmasi Postman). Endpoint asli expect
        // x-www-form-urlencoded, bukan JSON. Header "api-key" wajib — di
        // collection Postman ini di-set sebagai auth level collection
        // (berlaku ke semua endpoint termasuk login), bukan cuma endpoint
        // data lain.
        const res = await fetch(`${API_V2_URL}/authentications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "api-key": process.env.API_KEY ?? "",
          },
          body: new URLSearchParams({
            username,
            password: credentials.password as string,
          }),
        });

        if (!res.ok) return null;

        // Response asli dibungkus envelope { status, message, data } —
        // BUKAN flat BackendUserProfile langsung (dikonfirmasi dari sample
        // response asli, sama pola dengan /devices/status).
        const body = (await res.json()) as {
          status: boolean;
          message: string;
          data: BackendUserProfile;
        };
        if (!body.status) return null; // login ditolak BE meski HTTP 200

        return mapProfileToUser(body.data);
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
