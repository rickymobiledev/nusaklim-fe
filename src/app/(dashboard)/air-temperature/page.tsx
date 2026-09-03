import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { AirTemperatureTitle } from "@/components/domain/air-temperature/AirTemperatureTitle";
import { AirTemperatureSection } from "@/components/domain/air-temperature/AirTemperatureSection";

export default function AirTemperaturePage() {
  return (
    <div className="-mx-6 -mt-6 flex flex-col gap-4 bg-[#F5F7FB] px-6 pt-6">
      <Breadcrumb />
      <AirTemperatureTitle />
      <AirTemperatureSection />
    </div>
  );
}
