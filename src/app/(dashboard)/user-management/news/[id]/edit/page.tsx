import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { NewsFormPage } from "@/components/domain/user-management/news/NewsFormPage";

/** Admin-only — guard role di sini, pola sama `companies/[id]/edit/page.tsx`. */
export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (user?.role !== "ADMINISTRATOR") redirect("/");

  const { id } = await params;
  return <NewsFormPage mode="edit" newsId={id} />;
}
