import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type {
  AghrisUser,
  CreateAghrisUserInput,
  UpdateAghrisUserInput,
} from "@/types/user-management";

/** Belum ada endpoint BE terkonfirmasi — lihat `aghris-users-client.ts`. */
export interface AghrisUsersApi {
  getAghrisUsers(): Promise<ApiListResponse<AghrisUser>>;
  createAghrisUser(input: CreateAghrisUserInput): Promise<ApiItemResponse<AghrisUser>>;
  updateAghrisUser(input: UpdateAghrisUserInput): Promise<ApiItemResponse<AghrisUser>>;
  deleteAghrisUser(id: string): Promise<void>;
}
