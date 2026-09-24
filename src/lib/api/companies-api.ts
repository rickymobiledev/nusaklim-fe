import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type {
  Company,
  CreateCompanyInput,
  UpdateCompanyInput,
} from "@/types/user-management";

export interface CompaniesApi {
  getCompanies(): Promise<ApiListResponse<Company>>;
  createCompany(input: CreateCompanyInput): Promise<ApiItemResponse<Company>>;
  updateCompany(input: UpdateCompanyInput): Promise<ApiItemResponse<Company>>;
  deleteCompany(id: number): Promise<void>;
}
