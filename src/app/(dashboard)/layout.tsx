import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // `middleware.ts` sudah menolak request tanpa sesi sebelum sampai ke sini.
  // Cek ulang di Server Component ini adalah "defense in depth" — memastikan
  // data-fetching di server (kalau nanti ditambah) tidak pernah jalan tanpa
  // sesi valid, dan supaya halaman ini tetap aman meski dipanggil dengan cara
  // yang tidak lewat middleware (misalnya server action langsung).
  const session = await auth();
  if (!session) redirect("/login");

  return <DashboardShell>{children}</DashboardShell>;
}
