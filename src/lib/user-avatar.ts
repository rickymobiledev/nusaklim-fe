/** Validasi foto profil pengguna (form Tambah/Edit Pengguna) — pola sama
 *  `lib/missing-data-import.ts`. Foto BELUM dikirim ke BE (`POST/PUT /users`
 *  belum punya field foto), jadi ini murni validasi UI. */
export const MAX_AVATAR_FILE_SIZE = 2 * 1024 * 1024;
export const AVATAR_MIME_TYPES = ["image/jpeg", "image/png"];
export const AVATAR_ACCEPT = ".jpeg,.jpg,.png";

/** Balikin pesan error Bahasa Indonesia, atau `null` kalau file valid. */
export function validateAvatarFile(file: { type: string; size: number }): string | null {
  if (!AVATAR_MIME_TYPES.includes(file.type)) {
    return "Format foto harus JPEG, JPG, atau PNG.";
  }
  if (file.size > MAX_AVATAR_FILE_SIZE) {
    return "Ukuran foto maksimal 2MB.";
  }
  return null;
}
