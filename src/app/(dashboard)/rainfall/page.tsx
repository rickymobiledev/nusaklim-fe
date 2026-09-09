import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { RainfallTitle } from "@/components/domain/rainfall/RainfallTitle";
import { RainfallSection } from "@/components/domain/rainfall/RainfallSection";

export default function RainfallPage() {
  return (
    <div className="-mx-6 -mt-6 flex flex-col gap-4 bg-[#F5F7FB] px-6 pt-6">
      <Breadcrumb />
      <RainfallTitle />
      <RainfallSection />
    </div>
  );
}
