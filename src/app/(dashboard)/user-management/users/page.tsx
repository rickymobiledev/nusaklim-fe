import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { UserManagementLayout } from "@/components/domain/user-management/UserManagementLayout";
import { UsersSection } from "@/components/domain/user-management/users/UsersSection";

/** Halaman ini admin-only — `proxy.ts` cuma cek login, BUKAN role, jadi
 *  guard role-nya di sini (Server Component), pola sama pengecekan sesi
 *  "defense in depth" di `(dashboard)/layout.tsx`. Role selain
 *  ADMINISTRATOR di-redirect ke Beranda, BUKAN ditampilkan halaman 403
 *  terpisah — konsisten dengan `/login` yang juga cuma redirect. */
export default async function UsersPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMINISTRATOR") redirect("/");

  return (
    <UserManagementLayout>
      <UsersSection />
    </UserManagementLayout>
  );
}
