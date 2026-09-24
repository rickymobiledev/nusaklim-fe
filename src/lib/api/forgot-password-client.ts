import { ApiError } from "@/types/api";
import { extractBackendErrorMessage } from "./backend-error";
import { publicApi } from "./fetcher";

/** `POST /forgot_password` — endpoint publik (tanpa sesi & tanpa
 *  `company_code`), makanya pakai `publicApi`. Body WAJIB
 *  x-www-form-urlencoded (bukan JSON) — override header `Content-Type`
 *  per-request, pola sama `src/auth.ts` `authorize()` & `users-client.ts`.
 *
 *  Pesan sukses/gagal dari BE ditampilkan apa adanya (konvensi domain
 *  auth/users), fallback ke teks generik kalau BE tidak sempat membalas. */
export const forgotPasswordClient = {
  async requestReset(email: string): Promise<{ message: string }> {
    try {
      const res = await publicApi.post<{ status: boolean; message: string }>(
        "/forgot_password",
        new URLSearchParams({ email }).toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );

      if (!res.data.status) {
        throw new ApiError(
          "FORGOT_PASSWORD_FAILED",
          res.data.message || "Gagal mengirim permintaan reset kata sandi.",
        );
      }

      return { message: res.data.message };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "FORGOT_PASSWORD_FAILED",
        extractBackendErrorMessage(err) ??
          "Gagal terhubung ke server. Periksa koneksi internet.",
      );
    }
  },
};
