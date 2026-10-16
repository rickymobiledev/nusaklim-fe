import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { StationStatusSection } from "@/components/domain/station-status/StationStatusSection";

export default function StasiunAktifPage() {
  return (
    <div className="-mx-6 -mt-6 flex flex-col gap-4 bg-[#F5F7FB] px-6 pt-6">
      <Breadcrumb />
      <StationStatusSection status="on" />
    </div>
  );
}
