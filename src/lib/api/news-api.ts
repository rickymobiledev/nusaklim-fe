import type { ApiListResponse } from "@/types/api";
import type { NewsItem } from "@/types/domain";

/** BEDA dari kebanyakan domain real lain (`RainfallTodayParams` dkk) —
 *  `GET /news` TIDAK menerima `company_code` sama sekali (sample response
 *  tidak punya field company/device apa pun, konten berita bersifat
 *  global, bukan per-perusahaan). Jadi TIDAK ada params sama sekali di
 *  sini, dan `news-client.ts` panggil `createApiClient()` TANPA
 *  companyCode. Ini ASUMSI dari bentuk response yang dikonfirmasi user —
 *  revisit kalau ternyata backend butuh `company_code` juga. */
export interface NewsApi {
  getNews(): Promise<ApiListResponse<NewsItem>>;
}
