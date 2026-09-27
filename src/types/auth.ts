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
  id: string;
  name: string;
  username?: string;
  email?: string;
  image_url?: string | null;
  /** Dari endpoint lama (jika ada). */
  user_role_code?: UserRole;
  user_role_name?: string;
  company_code?: string;
  company_name?: string;
  /** Dari endpoint baru — integer ID. */
  user_role_id?: number;
  company_id?: number;
}
