import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SolarRadiationTitle } from "@/components/domain/solar-radiation/SolarRadiationTitle";
import { SolarRadiationSection } from "@/components/domain/solar-radiation/SolarRadiationSection";

export default function SolarRadiationPage() {
  return (
    <div className="-mx-6 -mt-6 flex flex-col gap-4 bg-[#F5F7FB] px-6 pt-6">
      <Breadcrumb />
      <SolarRadiationTitle />
      <SolarRadiationSection />
    </div>
  );
}
