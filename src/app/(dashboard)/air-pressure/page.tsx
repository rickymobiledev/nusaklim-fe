import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { AirPressureTitle } from "@/components/domain/air-pressure/AirPressureTitle";
import { AirPressureSection } from "@/components/domain/air-pressure/AirPressureSection";

export default function AirPressurePage() {
  return (
    <div className="-mx-6 -mt-6 flex flex-col gap-4 bg-[#F5F7FB] px-6 pt-6">
      <Breadcrumb />
      <AirPressureTitle />
      <AirPressureSection />
    </div>
  );
}
