import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { UserManagementLayout } from "@/components/domain/user-management/UserManagementLayout";
import { AghrisUsersSection } from "@/components/domain/user-management/aghris-users/AghrisUsersSection";

/** Admin-only — guard role di sini, pola sama `users/page.tsx`. */
export default async function AghrisUsersPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMINISTRATOR") redirect("/");

  return (
    <UserManagementLayout>
      <AghrisUsersSection />
    </UserManagementLayout>
  );
}
