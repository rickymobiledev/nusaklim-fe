import type { ApiListResponse } from "@/types/api";
import type { Company } from "@/types/user-management";

export interface CompaniesApi {
  getCompanies(): Promise<ApiListResponse<Company>>;
}
