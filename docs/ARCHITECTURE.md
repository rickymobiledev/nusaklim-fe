# Arsitektur — PPN Weather Dashboard

Dokumen ini untuk dibaca **sekali di awal onboarding**, supaya paham seluruh
struktur project tanpa harus menyimpulkan sendiri dari kode. Untuk konteks
"kenapa" di balik tiap keputusan stack/alur auth secara naratif, lihat
[README.md](../README.md) — dokumen ini melengkapi (bukan menggantikan) README
dengan bentuk tabel/checklist yang lebih cepat di-scan, plus ADR ringkas.

`CLAUDE.md` di root adalah versi ringkas yang otomatis dibaca tiap sesi Claude
Code — kalau ada perbedaan antara dokumen ini dan `CLAUDE.md`, `CLAUDE.md`
menang untuk keputusan operasional (perintah yang valid, aturan wajib
sebelum selesai, dsb).

---

## 1. Pohon Folder

```
src/
├── app/
│   ├── (auth)/login/page.tsx        # halaman login, layout tanpa sidebar
│   ├── (dashboard)/                 # semua halaman utama, 1 folder = 1 halaman
│   │   ├── layout.tsx                #   cek sesi + render Sidebar/Topbar/Breadcrumb
│   │   ├── page.tsx                  #   Beranda
│   │   ├── peta/page.tsx
│   │   ├── monitoring/               #   index + 4 sub-halaman
│   │   │   ├── page.tsx              #     hub statis (kartu link ke 4 sub-halaman)
│   │   │   ├── keseimbangan-air/page.tsx
│   │   │   ├── dry-spell/page.tsx
│   │   │   ├── lama-penyinaran/page.tsx
│   │   │   └── vpd/page.tsx
│   │   ├── unduh-data/page.tsx
│   │   └── ramalan-cuaca/page.tsx
│   └── api/                          # Route Handler internal (BFF) — lihat bagian 3
│       ├── auth/[...nextauth]/route.ts
│       ├── stations/route.ts, stations/[id]/route.ts, stations/summary/route.ts
│       ├── weather/route.ts
│       ├── monitoring/{water-balance,dry-spell,sunshine-duration,vpd}/route.ts
│       ├── download-data/route.ts
│       └── forecast/route.ts         #   POST, bukan GET
│   Tambah halaman baru → folder baru di sini + page.tsx. Tambah endpoint baru
│   → folder baru di app/api/**/route.ts (ikuti pola bagian 2).
├── components/
│   ├── ui/          # primitif ala shadcn manual — Tailwind murni (badge, button,
│   │                # card, input, select, table, tabs, dst). Tambah primitif baru
│   │                # di sini kalau butuh building block generik tanpa tema/state.
│   ├── shared/      # komponen reusable lintas domain, styled-components + token
│   │                # (StatusBadge, StatCard, MetricCard, DataTable, DataState,
│   │                # EmptyState, TrendChart, DateRangePicker, StationSelect, RoleGate).
│   │                # Tambah di sini kalau dipakai ≥2 domain.
│   ├── layout/      # Sidebar, SidebarItem, Topbar, Breadcrumb — shell dashboard,
│   │                # styled-components. Tambah di sini hanya untuk elemen shell
│   │                # (bukan konten halaman).
│   ├── domain/      # komponen spesifik SATU domain, per-subfolder (peta/,
│   │                # monitoring/, ramalan-cuaca/, stasiun/). Tambah file baru di
│   │                # sini kalau komponennya tidak masuk akal dipakai domain lain.
│   └── providers/   # QueryClientProvider (query-provider.tsx), providers.tsx
│                     # (bundel semua context provider top-level).
├── constants/index.ts   # NAV_ITEMS, API_BASE_URL, USE_MOCK, DATA_GRANULARITY,
│                         # helper judul halaman/breadcrumb. Tambah konstanta
│                         # global baru di sini, bukan hardcode di komponen.
├── hooks/           # SEMUA React Query hook, kebab-case use-*.ts. Hook baru
│                     # WAJIB hanya fetch("/api/...") — lihat bagian 2.
├── lib/
│   ├── api/
│   │   ├── *-api.ts        # interface/kontrak per domain (station-api.ts,
│   │   │                    # weather-api.ts, monitoring-api.ts, download-api.ts,
│   │   │                    # ramalan-cuaca-api.ts) — tipe params + interface *Api.
│   │   ├── index.ts        # SATU titik wiring — diimpor HANYA oleh Route Handler.
│   │   ├── mock/            # implementasi mock tiap interface + auth.ts (login mock),
│   │   │                     # delay.ts (simulasi latency). Domain baru → tambah file
│   │   │                     # mock di sini dulu.
│   │   ├── adapters/        # weather-brand-adapter.ts — normalisasi field cuaca
│   │   │                     # yang beda per brand device IoT.
│   │   ├── endpoints/       # SCAFFOLD kosong (.gitkeep) — tempat konstanta path
│   │   │                     # endpoint asli nanti, belum dibutuhkan selama masih mock.
│   │   ├── fetcher.ts       # axios client server-only (createApiClient, publicApi) —
│   │   │                     # SIAP tapi BELUM dipakai; akan dipanggil dari real/*
│   │   │                     # (belum dibuat) di dalam Route Handler.
│   │   ├── client-fetch.ts # fetchJson() — dipakai HANYA oleh hooks di browser.
│   │   ├── route-guard.ts  # requireUser(), resolveCompanyId(), apiErrorResponse() —
│   │   │                     # dipanggil tiap Route Handler, lihat bagian 3 & 5.
│   │   └── error-messages.ts # getErrorMessage() — map ApiError.code → pesan ID.
│   ├── auth/         # current-user.ts (getCurrentUser, dipakai route-guard.ts),
│   │                  # detect-login-method.ts (NIK SAP/email/username).
│   ├── design-tokens.ts / theme.ts / theme-utils.ts / registry.tsx
│   │                  # sumber tunggal token warna/spacing/radius + wiring
│   │                  # ThemeProvider styled-components. Ubah warna/tema di sini,
│   │                  # BUKAN hardcode hex di komponen.
│   └── utils/index.ts # cn() (HANYA boleh diimpor dari components/ui/**) + util
│                        # lain (mis. degreesToCompass) yang boleh dipakai di mana saja.
├── types/
│   ├── domain.ts       # kontrak data tiap domain — lihat bagian 2.
│   ├── api.ts          # envelope response — lihat bagian 3.
│   ├── auth.ts         # UserRole, LoginMethod, BackendUserProfile.
│   ├── ramalan-cuaca.ts # ForecastDay, ForecastResult.
│   ├── next-auth.d.ts  # augmentasi tipe Session/JWT NextAuth.
│   └── styled.d.ts     # augmentasi DefaultTheme styled-components.
├── auth.ts / auth.config.ts   # setup NextAuth v5 (Credentials provider).
└── proxy.ts                    # (dulu "middleware.ts") proteksi route halaman.
```

