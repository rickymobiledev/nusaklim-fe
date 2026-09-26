import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { UserManagementLayout } from "@/components/domain/user-management/UserManagementLayout";
import { StationsSection } from "@/components/domain/user-management/stations/StationsSection";

/** Admin-only — guard role di sini, pola sama `companies/page.tsx`. */
export default async function StationsPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMINISTRATOR") redirect("/");

  return (
    <UserManagementLayout>
      <StationsSection />
    </UserManagementLayout>
  );
}
