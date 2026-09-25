import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type { Station } from "@/types/domain";
import type { CreateStationInput, UpdateStationInput } from "@/types/user-management";

export interface StationsAdminApi {
  getStations(): Promise<ApiListResponse<Station>>;
  createStation(input: CreateStationInput): Promise<ApiItemResponse<Station>>;
  updateStation(input: UpdateStationInput): Promise<ApiItemResponse<Station>>;
  deleteStation(id: string): Promise<void>;
}
