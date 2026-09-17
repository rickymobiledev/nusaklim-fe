import type { ApiListResponse } from "@/types/api";
import type { UserRoleOption } from "@/types/user-management";

export interface UserRolesApi {
  getUserRoles(): Promise<ApiListResponse<UserRoleOption>>;
}
