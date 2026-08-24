export type UserRole = "ADMINISTRATOR" | "RESEARCHER" | "VIEWER_ANPER" | "VIEWER_HOLDING";

export type LoginMethod = "nik_sap" | "email" | "username";

/** Bentuk response asli dari `POST /api/v2/authentications` — cuma profil
 *  user, BUKAN token. Sesi aplikasi ini di-generate Auth.js sendiri. */
export interface BackendUserProfile {
  nik_sap: string;
  name: string;
  image_url: string | null;
  user_role_code: UserRole;
  user_role_name: string;
  company_code: string;
  company_name: string;
}
