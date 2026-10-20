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
    userId: string;
    nikSap: string;
    role: UserRole;
    roleName: string;
    companyCode: string;
    companyName: string;
  }
}
