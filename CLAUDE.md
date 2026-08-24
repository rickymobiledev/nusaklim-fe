# PPN Weather Dashboard — Instruksi untuk Claude Code

Baca ini dulu sebelum mengerjakan apapun di project ini. Untuk konteks
arsitektur lengkap (kenapa stack ini dipilih, alur auth, dsb), lihat
`README.md` — jangan jelaskan ulang isinya, cukup rujuk bagiannya.

## Stack (jangan diganti tanpa didiskusikan)

Next.js 16 App Router + TypeScript + Tailwind v4, TanStack Query, TanStack
Table **v8** (bukan v9 — sengaja di-pin), React Hook Form + Zod, Auth.js
(NextAuth v5), React-Leaflet, Recharts, pnpm sebagai package manager.

## Perintah yang valid

- Install: `pnpm install`
- Dev server: `pnpm dev`
- Build (WAJIB dijalankan sebelum bilang selesai): `pnpm run build`
- Lint (WAJIB dijalankan sebelum bilang selesai): `pnpm exec eslint .`
- Format check (WAJIB dijalankan sebelum bilang selesai): `pnpm exec prettier --check .`
  (kalau gagal, jalankan `pnpm run format` lalu review diffnya)
- JANGAN pernah pakai `npm` atau `yarn` di project ini.

## Aturan wajib sebelum menganggap task selesai

1. Jalankan `pnpm run build` — harus sukses tanpa error (warning font
   Google boleh diabaikan kalau memang tidak ada koneksi internet).
2. Jalankan `pnpm exec eslint .` — 0 error (warning boleh, tapi jelaskan
   kenapa kalau ada warning baru).
