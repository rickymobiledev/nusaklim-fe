import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { RelativeHumidityTitle } from "@/components/domain/relative-humidity/RelativeHumidityTitle";
import { RelativeHumiditySection } from "@/components/domain/relative-humidity/RelativeHumiditySection";

export default function RelativeHumidityPage() {
  return (
    <div className="-mx-6 -mt-6 flex flex-col gap-4 bg-[#F5F7FB] px-6 pt-6">
      <Breadcrumb />
      <RelativeHumidityTitle />
      <RelativeHumiditySection />
    </div>
  );
}
