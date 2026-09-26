import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { CompanyFormPage } from "@/components/domain/user-management/companies/CompanyFormPage";

/** Admin-only — guard role di sini, pola sama `aghris-users/new/page.tsx`. */
export default async function NewCompanyPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMINISTRATOR") redirect("/");

  return <CompanyFormPage mode="create" />;
}
