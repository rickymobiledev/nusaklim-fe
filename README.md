# PPN Weather Dashboard — Frontend Boilerplate

Boilerplate Next.js untuk redesign aplikasi monitoring cuaca perkebunan
(existing app: Beranda, Peta, Monitoring, Unduh Data + menu baru Ramalan
Cuaca hasil model DL). Dibuat berdasarkan screenshot app existing + rencana
proyek (Gantt chart) yang melibatkan tim UI/UX, Frontend, Backend, dan Data
Analyst.

> Untuk audit struktur folder lengkap (per-folder), tabel status tiap domain,
> dan ADR (Architecture Decision Record) ringkas, lihat
> [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). README ini fokus ke
> narasi/alasan; `docs/ARCHITECTURE.md` fokus ke referensi cepat berbentuk
> tabel.

## 1. Stack & alasan pemilihan

| Kebutuhan                  | Pilihan                                                                                  | Kenapa                                                                                                                                                                                                                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework                  | Next.js 16 (App Router) + TypeScript                                                     | Sudah jadi keputusan tim. App Router dipakai karena mendukung Server Components (auth check di server), layout bersarang (cocok untuk sidebar/navbar persisten), dan `proxy.ts` untuk proteksi route.                                                                          |
| Styling                    | Tailwind CSS v4 (primitif `components/ui/`) + styled-components (komponen di luar `ui/`) | Lihat detail pembagiannya di bagian 3 di bawah — dua sistem yang sengaja dipisah per lapisan, bukan campur aduk bebas.                                                                                                                                                         |
| Auth                       | Auth.js / NextAuth v5 (Credentials provider)                                             | Backend kalian terpisah (bukan Next.js API sebagai BE utama), jadi Next.js berperan sebagai _klien_ yang login ke API backend. Token disimpan di JWT session NextAuth (httpOnly cookie, dienkripsi) — **bukan** di `localStorage`, supaya tidak gampang dicuri lewat XSS.      |
| Data fetching & cache      | TanStack Query                                                                           | Auto-caching, refetch interval (dipakai untuk status sinkronisasi stasiun IoT), retry, loading/error state siap pakai — jauh lebih sedikit boilerplate dibanding `useEffect` + `fetch` manual.                                                                                 |
| Tabel data                 | TanStack Table v8                                                                        | Dipakai di halaman Unduh Data & Ramalan Cuaca. _(Sengaja di-pin ke v8, bukan v9 yang baru rilis dengan API berbeda jauh, supaya lebih stabil & terdokumentasi.)_                                                                                                               |
| Form & validasi            | React Hook Form + Zod                                                                    | Dipakai di form login; pola yang sama bisa dipakai untuk form filter tanggal, form Early Warning, dsb.                                                                                                                                                                         |
| State ringan (client-only) | Zustand                                                                                  | Dipakai untuk state UI yang tidak berasal dari server, contoh: `use-sidebar-store.ts` (collapsed/expanded).                                                                                                                                                                    |
| Chart                      | Recharts                                                                                 | Wrapper generic ada di `components/shared/TrendChart.tsx` untuk tren cuaca (temperatur, curah hujan, dst) — belum dipasang di halaman manapun, tinggal diisi data begitu endpoint historis siap.                                                                               |
| Peta                       | React-Leaflet + OpenStreetMap                                                            | App existing pakai Highcharts Maps (butuh lisensi komersial). React-Leaflet gratis & open-source. Kalau tim tetap mau tampilan choropleth per-provinsi seperti existing, ganti `components/domain/peta/station-map.tsx` dengan `highcharts-react-official` + GeoJSON provinsi. |
| Notifikasi                 | Sonner (toast)                                                                           | Sudah dipasang di `Providers`, tinggal panggil `toast.success(...)` / `toast.error(...)` di mana saja.                                                                                                                                                                         |
| Formatter/linter           | Prettier + ESLint 9 (flat config)                                                        | `pnpm exec prettier --check .` dan `pnpm exec eslint .` — keduanya wajib lulus sebelum PR. `eslint-config-prettier` mematikan rule ESLint yang konflik dengan Prettier.                                                                                                        |