**Folder kosong yang disengaja** (scaffold, bukan sisa rusak) —
`components/domain/{monitoring,ramalan-cuaca,stasiun}/` dan
`lib/api/endpoints/`, masing-masing cuma berisi `.gitkeep`. Interface/tipe
yang akan dipakai isinya sudah siap di `lib/api/*.ts`/`types/domain.ts`,
tinggal diisi begitu ada kebutuhan komponen domain-spesifik atau kontrak
endpoint asli.

---

## 2. Domain: halaman, hook, Route Handler, tipe data

| Domain                              | Halaman                                                | Hook                                                                                                                                                                                                                          | Route Handler                                                                                                                              | Tipe utama (`types/domain.ts`)                                 |
| ----------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| Beranda (ringkasan)                 | `app/(dashboard)/page.tsx`                             | `useStationSummary`, `useWeatherMetrics`, `useWaterBalance`, `useDrySpell`, `useSunshineDuration` (`hooks/use-stations.ts`, `use-weather-metrics.ts`, `use-water-balance.ts`, `use-dry-spell.ts`, `use-sunshine-duration.ts`) | `/api/stations/summary`, `/api/weather`, `/api/monitoring/water-balance`, `/api/monitoring/dry-spell`, `/api/monitoring/sunshine-duration` | `StationSummary`, `WeatherMetric` (+ tipe monitoring di bawah) |
| Peta                                | `app/(dashboard)/peta/page.tsx`                        | `useStations` (`hooks/use-stations.ts`)                                                                                                                                                                                       | `GET /api/stations`                                                                                                                        | `Station`, `StationStatus`                                     |
| Monitoring — Keseimbangan Air       | `app/(dashboard)/monitoring/keseimbangan-air/page.tsx` | `useWaterBalance` (`hooks/use-water-balance.ts`)                                                                                                                                                                              | `GET /api/monitoring/water-balance`                                                                                                        | `WaterBalance`, `WaterBalanceMonth`, `BulanKey`                |
| Monitoring — Deret Hari Tidak Hujan | `app/(dashboard)/monitoring/dry-spell/page.tsx`        | `useDrySpell` (`hooks/use-dry-spell.ts`)                                                                                                                                                                                      | `GET /api/monitoring/dry-spell`                                                                                                            | `DrySpellReport`                                               |
| Monitoring — Lama Penyinaran        | `app/(dashboard)/monitoring/lama-penyinaran/page.tsx`  | `useSunshineDuration` (`hooks/use-sunshine-duration.ts`)                                                                                                                                                                      | `GET /api/monitoring/sunshine-duration`                                                                                                    | `SunshineDuration`                                             |
| Monitoring — VPD                    | `app/(dashboard)/monitoring/vpd/page.tsx`              | `useVPD` (`hooks/use-vpd.ts`)                                                                                                                                                                                                 | `GET /api/monitoring/vpd`                                                                                                                  | `VPDReport`                                                    |
| Ramalan Cuaca                       | `app/(dashboard)/ramalan-cuaca/page.tsx`               | `useForecast` (`hooks/use-forecast.ts`)                                                                                                                                                                                       | `POST /api/forecast`                                                                                                                       | `ForecastResult`, `ForecastDay` (`types/ramalan-cuaca.ts`)     |
| Unduh Data                          | `app/(dashboard)/unduh-data/page.tsx`                  | `useDownloadData` (`hooks/use-download-data.ts`)                                                                                                                                                                              | `GET /api/download-data`                                                                                                                   | `DownloadDataRow`                                              |

