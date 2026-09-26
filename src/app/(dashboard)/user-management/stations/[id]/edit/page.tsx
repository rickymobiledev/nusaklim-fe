import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { StationFormPage } from "@/components/domain/user-management/stations/StationFormPage";

/** Admin-only — guard role di sini, pola sama `companies/[id]/edit/page.tsx`. */
export default async function EditStationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (user?.role !== "ADMINISTRATOR") redirect("/");

  const { id } = await params;
  return <StationFormPage mode="edit" stationId={decodeURIComponent(id)} />;
}
