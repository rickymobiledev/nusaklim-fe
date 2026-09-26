import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { StationFormPage } from "@/components/domain/user-management/stations/StationFormPage";

/** Admin-only — guard role di sini, pola sama `companies/new/page.tsx`. */
export default async function NewStationPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMINISTRATOR") redirect("/");

  return <StationFormPage mode="create" />;
}
