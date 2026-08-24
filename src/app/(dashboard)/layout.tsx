import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // `proxy.ts` sudah menolak request tanpa sesi sebelum sampai ke sini.
  // Cek ulang di Server Component ini adalah "defense in depth" — memastikan
  // data-fetching di server (kalau nanti ditambah) tidak pernah jalan tanpa
  // sesi valid, dan supaya halaman ini tetap aman meski dipanggil dengan cara
  // yang tidak lewat proxy (misalnya server action langsung).
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <Breadcrumb />
        <main className="bg-background flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
