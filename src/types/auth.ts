export type UserRole = "ADMINISTRATOR" | "RESEARCHER" | "VIEWER_ANPER" | "VIEWER_HOLDING";

/** Bentuk `data` di response asli `POST /api/v2/authentications` —
 *  response aslinya dibungkus envelope `{ status, message, data }`,
 *  lihat pemakaian di `auth.ts`. Sesi aplikasi ini di-generate Auth.js
 *  sendiri, bukan pass-through token dari backend. */
export interface BackendUserProfile {
  id: string; // BUKAN `nik_sap` — field itu tidak ada di response asli
  name: string;
  image_url: string | null;
  user_role_code: UserRole;
  user_role_name: string;
  company_code: string;
  company_name: string;
}
