import { signOut } from "next-auth/react";
import { ApiError, UNAUTHENTICATED } from "@/types/api";

/** Satu kali saja walau banyak query gagal 401 bersamaan. */
let signingOut = false;

/** Sesi habis (idle/absolute timeout, logout di tempat lain, atau access
 *  token backend expired) -> bersihkan cookie sesi & arahkan ke /login. */
function handleUnauthenticated() {
  if (signingOut || typeof window === "undefined") return;
  signingOut = true;
  void signOut({ callbackUrl: "/login" }).catch(() => {
    // Sengaja full reload (bukan router.push): fungsi ini dipanggil di luar
    // komponen, dan state client lama harus dibuang total.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/login");
  });
}

/** Dipakai di hooks (`"use client"`) untuk manggil Route Handler internal
 *  (`app/api/**`). Convert respons gagal (401 dari route-guard, atau
 *  ApiError yang di-throw lib/api/*) jadi `ApiError` supaya
 *  `isError`/`error` di TanStack Query bekerja benar — tanpa ini,
 *  `res.json()` polos akan memperlakukan body error sebagai data valid.
 *  Respons 401 juga memicu redirect ke /login. */
export async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const body = await res.json().catch(() => null);

  if (res.status === 401) {
    handleUnauthenticated();
    throw new ApiError(
      UNAUTHENTICATED,
      (body?.message as string | undefined) ?? "Sesi Anda telah berakhir. Silakan masuk kembali.",
    );
  }

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
