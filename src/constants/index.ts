import type { ComponentType } from "react";
import type { UserRole } from "@/types/auth";
import {
  DashboardIcon,
  MapIcon,
  MonitoringIcon,
  DownloadIcon,
  ForecastIcon,
  type SidebarIconProps,
} from "@/components/shared/SidebarIcons";

/** Origin polos backend Nusaklim (BE team), TANPA path — sama seperti
 *  {{BASE_URL}} di Postman collection mereka. Server-only (tanpa prefix
 *  NEXT_PUBLIC_) — lihat catatan di lib/api/fetcher.ts. */
export const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";

/** SATU sumber kebenaran untuk prefix `/api/v2` yang dipakai SEMUA endpoint
 *  Nusaklim (autentikasi, devices, weathers, forecast, dst — dikonfirmasi
 *  Postman collection). Jangan concat "/api/v2" manual di tempat lain —
 *  pakai konstanta ini (dipakai `auth.ts` & `lib/api/fetcher.ts`) supaya
 *  tidak ada dua tempat yang bisa saling beda kalau prefix-nya berubah. */
export const API_V2_URL = `${API_BASE_URL}/api/v2`;

/** Toggle mock vs real API — dipakai di `lib/api/index.ts` (data) & `auth.ts` (login). */
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<SidebarIconProps>;
  /** Kalau diisi, menu cuma tampil untuk role yang disebut. Kosong = semua role. */
  roles?: UserRole[];
};

/** Sidebar nav — mirrors the existing app's menu (Beranda, Peta, Monitoring, Unduh Data)
 *  plus the new Ramalan Cuaca (DL forecast) menu from the redesign scope. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: DashboardIcon },
  { label: "Peta", href: "/peta", icon: MapIcon },
  { label: "Monitoring", href: "/monitoring", icon: MonitoringIcon },
  { label: "Unduh Data", href: "/unduh-data", icon: DownloadIcon },
  { label: "Ramalan Cuaca", href: "/ramalan-cuaca", icon: ForecastIcon },
];

export const DATA_GRANULARITY = [
  { value: "harian", label: "Per Hari" },
  { value: "10menit", label: "Per 10 Menit" },
  { value: "pagi", label: "Pagi (00:01–12:00)" },
  { value: "siang", label: "Siang (12:01–18:00)" },
  { value: "malam", label: "Malam (18:01–00:00)" },
] as const;

/** Title untuk route yang tidak persis cocok dengan NAV_ITEMS (sub-halaman Monitoring).
 *  Labelnya tetap Bahasa Indonesia meski slug URL "dry-spell" pakai Bahasa Inggris. */
const EXTRA_TITLES: Record<string, string> = {
  "/monitoring/keseimbangan-air": "Keseimbangan Air",
  "/monitoring/dry-spell": "Deret Terpanjang Hari Tidak Hujan",
  "/monitoring/lama-penyinaran": "Lama Penyinaran",
  "/monitoring/vpd": "VPD",
  "/air-temperature": "Temperatur Udara",
  "/login": "Masuk",
};

/** Item `NAV_ITEMS` yang jadi "induk" konsep untuk `pathname` — dicocokkan
 *  by prefix terpanjang, mengecualikan "/" (supaya "/" tidak match SEMUA
 *  path). Dipakai bareng oleh `getPageTitle()`, `getBreadcrumbTrail()`,
 *  DAN `getActiveNavHref()` — satu sumber kebenaran, jangan duplikasi
 *  logic ini di tempat lain. */
function resolveTopLevelNavItem(pathname: string): NavItem | undefined {
  return NAV_ITEMS.filter(
    (item) => item.href !== "/" && pathname.startsWith(item.href),
  ).sort((a, b) => b.href.length - a.href.length)[0];
}

/** Dipakai Topbar untuk menentukan judul halaman otomatis dari pathname. */
export function getPageTitle(pathname: string): string {
  if (EXTRA_TITLES[pathname]) return EXTRA_TITLES[pathname];
  const exact = NAV_ITEMS.find((item) => item.href === pathname);
  if (exact) return exact.label;
  return resolveTopLevelNavItem(pathname)?.label ?? "Beranda";
}

/** Dipakai HeaderNav & Sidebar buat nentuin pill/item mana yang "aktif" —
 *  bukan exact match `pathname === item.href` (itu bikin halaman drill-
 *  down seperti /air-temperature atau sub-halaman Monitoring tidak
 *  nyalain apapun), tapi ikut induk konsepnya sama seperti
 *  `getPageTitle`/`getBreadcrumbTrail` ("/" sendiri otomatis fallback
 *  ke "/" karena tidak ada NAV_ITEM lain yang match). */
export function getActiveNavHref(pathname: string): string {
  return resolveTopLevelNavItem(pathname)?.href ?? "/";
}

export type BreadcrumbCrumb = { label: string; href: string };

/** Dipakai komponen Breadcrumb untuk membangun trail dari pathname saat ini. */
export function getBreadcrumbTrail(pathname: string): BreadcrumbCrumb[] {
  if (pathname === "/") return [{ label: "Beranda", href: "/" }];

  const crumbs: BreadcrumbCrumb[] = [{ label: "Beranda", href: "/" }];

  const topLevel = resolveTopLevelNavItem(pathname);

  if (!topLevel) {
    // Halaman top-level di luar NAV_ITEMS (mis. drill-down dari Beranda
    // seperti /air-temperature) — trail-nya cuma "Beranda > <judul>".
    const subLabel = EXTRA_TITLES[pathname];
    if (subLabel) crumbs.push({ label: subLabel, href: pathname });
    return crumbs;
  }

  crumbs.push({ label: topLevel.label, href: topLevel.href });

  if (pathname !== topLevel.href) {
    const subLabel = EXTRA_TITLES[pathname];
    if (subLabel) crumbs.push({ label: subLabel, href: pathname });
  }

  return crumbs;
}
