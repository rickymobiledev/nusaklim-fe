import type { DefaultSession } from "next-auth";
import type { UserProfileExtra, UserRole } from "./auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    user: {
      /** ID user dari backend (`data.id` login) — dipakai sbg `notifiable_id`. */
      id: string;
      nikSap: string;
      role: UserRole;
      roleName: string;
      companyCode: string;
      companyName: string;
    } & UserProfileExtra &
      DefaultSession["user"];
  }

  interface User extends UserProfileExtra {
    accessToken?: string;
    refreshToken?: string;
    tokenType?: string;
    /** ISO 8601 dari `expires_at` login backend. */
    accessTokenExpiresAt?: string;
    /** Checkbox "Ingat Saya" saat login — menentukan batas sesi (VA-04). */
    rememberMe?: boolean;
    nikSap: string;
    role: UserRole;
    roleName: string;
    companyCode: string;
    companyName: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends UserProfileExtra {
    accessToken?: string;
    refreshToken?: string;
    tokenType?: string;
    /** ISO 8601 dari `expires_at` login backend. */
    accessTokenExpiresAt?: string;
    /** Lihat `SESSION_LIMITS` di lib/auth/session-probe.ts. */
    rememberMe?: boolean;
    /** Epoch ms saat login — dasar batas absolut. */
    authTime?: number;
    /** Epoch ms aktivitas terakhir — dasar batas idle. */
    lastActivity?: number;
    userId: string;
    nikSap: string;
    role: UserRole;
    roleName: string;
    companyCode: string;
    companyName: string;
  }
}
