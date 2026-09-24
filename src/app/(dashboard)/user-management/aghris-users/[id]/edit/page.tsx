import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { AghrisUserFormPage } from "@/components/domain/user-management/aghris-users/AghrisUserFormPage";

/** Admin-only — guard role di sini, pola sama `users/[id]/edit/page.tsx`. */
export default async function EditAghrisUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (user?.role !== "ADMINISTRATOR") redirect("/");

  const { id } = await params;
  return <AghrisUserFormPage mode="edit" userId={id} />;
}
