import type { UserRole } from "./auth";

/**
 * Domain "Manajemen Pengguna" (admin-only) — BUKAN domain cuaca/stasiun,
 * jadi sengaja dipisah dari `domain.ts` (konvensi field Bahasa Indonesia
 * di file itu khusus domain weather). Field di sini Bahasa Inggris,
 * mengikuti field asli backend (`GET/POST/PUT/DELETE /users`,
 * `GET /companies`, `GET /user_roles`).
 */

export interface Company {
  id: number;
  code: string;
  name: string;
  imageUrl: string | null;
}

/** Form Tambah/Edit Perusahaan. Logo BELUM ikut (kontrak upload BE belum ada). */
export interface CreateCompanyInput {
  name: string;
  code: string;
}

export interface UpdateCompanyInput extends CreateCompanyInput {
  id: number;
}

export interface UserRoleOption {
  id: string;
  code: UserRole;
  name: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string | null;
  role: UserRoleOption;
  company: Company;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  username: string;
  email: string;
  password: string;
  userRoleId: string;
  companyId: string;
}

/** `PUT /users` asli TIDAK menerima `email`/`password` (dikonfirmasi lewat
 *  curl user — payload update cuma `id, name, username, user_role_id,
 *  company_id`) — jangan tambah field itu di sini tanpa konfirmasi ulang
 *  kontrak BE. */
export interface UpdateUserInput {
  id: string;
  name: string;
  username: string;
  userRoleId: string;
  companyId: string;
}

/** Pengguna Aghris — kontrak BE belum ada, bentuk mengikuti Figma
 *  (nama, NIP SAP, peran, perusahaan). Sementara dilayani mock, lihat
 *  `lib/api/aghris-users-client.ts`. */
export interface AghrisUser {
  id: string;
  name: string;
  nipSap: string;
  imageUrl: string | null;
  /** Kosong untuk data mock awal — form Edit mencocokkan lewat `roleName`. */
  roleId: string;
  roleName: string;
  companyName: string;
}

export interface CreateAghrisUserInput {
  nipSap: string;
  roleId: string;
}

export interface UpdateAghrisUserInput {
  id: string;
  nipSap: string;
  roleId: string;
}
