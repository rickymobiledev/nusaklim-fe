import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { API_V2_URL } from "./constants";
import { ROLE_ID_MAP } from "./types/auth";
import type { BackendUserProfile, UserRole } from "./types/auth";

/**
 * Backend TIDAK mengeluarkan token/JWT sendiri — cuma balikin profil user.
 * Sesi yang dipakai app ini adalah JWT yang di-generate Auth.js sendiri
 * setelah verifikasi ke backend berhasil, bukan pass-through token dari backend.
 *
 * Response aktual `/authentications/login` mengembalikan `user_role_id` (int)
 * dan `company_id` (int). Fallback ke `user_role_code` / `company_code` string
 * jika tersedia (kompatibilitas ke endpoint lama).
 */
function mapProfileToUser(profile: BackendUserProfile) {
  const role: UserRole =
    profile.user_role_code ??
    (profile.user_role_id !== undefined
      ? (ROLE_ID_MAP[profile.user_role_id] ?? "RESEARCHER")
      : "RESEARCHER");

  return {
    id: profile.id,
    name: profile.name,
    image: profile.image_url ?? null,
    nikSap: profile.id,
    role,
    roleName: profile.user_role_name ?? role,
    companyCode: profile.company_code ?? String(profile.company_id ?? ""),
    companyName: profile.company_name ?? "",
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Identifier", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        const identifier = String(credentials.identifier);

        const url = `${API_V2_URL}/authentications/login`;
        console.log("[auth] POST", url, "identifier=", identifier);

        let res: Response;
        try {
          res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "api-key": process.env.API_KEY ?? "",
            },
            body: new URLSearchParams({
              identifier,
              password: credentials.password as string,
            }),
          });
        } catch (err) {
          console.error("[auth] fetch error:", err);
          return null;
        }

        const text = await res.text();
        console.log("[auth] HTTP", res.status, text.slice(0, 300));

        if (!res.ok) return null;

        let body: { status: boolean; message: string; data: BackendUserProfile };
        try {
          body = JSON.parse(text);
        } catch {
          console.error("[auth] response is not JSON:", text.slice(0, 300));
          return null;
        }

        if (!body.status) {
          console.warn("[auth] login rejected by BE:", body.message);
          return null;
        }

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
