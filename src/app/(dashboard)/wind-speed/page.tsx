import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { WindSpeedTitle } from "@/components/domain/wind-speed/WindSpeedTitle";
import { WindSpeedSection } from "@/components/domain/wind-speed/WindSpeedSection";

export default function WindSpeedPage() {
  return (
    <div className="-mx-6 -mt-6 flex flex-col gap-4 bg-[#F5F7FB] px-6 pt-6">
      <Breadcrumb />
      <WindSpeedTitle />
      <WindSpeedSection />
    </div>
  );
}
