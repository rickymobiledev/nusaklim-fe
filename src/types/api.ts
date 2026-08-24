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
}

export interface ApiItemResponse<T> {
  data: T;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}

/** Di-throw oleh implementasi mock/real kalau gagal — komponen UI cuma
 *  perlu tahu satu pola penanganan error di seluruh aplikasi. */
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
