export type UserRole = "ADMINISTRATOR" | "RESEARCHER" | "VIEWER_ANPER" | "VIEWER_HOLDING";

/** Mapping user_role_id → UserRole (berdasarkan urutan role dari backend). */
export const ROLE_ID_MAP: Record<number, UserRole> = {
  1: "ADMINISTRATOR",
  2: "RESEARCHER",
  3: "VIEWER_ANPER",
  4: "VIEWER_HOLDING",
};

/** Bentuk `data` di response asli `POST /api/v2/authentications/login` —
 *  response aslinya dibungkus envelope `{ status, message?, data }`,
 *  lihat pemakaian di `auth.ts`. Sesi aplikasi ini di-generate Auth.js
 *  sendiri, bukan pass-through token dari backend.
 *
 *  Catatan: endpoint ini mengembalikan `user_role_id` (number) dan
 *  `company_id` (number), bukan `user_role_code`/`company_code` string.
 *  Semua field dibuat optional untuk fleksibilitas apabila endpoint berubah. */
export interface BackendUserProfile {
  /** Login user biasa. Login Aghris TIDAK punya `id`, hanya `nik_sap`. */
  id?: string;
  /** Login Aghris. */
  nik_sap?: string;
  name: string;
  username?: string;
  email?: string;
  image_url?: string | null;
  /** Dari endpoint lama (jika ada). */
  user_role_code?: UserRole;
  user_role_name?: string;
  company_code?: string;
  company_name?: string;
  /** Dari endpoint baru — backend kirim `user_role_id` sebagai string ("1"). */
  user_role_id?: number | string;
  company_id?: number;
  created_at?: string;
  updated_at?: string;
  user_role_created_at?: string;
  user_role_updated_at?: string;
  company_image_url?: string | null;
  company_created_at?: string;
  company_updated_at?: string;
}

/** Response `POST /api/v2/authentications/login`. Token backend ada di
 *  root envelope (sejajar `data`), bukan di dalam `data`. */
export interface BackendLoginResponse {
  status: boolean;
  message?: string;
  data: BackendUserProfile;
  /** ISO 8601 dengan offset, mis. `2026-11-08T13:59:14+07:00`. */
  expires_at?: string;
  /** Biasanya `Bearer`. */
  token_type?: string;
  access_token?: string;
}

/** Info profil tambahan yang disimpan di JWT/sesi selain field inti
 *  (`id`, `name`, `email`, `image`, role, company). */
export interface UserProfileExtra {
  username: string;
  userRoleId: string;
  companyId: string;
  companyImageUrl: string;
  createdAt: string;
  updatedAt: string;
  roleCreatedAt: string;
  roleUpdatedAt: string;
  companyCreatedAt: string;
  companyUpdatedAt: string;
}
