import type { ApiItemResponse, ApiListResponse } from "@/types/api";
import type { NewsDetail, NewsItem } from "@/types/domain";
import type { CreateNewsInput, UpdateNewsInput } from "@/types/user-management";

/** BEDA dari kebanyakan domain real lain (`RainfallTodayParams` dkk) —
 *  `GET /news` TIDAK menerima `company_code` sama sekali (sample response
 *  tidak punya field company/device apa pun, konten berita bersifat
 *  global, bukan per-perusahaan). Jadi TIDAK ada params company di sini,
 *  dan `news-client.ts` panggil `createApiClient()` TANPA companyCode. Ini
 *  ASUMSI dari bentuk response yang dikonfirmasi user — revisit kalau
 *  ternyata backend butuh `company_code` juga.
 *
 *  Kontrak Manajemen Berita (dari user): `GET /news?id=`, `POST /news`
 *  (tambah: multipart title/content/cover_image/is_featured; ubah: sama +
 *  `id`), `DELETE /news` (`id` urlencoded), `POST /news/upload_adapter`
 *  (multipart `upload`, gambar di dalam isi). `update_featured`/
 *  `update_status` belum dipakai. */
export interface NewsApi {
  getNews(): Promise<ApiListResponse<NewsItem>>;
  getNewsById(id: string): Promise<ApiItemResponse<NewsDetail>>;
  createNews(input: CreateNewsInput): Promise<ApiItemResponse<NewsItem>>;
  updateNews(input: UpdateNewsInput): Promise<ApiItemResponse<NewsItem>>;
  deleteNews(id: string): Promise<void>;
  /** Upload gambar untuk isi berita, balikin URL publiknya. */
  uploadNewsImage(file: File): Promise<string>;
}
