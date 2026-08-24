import { auth } from "@/auth";

/** Dipakai di Server Component / Route Handler. Untuk Client Component,
 *  pakai `useCurrentUser()` (src/hooks/use-current-user.ts). */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}
