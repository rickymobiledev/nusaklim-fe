import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { WindDirectionTitle } from "@/components/domain/wind-direction/WindDirectionTitle";
import { WindDirectionSection } from "@/components/domain/wind-direction/WindDirectionSection";

export default function WindDirectionPage() {
  return (
    <div className="-mx-6 -mt-6 flex flex-col gap-4 bg-[#F5F7FB] px-6 pt-6">
      <Breadcrumb />
      <WindDirectionTitle />
      <WindDirectionSection />
    </div>
  );
}
