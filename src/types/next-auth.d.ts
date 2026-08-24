import type { DefaultSession } from "next-auth";
import type { UserRole } from "./auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    user: {
      nikSap: string;
      role: UserRole;
      roleName: string;
      companyCode: string;
      companyName: string;
    } & DefaultSession["user"];
  }

  interface User {
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
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    nikSap: string;
    role: UserRole;
    roleName: string;
    companyCode: string;
    companyName: string;
  }
}
