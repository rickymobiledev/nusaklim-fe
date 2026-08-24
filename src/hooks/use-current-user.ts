"use client";

import { useSession } from "next-auth/react";

/** Dipakai di Client Component. Untuk Server Component/Route Handler,
 *  pakai `getCurrentUser()` (src/lib/auth/current-user.ts). */
export function useCurrentUser() {
  const { data: session, status } = useSession();
  return { user: session?.user, isLoading: status === "loading" };
}
