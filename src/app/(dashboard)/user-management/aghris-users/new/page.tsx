import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { AghrisUserFormPage } from "@/components/domain/user-management/aghris-users/AghrisUserFormPage";

/** Admin-only — guard role di sini, pola sama `users/new/page.tsx`. */
export default async function NewAghrisUserPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMINISTRATOR") redirect("/");

  return <AghrisUserFormPage mode="create" />;
}
