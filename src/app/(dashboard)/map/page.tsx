import { MapTitle } from "@/components/domain/map/MapTitle";
import { MapSection } from "@/components/domain/map/MapSection";

export default function MapPage() {
  return (
    <div className="-mx-6 -mt-6 flex flex-col gap-4 bg-[#F5F7FB] px-6 pt-6">
      <MapTitle />
      <MapSection />
    </div>
  );
}
