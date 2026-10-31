import { ApiError } from "@/types/api";
import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type { Station } from "@/types/domain";
import type { CreateStationInput, UpdateStationInput } from "@/types/user-management";
import { mapAdminDeviceToStation, type RawAdminDevice } from "./adapters/station-adapter";
import { extractBackendErrorMessage } from "./backend-error";
import { createApiClient } from "./fetcher";
import type { StationsAdminApi } from "./stations-admin-api";

interface BackendEnvelope {
  status: boolean;
  message: string;
}

/** Manajemen Stasiun SENGAJA hit `GET /devices` (punya `elevation`), bukan
 *  `/devices/status` yang dipakai `stationApi` untuk halaman lain. Company
 *  scoping tetap dari `resolveCompanyId()` di Route Handler pemanggil
 *  (`createApiClient(companyCode)` meng-inject `company_code`). */
async function fetchRealStations(): Promise<Station[]> {
  try {
    const res = await createApiClient().get<
      BackendEnvelope & { data: RawAdminDevice[] }
    >("/devices");
    if (!res.data.status) {
      throw new ApiError(
        "STATION_FETCH_FAILED",
        res.data.message || "Gagal mengambil data stasiun dari server.",
      );
    }
    return res.data.data.map(mapAdminDeviceToStation);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      "STATION_FETCH_FAILED",
      extractBackendErrorMessage(err) ??
        "Gagal terhubung ke server. Periksa koneksi internet.",
    );
  }
}

/** Body `POST`/`PUT /devices` — `application/x-www-form-urlencoded`. */
function toFormBody(input: CreateStationInput): URLSearchParams {
  const body = new URLSearchParams();
  body.set("id", input.id);
  body.set("name", input.name);
  body.set("brand", input.brand);
  body.set("latitude", String(input.latitude));
  body.set("longitude", String(input.longitude));
  body.set("company_code", input.companyCode);
  body.set("elevation", input.elevation == null ? "" : String(input.elevation));
  return body;
}

async function mutateStation(
  method: "post" | "put",
  input: CreateStationInput,
  failCode: string,
  failMessage: string,
): Promise<ApiItemResponse<Station>> {
  try {
    const res = await createApiClient().request<BackendEnvelope>({
      method,
      url: "/devices",
      data: toFormBody(input),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    if (!res.data.status) {
      throw new ApiError(failCode, res.data.message || failMessage);
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      failCode,
      extractBackendErrorMessage(err) ??
        "Gagal terhubung ke server. Periksa koneksi internet.",
    );
  }

  // Respons mutasi BE tidak diandalkan bentuknya — ambil ulang dari GET.
  const saved = (await fetchRealStations()).find((s) => s.id === input.id);
  if (!saved) throw new ApiError(failCode, failMessage);
  return { data: saved };
}

export const stationsAdminClient: StationsAdminApi = {
  async getStations(): Promise<ApiListResponse<Station>> {
    const stations = await fetchRealStations();
    return {
      data: stations,
      meta: { page: 1, pageSize: stations.length, total: stations.length },
    };
  },

  createStation(input: CreateStationInput): Promise<ApiItemResponse<Station>> {
    return mutateStation(
      "post",
      input,
      "STATION_CREATE_FAILED",
      "Gagal menambah stasiun.",
    );
  },

  updateStation(input: UpdateStationInput): Promise<ApiItemResponse<Station>> {
    return mutateStation(
      "put",
      input,
      "STATION_UPDATE_FAILED",
      "Gagal mengubah stasiun.",
    );
  },

  async deleteStation(id: string): Promise<void> {
    try {
      const res = await createApiClient().delete<BackendEnvelope>("/devices", {
        data: { id },
      });
      if (!res.data.status) {
        throw new ApiError(
          "STATION_DELETE_FAILED",
          res.data.message || "Gagal menghapus stasiun.",
        );
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "STATION_DELETE_FAILED",
        extractBackendErrorMessage(err) ??
          "Gagal terhubung ke server. Periksa koneksi internet.",
      );
    }
  },
};
