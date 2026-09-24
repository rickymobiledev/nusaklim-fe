import { ApiError } from "@/types/api";
import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type {
  AghrisUser,
  CreateAghrisUserInput,
  UpdateAghrisUserInput,
} from "@/types/user-management";
import { userRolesClient } from "./user-roles-client";
import type { AghrisUsersApi } from "./aghris-users-api";

/** SEMENTARA: endpoint BE Pengguna Aghris belum ada/terkonfirmasi, jadi
 *  seluruh domain dilayani mock in-memory (pola sama `TEMP_USE_MOCK_NEWS`
 *  di `news-client.ts`). Set `false` HANYA setelah cabang real di bawah
 *  diimplementasi. Hapus = in-memory, hilang saat server restart. */
const TEMP_USE_MOCK_AGHRIS = true;

const MOCK_NAMES = [
  "M. Muzanny Zahsa, S.P.",
  "Rina Kusumawati, S.T.",
  "Andi Pratama, M.Si.",
  "Siti Nurhaliza, S.P.",
  "Budi Santoso, S.Hut.",
  "Dewi Lestari, S.Kom.",
  "Agus Salim, M.P.",
];

let mockStore: AghrisUser[] = MOCK_NAMES.map((name, i) => ({
  id: String(i + 1),
  name,
  nipSap: String(1003461 + i),
  imageUrl: null,
  roleId: "",
  roleName: "Viewer Anper",
  companyName: "PTPN I",
}));

let nextMockId = MOCK_NAMES.length + 1;

async function resolveRoleName(roleId: string): Promise<string> {
  const roles = await userRolesClient.getUserRoles();
  return roles.data.find((r) => r.id === roleId)?.name ?? "-";
}

export const aghrisUsersClient: AghrisUsersApi = {
  async getAghrisUsers(): Promise<ApiListResponse<AghrisUser>> {
    if (TEMP_USE_MOCK_AGHRIS) {
      return {
        data: mockStore,
        meta: { page: 1, pageSize: mockStore.length, total: mockStore.length },
      };
    }
    // TODO: implementasi real setelah kontrak endpoint BE Aghris dikonfirmasi.
    throw new ApiError(
      "AGHRIS_NOT_IMPLEMENTED",
      "Endpoint Pengguna Aghris belum tersedia.",
    );
  },

  async createAghrisUser(
    input: CreateAghrisUserInput,
  ): Promise<ApiItemResponse<AghrisUser>> {
    if (TEMP_USE_MOCK_AGHRIS) {
      // Figma cuma minta NIK SAP + Peran — nama & perusahaan diasumsikan
      // diisi BE dari NIK, jadi mock pakai nilai placeholder.
      const created: AghrisUser = {
        id: String(nextMockId++),
        name: `Pengguna Aghris ${input.nipSap}`,
        nipSap: input.nipSap,
        imageUrl: null,
        roleId: input.roleId,
        roleName: await resolveRoleName(input.roleId),
        companyName: "-",
      };
      mockStore = [created, ...mockStore];
      return { data: created };
    }
    throw new ApiError(
      "AGHRIS_NOT_IMPLEMENTED",
      "Endpoint Pengguna Aghris belum tersedia.",
    );
  },

  async updateAghrisUser(
    input: UpdateAghrisUserInput,
  ): Promise<ApiItemResponse<AghrisUser>> {
    if (TEMP_USE_MOCK_AGHRIS) {
      const existing = mockStore.find((u) => u.id === input.id);
      if (!existing) {
        throw new ApiError("AGHRIS_NOT_FOUND", "Pengguna Aghris tidak ditemukan.");
      }
      const updated: AghrisUser = {
        ...existing,
        nipSap: input.nipSap,
        roleId: input.roleId,
        roleName: await resolveRoleName(input.roleId),
      };
      mockStore = mockStore.map((u) => (u.id === input.id ? updated : u));
      return { data: updated };
    }
    throw new ApiError(
      "AGHRIS_NOT_IMPLEMENTED",
      "Endpoint Pengguna Aghris belum tersedia.",
    );
  },

  async deleteAghrisUser(id: string): Promise<void> {
    if (TEMP_USE_MOCK_AGHRIS) {
      mockStore = mockStore.filter((u) => u.id !== id);
      return;
    }
    throw new ApiError(
      "AGHRIS_NOT_IMPLEMENTED",
      "Endpoint Pengguna Aghris belum tersedia.",
    );
  },
};
