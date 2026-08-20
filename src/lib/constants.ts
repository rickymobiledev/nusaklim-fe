import type { LucideIcon } from "lucide-react";
import {
  Home,
  Globe2,
  MonitorSmartphone,
  CloudDownload,
  Sparkles,
} from "lucide-react";

/** Base URL of the separate backend API (BE team). Never hardcode this elsewhere. */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/** Sidebar nav — mirrors the existing app's menu (Beranda, Peta, Monitoring, Unduh Data)
 *  plus the new Ramalan Cuaca (DL forecast) menu from the redesign scope. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Peta", href: "/peta", icon: Globe2 },
  { label: "Monitoring", href: "/monitoring", icon: MonitorSmartphone },
  { label: "Unduh Data", href: "/unduh-data", icon: CloudDownload },
  { label: "Ramalan Cuaca", href: "/ramalan-cuaca", icon: Sparkles },
];

export const DATA_GRANULARITY = [
  { value: "harian", label: "Per Hari" },
  { value: "10menit", label: "Per 10 Menit" },
  { value: "pagi", label: "Pagi (00:01–12:00)" },
  { value: "siang", label: "Siang (12:01–18:00)" },
  { value: "malam", label: "Malam (18:01–00:00)" },
] as const;

/** Title untuk route yang tidak persis cocok dengan NAV_ITEMS (sub-halaman Monitoring). */
const EXTRA_TITLES: Record<string, string> = {
  "/monitoring/keseimbangan-air": "Keseimbangan Air",
  "/monitoring/deret-hari-tidak-hujan": "Deret Terpanjang Hari Tidak Hujan",
  "/monitoring/lama-penyinaran": "Lama Penyinaran",
  "/monitoring/vpd": "VPD",
  "/login": "Masuk",
};

/** Dipakai Navbar untuk menentukan judul halaman otomatis dari pathname. */
export function getPageTitle(pathname: string): string {
  if (EXTRA_TITLES[pathname]) return EXTRA_TITLES[pathname];
  const exact = NAV_ITEMS.find((item) => item.href === pathname);
  if (exact) return exact.label;
  // fallback: cocokkan prefix terpanjang (misal /monitoring/xyz -> "Monitoring")
  const prefixMatch = NAV_ITEMS.filter(
    (item) => item.href !== "/" && pathname.startsWith(item.href),
  ).sort((a, b) => b.href.length - a.href.length)[0];
  return prefixMatch?.label ?? "Beranda";
}
