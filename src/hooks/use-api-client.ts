"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { createApiClient } from "@/lib/api-client";

/**
 * Pakai hook ini di dalam hook-hook data (use-stations, use-forecast, dst),
 * jangan langsung dipakai di komponen halaman — biar logic fetching tetap
 * terpisah dari logic tampilan.
 */
export function useApiClient() {
  const { data: session } = useSession();
  return useMemo(
    () => createApiClient(session?.accessToken),
    [session?.accessToken],
  );
}