Hook lain yang bukan per-halaman: `useStationDetail` (`hooks/use-station-detail.ts`
→ `GET /api/stations/[id]`, dipakai untuk detail popup di peta),
`useCurrentUser` (`hooks/use-current-user.ts`, wrapper `useSession()` NextAuth,
tanpa fetch REST), `useSidebarStore` (`hooks/use-sidebar-store.ts`, Zustand
client-only, tanpa fetch).

**Komponen domain (`components/domain/**`)**: hanya `peta/` yang terisi
(`station-map.tsx` — React-Leaflet `MapContainer`, dan
`dynamic-station-map.tsx` — wrapper `next/dynamic` `ssr:false` karena Leaflet
menyentuh `window`). 3 domain lain (`monitoring/`, `ramalan-cuaca/`,
`stasiun/`) masih scaffold kosong — halaman-halaman itu membangun UI-nya
langsung di `page.tsx` + komponen dari `components/shared/*`
(`DataTable`, `DataState`, `StationSelect`, `StatusBadge`, dst).

Pola menambah domain baru: lihat README.md bagian 6 ("Menambah
halaman/laporan baru"), contoh lengkap paling representatif adalah pasangan
`app/api/forecast/route.ts` + `hooks/use-forecast.ts` +
`app/(dashboard)/ramalan-cuaca/page.tsx`.

---

## 3. Kontrak API internal

Didefinisikan di [`src/types/api.ts`](../src/types/api.ts):

- List: `ApiListResponse<T> = { data: T[]; meta: { page, pageSize, total } }`
- Single item: `ApiItemResponse<T> = { data: T }`
- Error: implementasi (mock/real) `throw` instance `ApiError` (`code`,
  `message`) — bukan return body. Route Handler menangkapnya lewat
  `apiErrorResponse()` (lihat di bawah), UI memanggil `getErrorMessage(error)`
  dari `lib/api/error-messages.ts` untuk pesan Bahasa Indonesia yang konsisten.

**Inkonsistensi yang perlu diketahui** (ditemukan saat audit ini, belum
diperbaiki — bukan scope dokumen ini): `types/api.ts` juga mendefinisikan
`ApiErrorBody = { error: { code, message } }`, tapi implementasi nyata di
[`src/lib/api/route-guard.ts`](../src/lib/api/route-guard.ts) —
`apiErrorResponse()` — sebenarnya mengembalikan bentuk **flat**
`{ code, message }` (tanpa wrapper `error`). `ApiErrorBody` saat ini tidak
dipakai di mana pun dan tidak match implementasi asli. Kalau menambah
konsumen baru yang mem-parsing body error mentah (bukan lewat
`getErrorMessage()`), pakai bentuk flat yang benar-benar dikembalikan, bukan
`ApiErrorBody`.

Sesi & guard, semua di `route-guard.ts`:

- `requireUser()` — cek sesi di awal tiap Route Handler (proxy.ts sengaja
  tidak meng-cover `app/api/**` supaya endpoint bisa balikin JSON 401,
  bukan redirect).
- `resolveCompanyId(user, requestedCompanyId?)` — satu-satunya tempat yang
  boleh menentukan `companyId` final; `VIEWER_ANPER`/`VIEWER_HOLDING` selalu
  dipaksa ke `user.companyCode`, `ADMINISTRATOR`/`RESEARCHER` sementara boleh
  lintas company. Lihat bagian 5 dan `CLAUDE.md` bagian "companyId
  (multi-tenant)" — status "sementara" ini belum keputusan final PM.
- `apiErrorResponse(error)` — konversi `ApiError` → JSON response.

---

## 4. Konvensi Styling

Dua sistem yang sengaja dipisah per folder, **ditegakkan otomatis lewat
ESLint** (`no-restricted-imports` di
[`eslint.config.mjs`](../eslint.config.mjs), bukan cuma konvensi):

```js
// eslint.config.mjs — files: ["src/components/ui/**"]
group: ["styled-components", "styled-components/*"];
// → components/ui/** dilarang import styled-components

// eslint.config.mjs — files: ["src/components/{shared,layout,domain}/**"]
group: [
  "@/lib/utils",
  "@/lib/utils/*",
  "tailwind-merge",
  "class-variance-authority",
  "class-variance-authority/*",
];
// → shared/layout/domain dilarang cn()/tailwind-merge/cva
```

| Sisi boundary                                                | Aturan                                                                                                                  | Contoh referensi                                                                                                                                                                                                                                                                         |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/ui/**`                                           | Tailwind murni + `cn()`/`cva`, tanpa styled-components                                                                  | [`src/components/ui/button.tsx`](../src/components/ui/button.tsx) — `cva` variant map + `cn()`, tanpa styled-components sama sekali                                                                                                                                                      |
| `components/{shared,layout,domain}/**`                       | `styled-components` + token dari `lib/design-tokens.ts`, wrap primitif `ui/**` dengan `styled(...)` kalau perlu compose | [`src/components/shared/StatusBadge.tsx`](../src/components/shared/StatusBadge.tsx) — `styled(Badge)<{ $tone }>`, atau [`src/components/layout/SidebarItem.tsx`](../src/components/layout/SidebarItem.tsx) — `styled(Link)<{ $active; $collapsed }>` baca `theme.colors`/`theme.spacing` |
| Pengecualian: className statis untuk markup layout sederhana | Boleh Tailwind className biasa selama TIDAK ada logic kondisional berbasis props/state                                  | [`src/components/layout/Topbar.tsx`](../src/components/layout/Topbar.tsx) — semua className statis, begitu perlu kondisional pindah ke styled-components                                                                                                                                 |

Detail lengkap & rasional: README.md bagian 3.

---

## 5. Status tiap domain

| Domain                              | Mock / Real | Field diselaraskan API asli?                                                             | Terintegrasi ke halaman?                                          |
| ----------------------------------- | ----------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Beranda (Cuaca terkini)             | Mock        | Ya (+ brand adapter, lihat `lib/api/adapters/weather-brand-adapter.ts`)                  | Ya                                                                |
| Peta / Stasiun                      | Mock        | Ya                                                                                       | Ya                                                                |
| Monitoring — Keseimbangan Air       | Mock        | Ya (di-pivot ke bentuk per-bulan)                                                        | Ya                                                                |
| Monitoring — Deret Hari Tidak Hujan | Mock        | Ya                                                                                       | Ya                                                                |
| Monitoring — VPD                    | Mock        | Ya (`kategori` **derived** dari threshold sementara, belum dikonfirmasi Data Analyst/BE) | Ya                                                                |
| Monitoring — Lama Penyinaran        | Mock        | Ya                                                                                       | Ya                                                                |
| Ramalan Cuaca                       | Mock        | Ya                                                                                       | Ya                                                                |
| Unduh Data                          | Mock        | **Belum** — endpoint asli belum dikonfirmasi BE                                          | Ya (data), tombol download masih placeholder                      |
| Data Hilang                         | —           | —                                                                                        | **Belum ada sama sekali** (page/hook/route/mock)                  |
| Import data manual                  | —           | —                                                                                        | **Belum ada sama sekali**                                         |
| Companies                           | —           | —                                                                                        | **Belum ada sama sekali**                                         |
| User Roles                          | —           | —                                                                                        | **Belum ada sama sekali**                                         |
| Peta — overlay multi-metrik         | —           | —                                                                                        | **Belum ada** — peta saat ini hanya pakai endpoint status stasiun |

Catatan lintas-domain:

- **`real/*` belum ada untuk domain DATA manapun** (stations/weather/
  monitoring/dst). `lib/api/fetcher.ts` (axios client, `baseURL:
API_V2_URL` + header `api-key` + injeksi `company_code`) sudah siap
  tapi belum dipanggil dari mana pun untuk domain-domain ini.
  `lib/api/index.ts` **hardcode** ke implementasi mock (bukan
  `USE_MOCK ? mock : real`). **Login beda** — `src/auth.ts` sudah punya
  toggle itu dan sudah panggil backend asli (`{API_V2_URL}/authentications`
  - header `api-key`) begitu `NEXT_PUBLIC_USE_MOCK_API=false`.
- `lib/api/mock/monitoring-api.ts` punya TODO eksplisit: belum validasi
  `companyId` request terhadap company pemilik stasiun.

---

## 6. Getting Started

1. **Node & pnpm** — tidak ada `engines`/`.nvmrc` yang di-pin di repo ini;
   `packageManager: "pnpm@11.22.0"` di `package.json` mengunci versi pnpm
   (aktifkan lewat `corepack enable && corepack prepare pnpm@latest --activate`).
   `@types/node: ^20` mengindikasikan target Node 20 LTS — pakai itu kalau
   ragu, tapi ini inferensi, bukan pin resmi tim.
2. **Install**:
   ```bash
   pnpm install
   ```
3. **Env var** — copy `.env.example` ke `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   | Var                        | Wajib?                                       | Dari mana                                                                                                                                                                                           |
   | -------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `NEXT_PUBLIC_USE_MOCK_API` | Wajib, default `true`                        | Sudah ada di `.env.example`, tidak perlu diubah untuk dev lokal — semua hook otomatis pakai `src/lib/api/mock/`.                                                                                    |
   | `AUTH_SECRET`              | Wajib                                        | Generate sendiri: `npx auth secret` (atau `openssl rand -base64 32`). Tidak ada nilai baku, tiap developer generate sendiri.                                                                        |
   | `API_BASE_URL`             | Hanya kalau `NEXT_PUBLIC_USE_MOCK_API=false` | Minta ke pihak yang pegang akses backend Nusaklim (tim BE). **Origin polos, TANPA `/api`** — prefix `/api/v2` sudah otomatis lewat `API_V2_URL` (`src/constants/index.ts`), jangan diulang di sini. |
   | `API_KEY`                  | Hanya kalau `NEXT_PUBLIC_USE_MOCK_API=false` | Minta `API_KEY` produksi/staging Nusaklim ke tim BE — **jangan** commit nilai asli ke mana pun.                                                                                                     |
   | `NEXTAUTH_URL`             | Hanya di production                          | Set ke origin Next.js production (mis. `https://cuaca.contoh.id`).                                                                                                                                  |
4. **Jalankan dev server**:
   ```bash
   pnpm dev
   ```
   Buka `http://localhost:3000/login`, isi email/password **apa saja**
   (mode mock menerima semua kredensial) → masuk ke dashboard dengan data
   contoh dari `src/lib/api/mock/`.
5. **Sebelum push/PR** — 3 perintah wajib (lihat `CLAUDE.md`):
   ```bash
   pnpm run build
   pnpm exec eslint .
   pnpm exec prettier --check .
   ```

Detail lengkap "begitu backend sungguhan siap" (langkah ganti mock→real):
README.md bagian 6.

---

## 7. Keputusan Arsitektur & Alasannya (ADR ringkas)

**Tailwind/shadcn dicampur styled-components (bukan salah satu saja)**

- Keputusan: `components/ui/**` Tailwind murni (primitif generik), sisanya
  (`shared/layout/domain`) styled-components + token terpusat.
- Kenapa: primitif generik (Button, Card) tidak butuh state/tema kompleks —
  `cva`+className sudah cukup dan ringan. Komponen komposisi/bertema
  (status warna dinamis, spacing terhitung dari props) lebih mudah dibaca
  sebagai styled-components daripada string `cn()` yang membengkak dengan
  banyak kondisi.
- Alternatif dipertimbangkan: Tailwind+`cva` untuk semuanya (ditolak — sulit
  dibaca untuk kombinasi kondisi kompleks di komponen bertema), atau
  styled-components untuk semuanya (ditolak — ekosistem shadcn/Radix
  berbasis className, dan primitif generik jadi lebih berat tanpa manfaat).

**`API_KEY` wajib lewat Route Handler server-side, bukan langsung dari client**

- Keputusan: `API_BASE_URL`/`API_KEY` server-only (tanpa prefix
  `NEXT_PUBLIC_`), hanya boleh dibaca dari dalam `app/api/**` lewat
  `lib/api/fetcher.ts`.
- Kenapa: variabel dengan prefix `NEXT_PUBLIC_` di-bundle ke JS yang dikirim
  ke browser — kalau `API_KEY` diberi prefix itu (atau dipanggil langsung
  dari kode client), kunci statis itu bocor ke siapa pun yang buka DevTools.
- Alternatif dipertimbangkan: panggil backend langsung dari client component
  (ditolak — kebocoran kredensial), edge middleware sebagai proxy terpisah
  (tidak dipilih — Route Handler BFF yang sudah ada untuk cek-sesi-per-endpoint
  cukup merangkap fungsi ini tanpa layer tambahan).

**`company_code` di-enforce dari session, bukan dari parameter client**

- Keputusan: `resolveCompanyId()` di `lib/api/route-guard.ts` adalah
  satu-satunya tempat yang menentukan `companyId` final; Route Handler
  dilarang membaca `searchParams.get("companyId")` mentah.
- Kenapa: kalau client bebas mengirim `companyId` lewat query string dan
  server percaya begitu saja, itu IDOR — user company A bisa minta data
  company B hanya dengan mengubah parameter URL.
- Alternatif dipertimbangkan: percaya `companyId` dari client lalu validasi
  terpisah di tiap handler (ditolak — mudah lupa validasi di satu endpoint
  baru dan jadi celah), dibanding satu titik resolve wajib yang dipanggil
  semua handler.

**Data layer mock-first dengan kontrak terstandarisasi**

- Keputusan: seluruh domain 100% mock dulu (`lib/api/mock/*`), lewat
  interface yang sama dengan yang akan dipakai `real/*` nanti, dibungkus
  kontrak response seragam (`ApiListResponse`/`ApiItemResponse`/`ApiError`).
- Kenapa: tim FE bisa mulai & mendemokan UI tanpa menunggu `API_KEY`
  produksi atau kontrak BE final; begitu backend siap, swap mock→real cukup
  ganti wiring satu baris di `lib/api/index.ts`, tanpa menyentuh hooks atau
  komponen UI sama sekali.
- Alternatif dipertimbangkan: tunggu backend & kontrak final dulu baru mulai
  FE (ditolak — blocking, timeline proyek tidak mengizinkan), atau tiap
  endpoint bebas menentukan bentuk response sendiri (ditolak — tiap
  komponen UI harus menangani bentuk data berbeda-beda, lebih rawan bug).
