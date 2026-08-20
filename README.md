# PPN Weather Dashboard — Frontend Boilerplate

Boilerplate Next.js untuk redesign aplikasi monitoring cuaca perkebunan
(existing app: Beranda, Peta, Monitoring, Unduh Data + menu baru Ramalan
Cuaca hasil model DL). Dibuat berdasarkan screenshot app existing + rencana
proyek (Gantt chart) yang melibatkan tim UI/UX, Frontend, Backend, dan Data
Analyst.

## 1. Stack & alasan pemilihan

| Kebutuhan | Pilihan | Kenapa |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | Sudah jadi keputusan tim. App Router dipakai karena mendukung Server Components (auth check di server), layout bersarang (cocok untuk sidebar/navbar persisten), dan `proxy.ts` untuk proteksi route. |
| Styling | Tailwind CSS v4 + komponen ala shadcn/ui (Radix primitives, ditulis manual) | Cepat membangun UI dashboard yang konsisten, gampang di-hand-off dari desain Figma tim UI/UX ke kelas Tailwind. *Catatan: CLI `shadcn` butuh akses ke `ui.shadcn.com` — kalau jaringan kalian tidak memblokirnya, jalankan `npx shadcn@latest add <komponen>` untuk menambah komponen baru; kalau diblokir, ikuti pola manual yang sudah ada di `src/components/ui/`.* |
| Auth | Auth.js / NextAuth v5 (Credentials provider) | Backend kalian terpisah (bukan Next.js API sebagai BE utama), jadi Next.js berperan sebagai *klien* yang login ke API backend. Token disimpan di JWT session NextAuth (httpOnly cookie, dienkripsi) — **bukan** di `localStorage`, supaya tidak gampang dicuri lewat XSS. |
| Data fetching & cache | TanStack Query | Auto-caching, refetch interval (dipakai untuk status sinkronisasi stasiun IoT), retry, loading/error state siap pakai — jauh lebih sedikit boilerplate dibanding `useEffect` + `fetch` manual. |
| Tabel data | TanStack Table v8 | Dipakai di halaman Unduh Data & Ramalan Cuaca. *(Sengaja di-pin ke v8, bukan v9 yang baru rilis dengan API berbeda jauh, supaya lebih stabil & terdokumentasi.)* |
| Form & validasi | React Hook Form + Zod | Dipakai di form login; pola yang sama bisa dipakai untuk form filter tanggal, form Early Warning, dsb. |
| State ringan (client-only) | Zustand (sudah terpasang, belum dipakai) | Untuk state UI yang tidak berasal dari server, misal: sidebar collapsed/expanded, filter yang perlu persist antar halaman. |
| Chart | Recharts | Wrapper contoh ada di `components/charts/weather-trend-chart.tsx` untuk tren cuaca (temperatur, curah hujan, dst). |
| Peta | React-Leaflet + OpenStreetMap | App existing pakai Highcharts Maps (butuh lisensi komersial). React-Leaflet gratis & open-source. Kalau tim tetap mau tampilan choropleth per-provinsi seperti existing, ganti `components/map/indonesia-map.tsx` dengan `highcharts-react-official` + GeoJSON provinsi. |
| Notifikasi | Sonner (toast) | Sudah dipasang di `Providers`, tinggal panggil `toast.success(...)` / `toast.error(...)` di mana saja. |

## 2. Arsitektur & alur autentikasi

```
Browser (Next.js Client Components)
   |  useSession() -> token dari session NextAuth (httpOnly cookie)
   v
Next.js Server (App Router)
   |- proxy.ts                -> cek sesi SEBELUM request sampai ke halaman manapun
   |- (dashboard)/layout       -> cek sesi lagi di Server Component (defense in depth)
   `- /api/auth/[...nextauth]  -> handler NextAuth (login, session, signout)
          |
          |  POST /auth/login { email, password }
          v
   Backend API (tim BE, terpisah - REST)
          |
          |- Auth service        -> validasi kredensial, keluarkan accessToken
          |- Stations/Weather    -> data stasiun, snapshot cuaca, monitoring
          `- Forecast (DL model) -> hasil model Data Analyst, diekspos sbg REST
```

**Kenapa token disimpan di session NextAuth, bukan Bearer token biasa di
`localStorage`?** Supaya token tidak bisa dibaca langsung lewat
`document.cookie` (httpOnly) atau lewat script pihak ketiga yang ke-inject
(XSS). Trade-off: karena `useSession()` tetap mengekspos `accessToken` ke
konteks React di client (dipakai `hooks/use-api-client.ts` untuk memanggil
API backend langsung dari browser), ini bukan solusi paling aman yang ada.

**Kalau tim BE/security ingin lebih ketat:** ubah pola jadi *BFF (Backend
for Frontend)* penuh — semua panggilan ke backend lewat Next.js Route
Handler (`app/api/.../route.ts`) yang membaca token lewat `auth()` di
server (tidak pernah dikirim ke client sama sekali). Lebih aman, tapi
butuh satu Route Handler per resource yang dipanggil dari client. Struktur
hooks (`use-stations.ts`, dst) sudah dipisah dari cara token didapat,
jadi migrasi ke pola ini nanti tidak perlu mengubah komponen halaman.

**Asumsi yang perlu dikonfirmasi ke tim BE** (lihat `src/auth.ts`):
- Endpoint login: `POST {API_URL}/auth/login` menerima `{ email, password }`,
  membalas `{ user, accessToken, refreshToken? }`. Sesuaikan `authorize()`
  di `src/auth.ts` kalau bentuknya beda (misal pakai `username`, atau
  balikan session cookie bukan JWT).
