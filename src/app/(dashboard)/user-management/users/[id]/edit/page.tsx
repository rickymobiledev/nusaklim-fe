import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { UserFormPage } from "@/components/domain/user-management/users/UserFormPage";

/** Admin-only — guard role di sini, pola sama `users/page.tsx`. */
export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (user?.role !== "ADMINISTRATOR") redirect("/");

  const { id } = await params;
  return <UserFormPage mode="edit" userId={id} />;
}
