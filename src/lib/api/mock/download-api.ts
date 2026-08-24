import type { ApiListResponse } from "@/types/api";
import type { DownloadDataRow } from "@/types/domain";
import type { DownloadApi, GetDownloadDataParams } from "../download-api";
import { delay } from "./delay";

const ROWS: DownloadDataRow[] = [
  {
    tanggal: "2026-08-19",
    rerataTemperatur: 26.8,
    totalCurahHujan: 1.9,
    totalRadiasi: 22.74,
    rerataTekananUdara: 1010,
    rerataKecepatanAngin: 0.87,
    arahMataAngin: "Barat Daya",
  },
  {
    tanggal: "2026-08-20",
    rerataTemperatur: 27.3,
    totalCurahHujan: 0.1,
    totalRadiasi: 20.11,
    rerataTekananUdara: 1009.9,
    rerataKecepatanAngin: 1.1,
    arahMataAngin: "Selatan",
  },
  {
    tanggal: "2026-08-21",
    rerataTemperatur: 27.7,
    totalCurahHujan: 0,
    totalRadiasi: 21.43,
    rerataTekananUdara: 1009.1,
    rerataKecepatanAngin: 1.23,
    arahMataAngin: "Selatan",
  },
  {
    tanggal: "2026-08-22",
    rerataTemperatur: 27.7,
    totalCurahHujan: 2.5,
    totalRadiasi: 22.9,
    rerataTekananUdara: 1009.2,
    rerataKecepatanAngin: 1.33,
    arahMataAngin: "Barat",
  },
  {
    tanggal: "2026-08-23",
    rerataTemperatur: 26.7,
    totalCurahHujan: 3.2,
    totalRadiasi: 22.78,
    rerataTekananUdara: 1009.8,
    rerataKecepatanAngin: 1.24,
    arahMataAngin: "Selatan",
  },
  {
    tanggal: "2026-08-24",
    rerataTemperatur: 25.7,
    totalCurahHujan: 4.7,
    totalRadiasi: 19.68,
    rerataTekananUdara: 1010,
    rerataKecepatanAngin: 1.18,
    arahMataAngin: "Barat Daya",
  },
  {
    tanggal: "2026-08-25",
    rerataTemperatur: 25.9,
    totalCurahHujan: 3,
    totalRadiasi: 20.77,
    rerataTekananUdara: 1009.7,
    rerataKecepatanAngin: 1.08,
    arahMataAngin: "Barat Daya",
  },
];

export const mockDownloadApi: DownloadApi = {
  async getDownloadData(
    params: GetDownloadDataParams,
  ): Promise<ApiListResponse<DownloadDataRow>> {
    await delay();

    // Mock belum benar-benar filter by stationId/dateRange/granularity/
    // companyId — kontrak & signature-nya sudah siap (termasuk companyId
    // dari resolveCompanyId di Route Handler), tinggal diisi begitu ada
    // sumber data historis sungguhan per stasiun.
    const filtered = params.stationId && params.dateFrom && params.dateTo ? ROWS : [];

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return { data, meta: { page, pageSize, total: filtered.length } };
  },
};