## 2. Arsitektur & alur autentikasi

```
Browser (Next.js Client Components)
   |  useSession() -> data sesi dari session NextAuth (httpOnly cookie)
   |  fetch("/api/stations"), fetch("/api/weather"), dst — SELALU ke origin sendiri
   v
Next.js Server (App Router)
   |- proxy.ts                 -> cek sesi untuk semua route KECUALI app/api/**
   |- (dashboard)/layout       -> cek sesi lagi di Server Component (defense in depth)
   |- app/api/auth/[...nextauth]  -> handler NextAuth (login, session, signout)
   `- app/api/{stations,weather,monitoring/*,download-data,forecast}/route.ts
          |  BFF: cek sesi sendiri (requireUser(), lib/api/route-guard.ts),
          |  balikin JSON 401 kalau gagal (bukan redirect — beda dari proxy.ts)
          v
      lib/api/index.ts (stationApi, weatherApi, dst — masih 100% mock)
          |
          |  (belum ada — menunggu API_KEY produksi & akses BE)
          v
   Backend API Nusaklim (tim BE, terpisah - REST, auth pakai header `api-key` statis)
          |
          |- /v2/authentications           -> profil user (bukan token)
          |- /v2/devices, /weathers/latest  -> data stasiun, snapshot cuaca (beda per brand device)
          `- /v2/forecast (POST)            -> hasil model Data Analyst
```

**Kenapa token disimpan di session NextAuth, bukan Bearer token biasa di
`localStorage`?** Supaya token tidak bisa dibaca langsung lewat
`document.cookie` (httpOnly) atau lewat script pihak ketiga yang ke-inject
(XSS).

**BFF (Backend for Frontend) — sudah diimplementasi**, bukan lagi rencana:
`lib/api/*` (interface + mock, nanti + `real/*`) adalah **server-only**,
diimpor HANYA oleh Route Handler di `app/api/**`. Hooks `"use client"`
(`use-stations.ts`, dst) **HANYA** boleh `fetch("/api/...")` ke origin
sendiri — TIDAK PERNAH mengimpor `lib/api/*` langsung atau memanggil
`API_BASE_URL` Nusaklim dari browser. Ini yang membuat `API_KEY`/`API_BASE_URL`
(server-only, lihat bagian 6) aman — Route Handler yang jadi satu-satunya
tempat nilai itu dibaca, dan begitu ada `real/*`, `lib/api/index.ts` yang
jadi titik toggle `USE_MOCK ? mock... : real...` — hooks & Route Handler
tidak perlu berubah. Detail implementasi: `src/lib/api/route-guard.ts`
(helper cek sesi + convert `ApiError` + `resolveCompanyId()` — satu-satunya
tempat yang boleh menentukan `companyId` final per role, supaya client
tidak bisa spoof company lain lewat query string), `src/lib/api/fetcher.ts`
(klien axios yang akan dipakai `real/*` nanti, sudah siap header `api-key`).

**Asumsi yang sudah dikonfirmasi dari Postman collection tim BE**
(`Nusaklim.postman_collection.json` — dipegang manual oleh yang integrasi
backend, tidak disimpan di repo ini), lihat `src/auth.ts` &
`src/lib/api/fetcher.ts`:

- `API_BASE_URL` = origin polos (mis. `https://api.nusaklim.co.id`, TANPA
  `/api`) — prefix `/api/v2` (dipakai SEMUA endpoint, termasuk login)
  disatukan lewat `API_V2_URL` di `src/constants/index.ts`.
- **Semua** endpoint (termasuk login) WAJIB header `api-key` statis —
  ini di-set sebagai auth level **collection** di Postman (bukan
  opsional per-endpoint), jangan asumsikan endpoint tertentu bebas tanpa
  header ini.
- Endpoint login: `POST {API_V2_URL}/authentications`,
  **x-www-form-urlencoded** (bukan JSON), body `{ nik_sap | email | username, password }`,
  membalas `BackendUserProfile` (`nik_sap`, `name`, `image_url`,
  `user_role_code`, `user_role_name`, `company_code`, `company_name`).
- Backend tidak mengeluarkan token/JWT sendiri saat login — sesi yang
  dipakai app ini adalah JWT yang di-generate Auth.js sendiri.
- Endpoint data lain (belum diimplementasi `real/*`-nya) difilter
  per-tenant lewat query param `company_code` (lihat `lib/api/fetcher.ts`),
  diambil dari `session.user.companyCode`.

**Peta endpoint asli per domain** (dikonfirmasi Postman, dipakai sebagai
acuan field mock — lihat bagian 5 untuk field lengkap per domain):

| Domain kita                 | Endpoint asli                                                                                                             | Status                                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Stasiun                     | `GET /devices`, `/devices/status` (`?company_code=`)                                                                      | Mock sudah diselaraskan                                                                                                           |
| Cuaca terkini (Beranda)     | `GET /weathers/latest?device_id=`                                                                                         | Mock sudah diselaraskan + brand adapter (lihat bagian 5)                                                                          |
| Keseimbangan Air            | `GET /water_deficit?device_id=&year=`                                                                                     | Mock sudah diselaraskan (di-pivot ke bentuk per-bulan)                                                                            |
| Deret Hari Tidak Hujan      | `GET /dry_spell?device_id=&start_date=&end_date=`                                                                         | Mock sudah diselaraskan (list per periode)                                                                                        |
| VPD                         | `GET /vpd?device_id=&start_date=&end_date=`                                                                               | Mock sudah diselaraskan (list per hari, `kategori` derived)                                                                       |
| Lama Penyinaran             | `GET /solar_sunshine?device_id=&start_date=&end_date=`                                                                    | Mock sudah diselaraskan (list per hari)                                                                                           |
| Ramalan Cuaca               | `POST /forecast` (body `station_id`)                                                                                      | Sudah cocok, `units` di response asli kadang tidak ada                                                                            |
| Unduh Data                  | `GET /weathers/filter`, `/daily`, `/morning`, `/afternoon`, `/evening`                                                    | **Belum diselaraskan** — endpoint persisnya belum dikonfirmasi ke BE, field tetap seperti sebelumnya                              |
| Data Hilang                 | `GET /weathers/missing` (pagination Laravel asli: `page`/`per_page`)                                                      | **Belum ada halaman/hook/mock sama sekali** — belum dikerjakan                                                                    |
| Import data manual          | `POST /import/aws` (formdata Excel, max 5MB)                                                                              | **Belum ada halaman/hook/mock sama sekali** — kemungkinan besar ini yang dimaksud "input manual" di timeline, konfirmasi ke PM/BE |
| Perusahaan (filter/tenant)  | `GET /companies`                                                                                                          | **Belum ada halaman/hook/mock sama sekali**                                                                                       |
| Role                        | `GET /user_roles` (4 role: ADMINISTRATOR, RESEARCHER, VIEWER_ANPER, VIEWER_HOLDING)                                       | **Belum ada halaman/hook/mock sama sekali**                                                                                       |
| Peta (overlay multi-metrik) | `GET /devices/status`, `/devices/water_deficit`, `/devices/dry_spell`, `/devices/rainfall_today` (semua `?company_code=`) | Peta saat ini cuma pakai `/devices/status` (via domain Stasiun) — 3 endpoint metrik lain belum dipakai                            |

## 3. Batas styling: Tailwind vs styled-components

Ada dua sistem styling yang sengaja dipisah per folder, **ditegakkan
otomatis lewat ESLint** (`no-restricted-imports` di `eslint.config.mjs`,
bukan cuma konvensi tak tertulis):

- **`components/ui/`** — primitif ala shadcn (Button, Card, Badge, dst),
  Tailwind murni + `cn()`/`class-variance-authority`. Dilarang import
  `styled-components`.
- **`components/{shared,layout,domain}/`** — komponen komposisi/domain,
  wajib `styled-components` untuk styling dinamis/bertema (warna per
  status, spacing terhitung, dst), menggunakan `ThemeProvider` dari
  `src/lib/registry.tsx` dan token dari `src/lib/design-tokens.ts`
  (sumber tunggal yang dipakai bareng oleh `tailwind.config.mts` DAN
  `lib/theme.ts`, supaya keduanya tidak pernah beda nilai). Dilarang
  import `@/lib/utils` (helper `cn`), `tailwind-merge`, atau
  `class-variance-authority` — kalau butuh compose primitif `ui/`, wrap
  dengan `styled(ComponenUi)` (lihat contoh `StatusBadge.tsx` yang
  wrap `Badge`, atau `SidebarItem.tsx`).
  - Pengecualian yang tetap boleh: className Tailwind **statis** (tanpa
    logic kondisional) untuk markup layout sederhana — lihat
    `Topbar.tsx`/`Breadcrumb.tsx`. Begitu classname perlu berubah
    berdasarkan props/state, pindah ke styled-components (lihat
    `SidebarItem.tsx`/`Sidebar.tsx`), jangan pakai `cn()`.
  - Wrapper library pihak ketiga yang styling-nya lewat props (bukan
    className), seperti `components/domain/peta/station-map.tsx`
    (react-leaflet `pathOptions`) dan `components/shared/TrendChart.tsx`
    (recharts `stroke`/CSS var), tetap Tailwind className untuk
    layout-nya sendiri — bukan pengecualian dari rule di atas karena
    memang tidak import `cn`/`tailwind-merge`/`cva`.

## 4. Kontrak response API

Satu bentuk response untuk SEMUA endpoint (mock maupun asli), didefinisikan
di `src/types/api.ts` — jangan biarkan satu endpoint punya bentuk beda
sendiri:

- List: `ApiListResponse<T> = { data: T[]; meta: { page, pageSize, total } }`
- Single item: `ApiItemResponse<T> = { data: T }`
- Error: **bukan** body `{ error }` yang dikembalikan — implementasi
  (mock/asli) `throw` instance `ApiError` (`code`, `message`), lalu UI
  panggil `getErrorMessage(error)` (`lib/api/error-messages.ts`) untuk
  dapat pesan Bahasa Indonesia yang konsisten. Tambah entry baru di
  `ERROR_MESSAGES` di file itu untuk kode error baru dari BE.

`companyId`/`company_code` (multi-tenant): sudah di-wire di semua hook
data (`companyId ?? session.user.companyCode`) dan semua interface
`*Params`, tapi implementasi **mock** belum benar-benar filter
berdasarkan itu (cuma `getStations` yang filter `status`). Di sisi
real, `lib/api/fetcher.ts` sudah inject `company_code` sebagai query
param otomatis lewat axios interceptor — begitu endpoint asli diisi
(bagian 6, langkah 4), filtering per-company otomatis jalan tanpa
perubahan di hooks.

## 5. Struktur folder

```
src/
|- proxy.ts                 # (dulu "middleware.ts" -- Next.js 16 rename) proteksi route
|- auth.ts / auth.config.ts # setup NextAuth
|- app/
|  |- (auth)/login/         # halaman login (layout tanpa sidebar)
|  |- (dashboard)/          # semua halaman utama
|  |  |- layout.tsx         #   cek sesi + render Sidebar/Topbar/Breadcrumb
|  |  |- page.tsx           #   Beranda
|  |  |- peta/
|  |  |- monitoring/        #   index + 4 sub-halaman (keseimbangan-air, dry-spell,
|  |  |                     #   lama-penyinaran, vpd)
|  |  |- unduh-data/
|  |  `- ramalan-cuaca/
|  `- api/          # Route Handler internal (BFF) — lihat bagian 2
|     |- auth/[...nextauth]/route.ts
|     |- stations/route.ts, stations/[id]/route.ts, stations/summary/route.ts
|     |- weather/route.ts
|     |- monitoring/{water-balance,dry-spell,sunshine-duration,vpd}/route.ts
|     |- download-data/route.ts
|     `- forecast/route.ts        #   POST, bukan GET
|- components/
|  |- ui/          # primitif ala shadcn — Tailwind murni (lihat bagian 3)
|  |- shared/      # StatusBadge, StatCard, MetricCard, DataTable, TrendChart, dst — styled-components
|  |- layout/      # Sidebar, SidebarItem, Topbar, Breadcrumb — styled-components
|  |- domain/      # komponen spesifik satu domain, per-subfolder (peta/, monitoring/, dst)
|  `- providers/   # QueryClientProvider (query-provider.tsx), styled-components registry, dst
|- hooks/          # semua React Query hooks (use-stations, use-forecast, dst) — semua kebab-case use-*.ts, HANYA fetch("/api/...")
|- lib/
|  |- api/
|  |  |- *-api.ts          # interface/kontrak per domain
|  |  |- index.ts          # satu titik wiring mock/real, diimpor HANYA oleh Route Handler
|  |  |- mock/             # implementasi mock, field diselaraskan API asli (lihat bagian 2)
|  |  |- adapters/         # weather-brand-adapter.ts — normalisasi cuaca per brand device
|  |  |- fetcher.ts        # axios client, server-only, dipakai `real/*` (belum dibuat) dari Route Handler
|  |  |- client-fetch.ts   # fetchJson() — dipakai hooks di browser buat fetch("/api/...")
|  |  |- route-guard.ts    # requireUser()/apiErrorResponse()/resolveCompanyId() — dipakai tiap Route Handler
|  |  `- endpoints/        # real/* implementation, belum diisi
|  |- auth/        # detect-login-method.ts, current-user.ts
|  |- design-tokens.ts / theme.ts / theme-utils.ts / registry.tsx  # sumber token + wiring styled-components
|  `- utils/       # cn() (HANYA boleh diimport dari components/ui/**) + util lain (degreesToCompass, dst) — bebas dipakai di mana saja
`- types/          # domain.ts (kontrak data), api.ts (envelope response), ramalan-cuaca.ts, auth.ts, next-auth.d.ts, styled.d.ts
```

**Folder kosong yang disengaja** (scaffold, bukan sisa rusak):
`components/domain/{monitoring,stasiun,ramalan-cuaca}/` dan
`lib/api/endpoints/` — signature/interface-nya sudah siap di
`lib/api/*.ts`, tinggal diisi begitu ada kebutuhan/kontrak BE-nya.

**Konvensi penamaan file komponen** (apa adanya, bukan aturan yang
dipaksakan seragam): `ui/` dan `domain/` kebab-case
(`station-map.tsx`), `layout/` PascalCase (`Sidebar.tsx`), `shared/`
PascalCase. `hooks/` selalu kebab-case `use-*.ts`.

**Kenapa dipisah `hooks/` (logic data) dari `components/` (tampilan)?**
Supaya kalau bentuk API berubah, yang disentuh cukup satu file hook — semua
komponen yang memakainya tidak perlu diubah selama tipe datanya konsisten.

**Path alias**: cuma satu, `@/*` → `./src/*` (lihat `tsconfig.json`) —
sudah otomatis mencakup `@/components/...`, `@/lib/...`, `@/hooks/...`,
`@/types/...`, `@/constants`. Tidak perlu (dan sengaja tidak ditambah)
alias granular terpisah seperti `@/components/*` karena redundan dengan
wildcard yang sudah ada.

## 6. Cara mulai develop

```bash
pnpm install
cp .env.example .env.local   # kalau belum ada; NEXT_PUBLIC_USE_MOCK_API=true secara default
pnpm dev
```

Belum punya pnpm? `corepack enable && corepack prepare pnpm@latest --activate`
(field `packageManager` di `package.json` sudah mengunci versi pnpm yang
dipakai supaya seluruh tim otomatis pakai versi yang sama lewat Corepack).

Buka `http://localhost:3000/login`, isi email/password **apa saja** (mode
mock menerima semua kredensial) → langsung masuk ke dashboard dengan data
contoh dari `src/lib/api/mock/`.

**Env var** (lihat `.env.example`) — `API_BASE_URL` dan `API_KEY` **sengaja
server-only** (tanpa prefix `NEXT_PUBLIC_`, supaya tidak ke-bundle ke
browser); satu-satunya var publik adalah `NEXT_PUBLIC_USE_MOCK_API` (flag
non-rahasia). Lihat bagian 2 untuk konsekuensi arsitekturnya sebelum
backend asli dipakai.

**Begitu backend sungguhan siap:**

1. Set `NEXT_PUBLIC_USE_MOCK_API=false` dan `API_BASE_URL` ke URL backend
   di `.env.local`.
2. Sesuaikan `authorize()` di `src/auth.ts` dengan bentuk response login BE.
3. Cocokkan `src/types/domain.ts` dengan skema response BE yang sebenarnya
   — idealnya minta OpenAPI/Swagger spec ke tim BE dan generate types
   otomatis (`npx openapi-typescript <url> -o src/types/api-generated.ts`)
   supaya FE-BE tidak pernah "salah paham" soal bentuk data.
4. Isi endpoint asli di `lib/api/*.ts` (buat `real/station-api.ts` dkk yang
   implement interface yang sama, pakai `lib/api/fetcher.ts` + header
   `api-key` — lihat komentar di file itu), ganti wiring di
   `lib/api/index.ts` (`USE_MOCK ? mockStationApi : realStationApi`) —
   hooks & Route Handler di `app/api/**` tidak perlu berubah sama sekali
   (BFF sudah diimplementasi, lihat bagian 2).

**Menambah halaman/laporan baru** — ikuti pola yang sudah lengkap di
`ramalan-cuaca` sebagai contoh:

1. Tambah tipe di `types/domain.ts`.
2. Tambah interface `*Api` di `lib/api/*.ts` + implementasi mock di
   `lib/api/mock/*.ts`, wire instance-nya di `lib/api/index.ts`.
3. Tambah Route Handler di `app/api/**/route.ts` yang cek sesi
   (`requireUser()`, `lib/api/route-guard.ts`) dan panggil instance dari
   langkah 2 — contoh utuh: `src/app/api/forecast/route.ts`.
4. Tambah hook di `hooks/use-*.ts` yang `fetch()` ke Route Handler itu
   (bukan import `lib/api/*` langsung — lihat bagian 2) — contoh utuh:
   `src/hooks/use-forecast.ts`.
5. Tambah page di `app/(dashboard)/**` yang consume hook itu — contoh:
   `src/app/(dashboard)/ramalan-cuaca/page.tsx`.

## 7. Yang masih perlu diputuskan/dikerjakan tim

- [ ] Token warna & tipografi final dari UI/UX (saat ini di `globals.css`
      masih palet sementara — sudah dikomentari alasan pemilihannya).
- [ ] Konfirmasi bentuk kontrak API dari BE (idealnya via OpenAPI spec).
- [ ] Putuskan granularitas "real-time": boilerplate ini pakai polling
      (`refetchInterval`) tiap 5 menit untuk status stasiun — cukup untuk
      data IoT cuaca. Kalau butuh update lebih cepat, pertimbangkan
      WebSocket/SSE dari BE, tapi ini menambah kompleksitas signifikan.
- [ ] Fitur Early Warning (disebut di rencana proyek) belum ada
      halamannya, hook, atau route sama sekali — perlu ditambahkan setelah
      kontrak datanya jelas.
- [ ] Export/unduh data: tombol "Unduh Data" di `unduh-data/page.tsx`
      masih placeholder. Rekomendasi: biarkan **backend** yang generate
      file CSV/XLSX dan endpoint-nya balikin URL untuk didownload — jangan
      format file besar di client.
- [ ] Domain yang sudah ada di Postman tapi belum diimplementasi sama
      sekali: Data Hilang, Import data manual (Excel), Companies, User
      Roles, Peta multi-metrik overlay (water_deficit/dry_spell/rainfall_today)
      — lihat tabel endpoint di bagian 2.
- [ ] Unduh Data: field `DownloadDataRow` belum diselaraskan dengan
      endpoint asli (`/weathers/daily` dkk) — endpoint persisnya belum
      dikonfirmasi ke BE, lihat tabel di bagian 2.
- [ ] `VPDReport.kategori` di `types/domain.ts` derived dari threshold
      sementara (`vpd`/`batasAman`) — konfirmasi ke tim Data Analyst/BE
      sebelum dianggap final.
- [ ] Testing: belum ada unit/e2e test di boilerplate ini. Untuk mulai,
      pertimbangkan Vitest + React Testing Library (unit/komponen) dan
      Playwright (e2e, terutama alur login).

## 8. Deployment

Next.js App Router + `proxy.ts` + NextAuth kompatibel dengan Vercel maupun
self-hosted (Docker/VPS) selama Node.js runtime tersedia (bukan static
export, karena ada halaman dinamis + auth). Kalau deploy self-hosted,
siapkan `Dockerfile` multi-stage standar Next.js dan set env var yang sama
seperti `.env.example` di server.

## 9. Yang sudah diverifikasi jalan di boilerplate ini

- `pnpm run build` sukses.
- `pnpm exec eslint .` bersih (0 error), termasuk 2 rule
  `no-restricted-imports` yang menegakkan batas styling di bagian 3.
- `pnpm exec prettier --check .` bersih.
- Alur login penuh (mode mock) diuji lewat request HTTP langsung: ambil
  CSRF token → POST credentials → session tersimpan → halaman `/` yang
  ter-proteksi berhasil di-render dengan sesi aktif.
- `proxy.ts` terbukti menolak akses ke halaman manapun tanpa sesi (redirect
  ke `/login`).

## 10. Package manager

Proyek ini pakai **pnpm** (lockfile `pnpm-lock.yaml`). Alasan singkat:
install lebih cepat & hemat disk (content-addressable store, bukan copy
`node_modules` penuh), `node_modules` yang "strict" (kalau ada kode yang
diam-diam mengimpor package yang bukan dependency langsung, ketahuan lebih
awal), dan dukungan workspace/monorepo paling matang kalau nanti proyek ini
dipecah jadi beberapa package. Kalau tim lebih nyaman pakai npm/yarn, tinggal
hapus `pnpm-lock.yaml` + `pnpm-workspace.yaml` dan install ulang seperti
biasa — tidak ada bagian lain dari boilerplate ini yang pnpm-spesifik.

File `pnpm-workspace.yaml` di root berisi 2 pengaturan yang otomatis
di-generate pnpm saat install pertama kali (fitur keamanan supply-chain
bawaan pnpm terbaru), aman untuk dibiarkan:

- `allowBuilds: unrs-resolver: true` — mengizinkan satu dependency
  (dipakai internal oleh ESLint) menjalankan script `postinstall`-nya.
- `minimumReleaseAgeExclude` — mengecualikan satu paket dari aturan "tolak
  paket yang baru dirilis" (proteksi terhadap serangan supply-chain lewat
  versi baru yang di-publish tiba-tiba).
