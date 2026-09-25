import { validateAvatarFile } from "@/lib/user-avatar";

/** Cover berita memakai aturan file yang sama dengan avatar (JPEG/PNG, maks 2 MB). */
export const validateNewsCoverFile = validateAvatarFile;
