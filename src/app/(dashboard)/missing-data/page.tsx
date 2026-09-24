import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { MissingDataSection } from "@/components/domain/missing-data/MissingDataSection";

/** Halaman ini admin-only — `proxy.ts` cuma cek login, BUKAN role, jadi
 *  guard role-nya di sini (Server Component), pola sama
 *  `user-management/users/page.tsx`. */
export default async function MissingDataPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMINISTRATOR") redirect("/");

  return (
    <div className="-mx-6 -mt-6 flex flex-col gap-4 bg-[#F5F7FB] px-6 pt-6">
      <MissingDataSection />
    </div>
  );
}
