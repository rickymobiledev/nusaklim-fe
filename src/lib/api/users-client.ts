import { ApiError } from "@/types/api";
import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type {
  CreateUserInput,
  ManagedUser,
  UpdateUserInput,
} from "@/types/user-management";
import { createApiClient } from "./fetcher";
import { mapRawUser, type RawManagedUser } from "./adapters/user-management-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { UsersApi } from "./users-api";

/** `GET/POST/PUT/DELETE /users` TIDAK company-scoped — dipanggil lewat
 *  `createApiClient()` TANPA `companyCode` (persis `publicApi`), karena
 *  halaman ini admin-only dan memang harus lihat/kelola user lintas
 *  company. Body create/update/delete WAJIB urlencoded (dikonfirmasi
 *  curl user), bukan JSON — override header `Content-Type` per-request,
 *  pola sama `src/auth.ts` `authorize()`. */
const client = createApiClient();

const FORM_HEADERS = { "Content-Type": "application/x-www-form-urlencoded" };

export const usersClient: UsersApi = {
  async getUsers(): Promise<ApiListResponse<ManagedUser>> {
    try {
      const res = await client.get<{
        status: boolean;
        message: string;
        data: RawManagedUser[];
      }>("/users");

      if (!res.data.status) {
        throw new ApiError(
          "USER_FETCH_FAILED",
          res.data.message || "Gagal mengambil data pengguna dari server.",
        );
      }

      const users = res.data.data.map(mapRawUser);
      return {
        data: users,
        meta: { page: 1, pageSize: users.length, total: users.length },
      };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "USER_FETCH_FAILED",
        extractBackendErrorMessage(err) ??
          "Gagal terhubung ke server. Periksa koneksi internet.",
      );
    }
  },

  async createUser(input: CreateUserInput): Promise<ApiItemResponse<ManagedUser>> {
    try {
      const res = await client.post<{
        status: boolean;
        message: string;
        data: RawManagedUser;
      }>(
        "/users",
        new URLSearchParams({
          name: input.name,
          username: input.username,
          email: input.email,
          password: input.password,
          user_role_id: input.userRoleId,
          company_id: input.companyId,
        }).toString(),
        { headers: FORM_HEADERS },
      );

      if (!res.data.status) {
        throw new ApiError(
          "USER_CREATE_FAILED",
          res.data.message || "Gagal menambahkan pengguna baru.",
        );
      }

      return { data: mapRawUser(res.data.data) };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "USER_CREATE_FAILED",
        extractBackendErrorMessage(err) ??
          "Gagal terhubung ke server. Periksa koneksi internet.",
      );
    }
  },

  async updateUser(input: UpdateUserInput): Promise<ApiItemResponse<ManagedUser>> {
    try {
      const res = await client.put<{
        status: boolean;
        message: string;
        data: RawManagedUser;
      }>(
        "/users",
        new URLSearchParams({
          id: input.id,
          name: input.name,
          username: input.username,
          user_role_id: input.userRoleId,
          company_id: input.companyId,
        }).toString(),
        { headers: FORM_HEADERS },
      );

      if (!res.data.status) {
        throw new ApiError(
          "USER_UPDATE_FAILED",
          res.data.message || "Gagal memperbarui data pengguna.",
        );
      }

      return { data: mapRawUser(res.data.data) };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "USER_UPDATE_FAILED",
        extractBackendErrorMessage(err) ??
          "Gagal terhubung ke server. Periksa koneksi internet.",
      );
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      const res = await client.delete<{ status: boolean; message: string }>("/users", {
        data: new URLSearchParams({ id }).toString(),
        headers: FORM_HEADERS,
      });

      if (!res.data.status) {
        throw new ApiError(
          "USER_DELETE_FAILED",
          res.data.message || "Gagal menghapus pengguna.",
        );
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "USER_DELETE_FAILED",
        extractBackendErrorMessage(err) ??
          "Gagal terhubung ke server. Periksa koneksi internet.",
      );
    }
  },
};
