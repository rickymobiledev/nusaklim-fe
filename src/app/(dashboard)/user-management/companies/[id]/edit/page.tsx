import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { CompanyFormPage } from "@/components/domain/user-management/companies/CompanyFormPage";

/** Admin-only — guard role di sini, pola sama `aghris-users/[id]/edit/page.tsx`. */
export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (user?.role !== "ADMINISTRATOR") redirect("/");

  const { id } = await params;
  return <CompanyFormPage mode="edit" companyId={id} />;
}
