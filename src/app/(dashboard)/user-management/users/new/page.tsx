import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { UserFormPage } from "@/components/domain/user-management/users/UserFormPage";

/** Admin-only — guard role di sini, pola sama `users/page.tsx`. */
export default async function NewUserPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMINISTRATOR") redirect("/");

  return <UserFormPage mode="create" />;
}
