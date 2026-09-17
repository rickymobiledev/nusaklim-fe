import type { Company, ManagedUser, UserRoleOption } from "@/types/user-management";
import type { UserRole } from "@/types/auth";

/** Bentuk mentah `GET/POST/PUT /users` (dikonfirmasi curl langsung ke
 *  backend asli) — field company/role datang ter-denormalisasi
 *  langsung di tiap baris user, tidak perlu join terpisah. */
export interface RawManagedUser {
  id: string;
  name: string;
  username: string;
  email: string;
  image_url: string | null;
  user_role_id: string;
  user_role_code: UserRole;
  user_role_name: string;
  company_id: number;
  company_code: string;
  company_name: string;
  company_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export function mapRawUser(raw: RawManagedUser): ManagedUser {
  return {
    id: raw.id,
    name: raw.name,
    username: raw.username,
    email: raw.email,
    imageUrl: raw.image_url,
    role: { id: raw.user_role_id, code: raw.user_role_code, name: raw.user_role_name },
    company: {
      id: raw.company_id,
      code: raw.company_code,
      name: raw.company_name,
      imageUrl: raw.company_image_url,
    },
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

/** Bentuk mentah `GET /companies`. */
export interface RawCompany {
  id: number;
  code: string;
  name: string;
  image_url: string | null;
}

export function mapRawCompany(raw: RawCompany): Company {
  return { id: raw.id, code: raw.code, name: raw.name, imageUrl: raw.image_url };
}

/** Bentuk mentah `GET /user_roles`. */
export interface RawUserRole {
  id: string;
  code: UserRole;
  name: string;
}

export function mapRawUserRole(raw: RawUserRole): UserRoleOption {
  return { id: raw.id, code: raw.code, name: raw.name };
}
