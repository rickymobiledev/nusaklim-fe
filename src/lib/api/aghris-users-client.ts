import { ApiError } from "@/types/api";
import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type {
  AghrisUser,
  CreateAghrisUserInput,
  UpdateAghrisUserInput,
} from "@/types/user-management";
import { createApiClient } from "./fetcher";
import { mapRawAghrisUser, type RawAghrisUser } from "./adapters/user-management-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { AghrisUsersApi } from "./aghris-users-api";

/** `GET /aghris_users` — daftar pengguna Aghris. Kontrak tambah/ubah/hapus
 *  BELUM ada, jadi ketiganya masih melempar `AGHRIS_NOT_IMPLEMENTED`. */
const client = createApiClient();

function notImplemented(): never {
  throw new ApiError(
    "AGHRIS_NOT_IMPLEMENTED",
    "Endpoint tambah/ubah/hapus Pengguna Aghris belum tersedia.",
  );
}

export const aghrisUsersClient: AghrisUsersApi = {
  async getAghrisUsers(): Promise<ApiListResponse<AghrisUser>> {
    try {
      const res = await client.get<{
        status: boolean;
        message: string;
        data: RawAghrisUser[];
      }>("/aghris_users");

      if (!res.data.status) {
        throw new ApiError(
          "AGHRIS_FETCH_FAILED",
          res.data.message || "Gagal mengambil data pengguna Aghris dari server.",
        );
      }

      const rawItems = Array.isArray(res.data.data) ? res.data.data : [];
      const data = rawItems.map(mapRawAghrisUser);
      return {
        data,
        meta: { page: 1, pageSize: data.length, total: data.length },
      };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "AGHRIS_FETCH_FAILED",
        extractBackendErrorMessage(err) ??
          "Gagal terhubung ke server. Periksa koneksi internet.",
      );
    }
  },

  async createAghrisUser(
    _input: CreateAghrisUserInput,
  ): Promise<ApiItemResponse<AghrisUser>> {
    return notImplemented();
  },

  async updateAghrisUser(
    _input: UpdateAghrisUserInput,
  ): Promise<ApiItemResponse<AghrisUser>> {
    return notImplemented();
  },

  async deleteAghrisUser(_id: string): Promise<void> {
    return notImplemented();
  },
};
