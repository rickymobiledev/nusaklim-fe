import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { UserManagementLayout } from "@/components/domain/user-management/UserManagementLayout";
import { CompaniesSection } from "@/components/domain/user-management/companies/CompaniesSection";

/** Admin-only — guard role di sini, pola sama `aghris-users/page.tsx`. */
export default async function CompaniesPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMINISTRATOR") redirect("/");

  return (
    <UserManagementLayout>
      <CompaniesSection />
    </UserManagementLayout>
  );
}