3. Jalankan `pnpm exec prettier --check .` — 0 diff.
4. JANGAN ubah `src/proxy.ts` kecuali diminta eksplisit — file ini pakai
   konvensi Next.js 16 (`export function proxy`, bukan `middleware`), dan
   harus tetap literal function declaration (bukan re-export hasil
   destructuring) atau Next.js akan diam-diam tidak menganggapnya valid.
   Matcher-nya exclude `images/`+`brand/` (isi `public/`) selain
   `_next/static`+`_next/image`+`favicon.ico` — asset baru di `public/`
   yang dipakai halaman TANPA sesi (mis. `/login`) WAJIB ditambah ke
   exclude list itu juga, kalau tidak `next/image` gagal fetch ("received
   null") karena keburu di-redirect ke `/login` oleh middleware ini.

## Pola yang harus diikuti

- Data fetching SELALU lewat hook di `src/hooks/`, jangan fetch langsung
  di komponen halaman.
- Hooks `"use client"` HANYA boleh `fetch("/api/...")` ke Route Handler
  internal di `app/api/**` — JANGAN PERNAH import `lib/api/*` (interface,
  mock, atau `lib/api/index.ts`) langsung dari file `"use client"`.
  `lib/api/*` server-only, diimpor HANYA oleh Route Handler (lihat "Batas
  arsitektur data" di bawah). Menambah domain baru = tambah Route Handler
  DULU (`app/api/**/route.ts`, cek sesi via `requireUser()` dari
  `lib/api/route-guard.ts`), baru hook yang fetch ke situ pakai
  `fetchJson()` dari `lib/api/client-fetch.ts` — contoh utuh:
  `app/api/forecast/route.ts` + `hooks/use-forecast.ts`.
- Toggle mock vs API asli (`USE_MOCK ? mockX : realX`) ada di
  `lib/api/index.ts`, dipakai Route Handler — BUKAN di hooks/client.
- Tipe data taruh di `src/types/domain.ts`, jangan bikin tipe ad-hoc di
  file komponen.
- Komponen UI dasar (Button, Card, dst) di `src/components/ui/` ditulis
  manual ala shadcn (bukan hasil CLI, karena `ui.shadcn.com` kadang tidak
  bisa diakses dari sini) — ikuti pola yang sudah ada kalau menambah
  komponen baru, jangan install `shadcn` CLI kecuali diminta.
- Semua teks UI dalam Bahasa Indonesia, konsisten dengan yang sudah ada.

## Batas styling (WAJIB, ditegakkan lint — bukan cuma konvensi)

- `src/components/ui/**` HANYA primitif Tailwind/shadcn manual. Dilarang
  import `styled-components` di sini.
- `src/components/{shared,layout,domain}/**` pakai `styled-components` +
  token dari `src/lib/design-tokens.ts` (via `src/lib/theme.ts`
  `ThemeProvider`) untuk styling dinamis/bertema. Dilarang import
  `@/lib/utils` (helper `cn`), `tailwind-merge`, atau
  `class-variance-authority` di sini — kalau perlu compose primitif
  `ui/**`, wrap dengan `styled(ComponenUi)` (contoh:
  `components/shared/StatusBadge.tsx`, `components/layout/SidebarItem.tsx`).
  className Tailwind **statis** (tanpa logic kondisional) masih boleh
  untuk markup layout sederhana (`Topbar.tsx`), tapi begitu perlu
  kondisional berdasarkan props/state, itu harus styled-components,
  bukan `cn()`.
- Dalam satu file styled-components: fungsi komponen (yang di-render/
  di-export) DULU di atas, definisi `const X = styled...` di BAWAHnya —
  supaya yang dicari pertama kali (komponennya) langsung kelihatan.
  Contoh: `components/domain/auth/*.tsx`, `components/shared/Logo.tsx`.
- Kedua rule di atas ditegakkan lewat `no-restricted-imports` di
  `eslint.config.mjs` — pelanggaran = `pnpm exec eslint .` gagal. Kalau
  ketemu error ini, **perbaiki komponennya** (pindah ke styling yang
  benar), JANGAN menghapus/melonggarkan rule-nya untuk "menyelesaikan"
  error. Detail & rasional lengkap: `README.md` bagian 3.

## Kontrak response API

Satu bentuk untuk semua endpoint, didefinisikan di `src/types/api.ts` —
jangan bikin bentuk response baru per endpoint:

- List: `ApiListResponse<T> = { data: T[]; meta: { page, pageSize, total } }`
- Single item: `ApiItemResponse<T> = { data: T }`
- Error: `throw` instance `ApiError` (bukan return body `{ error }`), UI
  panggil `getErrorMessage(error)` dari `lib/api/error-messages.ts`.
  Detail & contoh: `README.md` bagian 4.

## Struktur folder & status tiap domain

Tree lengkap ada di `README.md` bagian 5 (jangan duplikasi di sini, cukup
status ringkas). Yang sudah punya data layer lengkap (Route Handler, hook,
mock, dan page, field diselaraskan API asli Nusaklim): Beranda, Peta,
Monitoring (4 sub-halaman), Ramalan Cuaca — jadikan
`app/api/forecast/route.ts` + `hooks/use-forecast.ts` +
`app/(dashboard)/ramalan-cuaca/page.tsx` sebagai contoh pola paling
lengkap kalau menambah domain baru. Unduh Data: data loading jalan tapi
field `DownloadDataRow` **belum** diselaraskan ke endpoint asli (endpoint
persisnya belum dikonfirmasi BE), tombol download masih placeholder.
**Early Warning, Data Hilang, Import data manual, Companies, User Roles,
Peta multi-metrik overlay belum ada sama sekali** (page/hook/route/type) —
lihat tabel endpoint di `README.md` bagian 2 sebelum mulai bikin salah
satu dari ini. `components/domain/{monitoring,stasiun,ramalan-cuaca}/`
dan `lib/api/endpoints/` kosong dengan sengaja (scaffold, bukan rusak).

**Login** (`app/(auth)/login/`, `app/(auth)/layout.tsx`) SUDAH
di-redesign sesuai Figma baru (split-screen + styled-components) —
jadikan `components/domain/auth/AuthFormField.tsx`,
`components/domain/auth/AuthCopy.tsx`, `components/layout/AuthHeroPanel.tsx`,
dan `components/shared/Logo.tsx` contoh pola kalau redesign halaman lain.
Font Figma (Manrope/Plus Jakarta Sans/Nunito Sans) sudah di-setup di
`app/layout.tsx` sbg CSS var `--font-heading`/`--font-body`/
`--font-caption` — pakai itu (bukan `--font-geist-*`) kalau nge-match
desain baru.

## companyId (multi-tenant)

SATU-SATUNYA tempat yang boleh menentukan `companyId` final:
`resolveCompanyId()` di `lib/api/route-guard.ts`, dipanggil tiap Route
Handler. JANGAN PERNAH pakai `searchParams.get("companyId")` mentah —
itu IDOR (client bisa minta data company lain lewat query string). Hooks
di client TIDAK mengirim `companyId` sama sekali (dihapus dari
`use-stations.ts` dkk) — Route Handler yang menentukan dari sesi
server-side.

Aturan per role: `VIEWER_ANPER`/`VIEWER_HOLDING` SELALU dipaksa ke
`user.companyCode` sendiri, `requestedCompanyId` dari client diabaikan.
`ADMINISTRATOR`/`RESEARCHER` **sementara** boleh lintas company
(`requestedCompanyId` dipakai kalau ada, `undefined` = tanpa filter/semua
company) — **ini BELUM keputusan final dari PM**, cek lagi ke tim produk
sebelum menganggap ini perilaku permanen atau membangun fitur lanjutan
(mis. company-picker UI) di atasnya.

Implementasi mock: `mockStationApi.getStations`/`getStationDetail` sudah
filter/guard companyId (404-style kalau beda company, bukan bocorkan
"ada tapi bukan company kamu"). `mockWeatherApi`/`mockRamalanCuacaApi`
reuse guard itu lewat `getStationDetail`. Mock monitoring
(`getWaterBalance` dkk) & `download-data` **belum** validasi companyId
vs stasiun (ditandai TODO di file mock-nya masing-masing). Sisi real:
`lib/api/fetcher.ts` sudah inject `company_code` sebagai query param
otomatis — begitu endpoint real diisi, filtering per-company jalan tanpa
ubah hooks/Route Handler.

## Batas arsitektur data (BFF) & env var

**Sudah diimplementasi**, bukan lagi rencana: `lib/api/*` (interface,
mock, `index.ts` wiring) server-only, diimpor HANYA oleh Route Handler di
`app/api/**`. Hooks `"use client"` HANYA `fetch("/api/...")` — lihat rule
lengkap di "Pola yang harus diikuti" di atas. `API_BASE_URL`, `API_KEY`,
`AUTH_SECRET` = server-only, JANGAN PERNAH ditambah prefix
`NEXT_PUBLIC_` (akan ke-bundle ke browser dan bocor). Satu-satunya var
publik: `NEXT_PUBLIC_USE_MOCK_API`.

`API_BASE_URL` = origin polos TANPA `/api` (sama seperti `{{BASE_URL}}`
di Postman collection tim BE). Prefix `/api/v2` (dipakai SEMUA endpoint
Nusaklim, termasuk login) SATU-SATUNYA sumbernya `API_V2_URL` di
`constants/index.ts` — jangan concat `"/api/v2"` manual di tempat lain.
Semua endpoint WAJIB header `api-key` (auth level collection di Postman,
bukan opsional per-endpoint) — sudah di `lib/api/fetcher.ts` &
`src/auth.ts`.

`real/*` implementation untuk domain DATA (stations/weather/monitoring/
dst) **belum dibuat** — `lib/api/index.ts` masih hardcode ke mock. Login
**sudah beda**: `src/auth.ts` sudah panggil backend asli begitu
`NEXT_PUBLIC_USE_MOCK_API=false`. `real/*` (belum dibuat) akan pakai
`lib/api/fetcher.ts` dari DALAM Route Handler — jangan panggil dari
client sebagai jalan pintas. Detail: `README.md` bagian 2, komentar di
`lib/api/fetcher.ts` & `lib/api/route-guard.ts`.

## Yang belum final (lihat README.md bagian 7 untuk detail)

Token warna/tipografi dashboard (non-login) masih placeholder; status
mock vs real API lihat "Batas arsitektur data" di atas; field Unduh Data
belum diselaraskan endpoint asli; `VPDReport.kategori` derived dari
threshold sementara (butuh konfirmasi Data Analyst/BE); fitur Early
Warning/Data Hilang/Import/Companies/User Roles belum ada halamannya;
export data di halaman Unduh Data masih placeholder tombol saja.

## Kalau ragu

Tanya dulu sebelum mengubah `src/auth.ts`, `src/auth.config.ts`, atau
`src/proxy.ts` secara struktural — ini bagian paling sensitif (auth &
proteksi route). Perubahan kecil (misal ganti nama field) boleh langsung,
tapi perubahan pola (misal ganti strategi session) sebaiknya dikonfirmasi.

## Update file ini

Setiap ada keputusan arsitektur baru (bukan detail implementasi kecil),
perbarui `CLAUDE.md` ini di commit yang sama — file ini yang dibaca
otomatis di awal SETIAP sesi Claude Code baru (beda dari `README.md` yang
cuma dibaca manusia), supaya sesi berikutnya (walau dibuka dari chat yang
beda) tetap konsisten tanpa perlu dijelaskan ulang dari nol.
