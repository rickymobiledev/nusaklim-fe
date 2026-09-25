import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { NewsFormPage } from "@/components/domain/user-management/news/NewsFormPage";

/** Admin-only — guard role di sini, pola sama `companies/new/page.tsx`. */
export default async function NewNewsPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMINISTRATOR") redirect("/");

  return <NewsFormPage mode="create" />;
}
