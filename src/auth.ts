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
      ? (ROLE_ID_MAP[Number(profile.user_role_id)] ?? "RESEARCHER")
      : "RESEARCHER");

  // Login Aghris cuma punya `nik_sap` (tanpa `id`) -> `nik_sap` jadi `id`
  // sesi, sehingga `notifiable_id` otomatis berisi `nik_sap`.
  const id = String(profile.id ?? profile.nik_sap ?? "");

  return {
    id,
    name: profile.name,
    image: profile.image_url ?? null,
    nikSap: String(profile.nik_sap ?? profile.id ?? ""),
    role,
    roleName: profile.user_role_name ?? role,
    companyCode: profile.company_code ?? String(profile.company_id ?? ""),
    companyName: profile.company_name ?? "",
    username: profile.username ?? "",
    email: profile.email ?? null,
    userRoleId: String(profile.user_role_id ?? ""),
    companyId: String(profile.company_id ?? ""),
    companyImageUrl: profile.company_image_url ?? "",
    createdAt: profile.created_at ?? "",
    updatedAt: profile.updated_at ?? "",
    roleCreatedAt: profile.user_role_created_at ?? "",
    roleUpdatedAt: profile.user_role_updated_at ?? "",
    companyCreatedAt: profile.company_created_at ?? "",
    companyUpdatedAt: profile.company_updated_at ?? "",
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
        token.userId = user.id as string;
        token.nikSap = user.nikSap;
        token.role = user.role;
        token.roleName = user.roleName;
        token.companyCode = user.companyCode;
        token.companyName = user.companyName;
        token.username = user.username;
        token.userRoleId = user.userRoleId;
        token.companyId = user.companyId;
        token.companyImageUrl = user.companyImageUrl;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
        token.roleCreatedAt = user.roleCreatedAt;
        token.roleUpdatedAt = user.roleUpdatedAt;
        token.companyCreatedAt = user.companyCreatedAt;
        token.companyUpdatedAt = user.companyUpdatedAt;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId as string;
      session.user.nikSap = token.nikSap as string;
      session.user.role = token.role as UserRole;
      session.user.roleName = token.roleName as string;
      session.user.companyCode = token.companyCode as string;
      session.user.companyName = token.companyName as string;
      session.user.username = token.username as string;
      session.user.userRoleId = token.userRoleId as string;
      session.user.companyId = token.companyId as string;
      session.user.companyImageUrl = token.companyImageUrl as string;
      session.user.createdAt = token.createdAt as string;
      session.user.updatedAt = token.updatedAt as string;
      session.user.roleCreatedAt = token.roleCreatedAt as string;
      session.user.roleUpdatedAt = token.roleUpdatedAt as string;
      session.user.companyCreatedAt = token.companyCreatedAt as string;
      session.user.companyUpdatedAt = token.companyUpdatedAt as string;
      return session;
    },
  },
});
