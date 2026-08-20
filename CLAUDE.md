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
- JANGAN pernah pakai `npm` atau `yarn` di project ini.

## Aturan wajib sebelum menganggap task selesai
1. Jalankan `pnpm run build` — harus sukses tanpa error (warning font
   Google boleh diabaikan kalau memang tidak ada koneksi internet).
2. Jalankan `pnpm exec eslint .` — 0 error (warning boleh, tapi jelaskan
   kenapa kalau ada warning baru).
3. JANGAN ubah `src/proxy.ts` kecuali diminta eksplisit — file ini pakai
   konvensi Next.js 16 (`export function proxy`, bukan `middleware`), dan
   harus tetap literal function declaration (bukan re-export hasil
   destructuring) atau Next.js akan diam-diam tidak menganggapnya valid.

## Pola yang harus diikuti
- Data fetching SELALU lewat hook di `src/hooks/`, jangan fetch langsung
  di komponen halaman.
- Tiap hook data punya branch `if (USE_MOCK) return ...` — pertahankan
  pola ini kalau menambah hook baru, supaya UI tetap bisa dites tanpa
  backend.
- Tipe data taruh di `src/types/domain.ts`, jangan bikin tipe ad-hoc di
  file komponen.
- Komponen UI dasar (Button, Card, dst) di `src/components/ui/` ditulis
  manual ala shadcn (bukan hasil CLI, karena `ui.shadcn.com` kadang tidak
  bisa diakses dari sini) — ikuti pola yang sudah ada kalau menambah
  komponen baru, jangan install `shadcn` CLI kecuali diminta.
- Semua teks UI dalam Bahasa Indonesia, konsisten dengan yang sudah ada.

## Yang belum final (lihat README.md bagian 5 untuk detail)
Token warna/tipografi masih placeholder, kontrak API backend belum
dikonfirmasi tim BE, fitur Early Warning belum ada halamannya, export data
di halaman Unduh Data masih placeholder tombol saja.

## Kalau ragu
Tanya dulu sebelum mengubah `src/auth.ts`, `src/auth.config.ts`, atau
`src/proxy.ts` secara struktural — ini bagian paling sensitif (auth &
proteksi route). Perubahan kecil (misal ganti nama field) boleh langsung,
tapi perubahan pola (misal ganti strategi session) sebaiknya dikonfirmasi.
