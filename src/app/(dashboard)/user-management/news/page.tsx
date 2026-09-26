import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { UserManagementLayout } from "@/components/domain/user-management/UserManagementLayout";
import { NewsSection } from "@/components/domain/user-management/news/NewsSection";

/** Admin-only — guard role di sini, pola sama `companies/page.tsx`. */
export default async function NewsManagementPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMINISTRATOR") redirect("/");

  return (
    <UserManagementLayout>
      <NewsSection />
    </UserManagementLayout>
  );
}
