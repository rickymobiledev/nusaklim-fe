import { ApiError } from "@/types/api";
import type { ApiListResponse } from "@/types/api";
import type { UserRoleOption } from "@/types/user-management";
import { createApiClient } from "./fetcher";
import { mapRawUserRole, type RawUserRole } from "./adapters/user-management-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import type { UserRolesApi } from "./user-roles-api";

/** `GET /user_roles` — 4 role tetap (ADMINISTRATOR/RESEARCHER/
 *  VIEWER_ANPER/VIEWER_HOLDING), dipakai dropdown "Peran" di form
 *  Tambah/Edit Pengguna. */
const client = createApiClient();

export const userRolesClient: UserRolesApi = {
  async getUserRoles(): Promise<ApiListResponse<UserRoleOption>> {
    try {
      const res = await client.get<{
        status: boolean;
        message: string;
        data: RawUserRole[];
      }>("/user_roles");

      if (!res.data.status) {
        throw new ApiError(
          "USER_ROLE_FETCH_FAILED",
          res.data.message || "Gagal mengambil data peran dari server.",
        );
      }

      const roles = res.data.data.map(mapRawUserRole);
      return {
        data: roles,
        meta: { page: 1, pageSize: roles.length, total: roles.length },
      };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "USER_ROLE_FETCH_FAILED",
        extractBackendErrorMessage(err) ??
          "Gagal terhubung ke server. Periksa koneksi internet.",
      );
    }
  },
};