- Semua endpoint data lain butuh header `Authorization: Bearer <token>`.
- Kalau `accessToken` short-lived, perlu endpoint refresh — sudah ada
  `TODO` di `jwt()` callback (`src/auth.ts`) untuk menambahkan logic ini.

## 3. Struktur folder

```
src/
|- proxy.ts                 # (dulu "middleware.ts" -- Next.js 16 rename) proteksi route
|- auth.ts / auth.config.ts # setup NextAuth
|- app/
|  |- (auth)/login/         # halaman login (layout tanpa sidebar)
|  `- (dashboard)/          # semua halaman utama, dibungkus DashboardShell
|     |- layout.tsx         #   cek sesi + render Sidebar/Navbar
|     |- page.tsx           #   Beranda
|     |- peta/
|     |- monitoring/        #   index + 4 sub-halaman (Keseimbangan Air, dst)
|     |- unduh-data/
|     `- ramalan-cuaca/
|- components/
|  |- ui/          # primitif ala shadcn (Button, Card, Table, dst)
|  |- layout/      # Sidebar, Navbar, DashboardShell
|  |- weather/     # StatCard, WeatherMetricCard, StationSelect
|  |- map/         # peta Leaflet (dynamic import, no-SSR)
|  |- charts/      # wrapper Recharts
|  |- data-table/  # wrapper TanStack Table
|  `- providers/   # QueryClientProvider, SessionProvider, Toaster
|- hooks/          # semua React Query hooks (use-stations, use-forecast, dst)
|- lib/            # api-client, constants, utils (cn), mock-data
`- types/          # domain.ts (kontrak data) + next-auth.d.ts
```

**Kenapa dipisah `hooks/` (logic data) dari `components/` (tampilan)?**
Supaya kalau bentuk API berubah, yang disentuh cukup satu file hook — semua
komponen yang memakainya tidak perlu diubah selama tipe datanya konsisten.

## 4. Cara mulai develop

```bash
pnpm install
cp .env.example .env.local   # kalau belum ada; NEXT_PUBLIC_USE_MOCK=true secara default
pnpm dev
```

Belum punya pnpm? `corepack enable && corepack prepare pnpm@latest --activate`
(field `packageManager` di `package.json` sudah mengunci versi pnpm yang
dipakai supaya seluruh tim otomatis pakai versi yang sama lewat Corepack).

Buka `http://localhost:3000/login`, isi email/password **apa saja** (mode
mock menerima semua kredensial) → langsung masuk ke dashboard dengan data
contoh dari `src/lib/mock-data.ts`.

**Begitu backend sungguhan siap:**
1. Set `NEXT_PUBLIC_USE_MOCK=false` dan `NEXT_PUBLIC_API_URL` ke URL backend.
2. Sesuaikan `authorize()` di `src/auth.ts` dengan bentuk response login BE.
3. Cocokkan `src/types/domain.ts` dengan skema response BE yang sebenarnya
   — idealnya minta OpenAPI/Swagger spec ke tim BE dan generate types
   otomatis (`npx openapi-typescript <url> -o src/types/api-generated.ts`)
   supaya FE-BE tidak pernah "salah paham" soal bentuk data.
4. Isi endpoint asli di tiap hook (`hooks/*.ts`) — strukturnya sudah siap,
   cukup ubah bagian `if (USE_MOCK) return ...` karena axios call di
   bawahnya sudah menunjuk endpoint yang benar.

## 5. Yang masih perlu diputuskan/dikerjakan tim

- [ ] Token warna & tipografi final dari UI/UX (saat ini di `globals.css`
      masih palet sementara — sudah dikomentari alasan pemilihannya).
- [ ] Konfirmasi bentuk kontrak API dari BE (idealnya via OpenAPI spec).
- [ ] Putuskan granularitas "real-time": boilerplate ini pakai polling
      (`refetchInterval`) tiap 5 menit untuk status stasiun — cukup untuk
      data IoT cuaca. Kalau butuh update lebih cepat, pertimbangkan
      WebSocket/SSE dari BE, tapi ini menambah kompleksitas signifikan.
- [ ] Fitur Early Warning (disebut di rencana proyek) belum ada
      halamannya — perlu ditambahkan setelah kontrak datanya jelas.
- [ ] Export/unduh data: tombol "Unduh Data" di `unduh-data/page.tsx`
      masih placeholder. Rekomendasi: biarkan **backend** yang generate
      file CSV/XLSX dan endpoint-nya balikin URL untuk didownload — jangan
      format file besar di client.
- [ ] Testing: belum ada unit/e2e test di boilerplate ini. Untuk mulai,
      pertimbangkan Vitest + React Testing Library (unit/komponen) dan
      Playwright (e2e, terutama alur login).

## 6. Deployment

Next.js App Router + `proxy.ts` + NextAuth kompatibel dengan Vercel maupun
self-hosted (Docker/VPS) selama Node.js runtime tersedia (bukan static
export, karena ada halaman dinamis + auth). Kalau deploy self-hosted,
siapkan `Dockerfile` multi-stage standar Next.js dan set env var yang sama
seperti `.env.example` di server.

## 7. Yang sudah diverifikasi jalan di boilerplate ini

- `pnpm run build` sukses, 13 route ter-generate dengan benar.
- `pnpm exec eslint .` bersih (0 error).
- Alur login penuh (mode mock) diuji lewat request HTTP langsung: ambil
  CSRF token → POST credentials → session tersimpan → halaman `/` yang
  ter-proteksi berhasil di-render dengan sesi aktif.
- `proxy.ts` terbukti menolak akses ke halaman manapun tanpa sesi (redirect
  ke `/login`).

## 8. Package manager

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
