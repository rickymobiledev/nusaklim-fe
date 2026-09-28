import { redirect } from "next/navigation";

/** Tidak ada halaman "home" Monitoring — tiap sub-halaman sudah punya
 *  `MonitoringDomainNav` untuk pindah domain, jadi menu Monitoring langsung
 *  masuk ke Keseimbangan Air (user tidak perlu memilih 2x). Route ini
 *  dipertahankan hanya sebagai redirect: `NAV_ITEMS` tetap `href: "/monitoring"`
 *  supaya prefix-match `getActiveNavHref` menyalakan pill Monitoring di
 *  SEMUA sub-halaman. */
export default function MonitoringPage() {
  redirect("/monitoring/water-balance");
}
