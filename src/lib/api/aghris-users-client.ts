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

/** `GET/POST/PUT/DELETE /aghris_users` — tidak company-scoped. Body
 *  create/update/delete WAJIB urlencoded (create & update: `nik_sap`,
 *  `user_role_code`; delete: `nik_sap`), pola sama `users-client.ts`. */
const client = createApiClient();

const FORM_HEADERS = { "Content-Type": "application/x-www-form-urlencoded" };

async function saveAghrisUser(
  method: "post" | "put",
  input: { nipSap: string; roleCode: string },
  errorCode: string,
  fallbackMessage: string,
): Promise<ApiItemResponse<AghrisUser>> {
  try {
    const res = await client[method]<{
      status: boolean;
      message: string;
      data?: RawAghrisUser;
    }>(
      "/aghris_users",
      new URLSearchParams({
        nik_sap: input.nipSap,
        user_role_code: input.roleCode,
      }).toString(),
      { headers: FORM_HEADERS },
    );
    if (!res.data.status) {
      throw new ApiError(errorCode, res.data.message || fallbackMessage);
    }
    // Daftar di-refetch setelah mutasi; data balikan BE tidak dijamin lengkap.
    return {
      data: mapRawAghrisUser(
        res.data.data ?? {
          nik_sap: input.nipSap,
          name: "",
          company_code: "",
          company_name: "",
          user_role_code: input.roleCode as RawAghrisUser["user_role_code"],
          user_role_name: "",
          image_url: null,
        },
      ),
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      errorCode,
      extractBackendErrorMessage(err) ??
        "Gagal terhubung ke server. Periksa koneksi internet.",
    );
  }
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
    input: CreateAghrisUserInput,
  ): Promise<ApiItemResponse<AghrisUser>> {
    return saveAghrisUser("post", input, "AGHRIS_CREATE_FAILED", "Gagal menambahkan pengguna Aghris.");
  },

  async updateAghrisUser(
    input: UpdateAghrisUserInput,
  ): Promise<ApiItemResponse<AghrisUser>> {
    return saveAghrisUser("put", input, "AGHRIS_UPDATE_FAILED", "Gagal memperbarui pengguna Aghris.");
  },

  async deleteAghrisUser(id: string): Promise<void> {
    try {
      const res = await client.delete<{ status: boolean; message: string }>(
        "/aghris_users",
        {
          data: new URLSearchParams({ nik_sap: id }).toString(),
          headers: FORM_HEADERS,
        },
      );
      if (!res.data.status) {
        throw new ApiError(
          "AGHRIS_DELETE_FAILED",
          res.data.message || "Gagal menghapus pengguna Aghris.",
        );
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "AGHRIS_DELETE_FAILED",
        extractBackendErrorMessage(err) ??
          "Gagal terhubung ke server. Periksa koneksi internet.",
      );
    }
  },
};
