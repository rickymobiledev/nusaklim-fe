import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { NewsListSection } from "@/components/domain/news/NewsListSection";

export default function NewsPage() {
  return (
    <div className="-mx-6 -mt-6 flex flex-col gap-4 bg-[#F5F7FB] px-6 pt-6">
      <Breadcrumb />
      <h1 className="font-heading text-2xl font-bold leading-7 text-black">
        Berita Pilihan
      </h1>
      <NewsListSection />
    </div>
  );
}
