import { ApiError } from "@/types/api";

/** Dipakai di hooks (`"use client"`) untuk manggil Route Handler internal
 *  (`app/api/**`). Convert respons gagal (401 dari route-guard, atau
 *  ApiError yang di-throw lib/api/*) jadi `ApiError` supaya
 *  `isError`/`error` di TanStack Query bekerja benar — tanpa ini,
 *  `res.json()` polos akan memperlakukan body error sebagai data valid. */
export async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const code =
      (body?.code as string | undefined) ??
      (body?.error as string | undefined) ??
      "FETCH_FAILED";
    const message = (body?.message as string | undefined) ?? "Gagal memuat data.";
    throw new ApiError(code, message);
  }

  return body as T;
}
