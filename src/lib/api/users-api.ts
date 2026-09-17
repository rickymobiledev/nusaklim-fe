import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type {
  CreateUserInput,
  ManagedUser,
  UpdateUserInput,
} from "@/types/user-management";

/** `GET /users` TIDAK company-scoped (admin lihat semua company) DAN
 *  TIDAK punya pagination di sisi BE — selalu balikin semua user. */
export interface UsersApi {
  getUsers(): Promise<ApiListResponse<ManagedUser>>;
  createUser(input: CreateUserInput): Promise<ApiItemResponse<ManagedUser>>;
  updateUser(input: UpdateUserInput): Promise<ApiItemResponse<ManagedUser>>;
  deleteUser(id: string): Promise<void>;
}
