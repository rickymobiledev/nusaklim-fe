/**
 * Kontrak response standar — dipakai SEMUA endpoint (mock maupun API
 * asli nanti). Jangan biarkan satu endpoint punya bentuk beda sendiri.
 */

export interface ApiMeta {
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: ApiMeta;
  message?: string;
}

export interface ApiItemResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}

/** Di-throw oleh implementasi mock/real kalau gagal — komponen UI cuma
 *  perlu tahu satu pola penanganan error di seluruh aplikasi. */
/** Kode `ApiError` saat sesi/access token tidak valid lagi — dipetakan ke
 *  HTTP 401 (route-guard) dan memicu redirect ke /login (client-fetch). */
export const UNAUTHENTICATED = "UNAUTHENTICATED";

export class ApiError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string;
}
