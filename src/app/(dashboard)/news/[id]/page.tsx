import { NewsDetailSection } from "@/components/domain/news/NewsDetailSection";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="-mx-6 -mt-6 flex flex-col gap-4 bg-[#F5F7FB] px-6 pt-6">
      <NewsDetailSection newsId={id} />
    </div>
  );
}
