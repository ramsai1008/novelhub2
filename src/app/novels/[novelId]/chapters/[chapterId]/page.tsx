import { getChapterById } from "@/lib/firestore";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    novelId: string;
    chapterId: string;
  }>;
};

export default async function ChapterPage({ params }: PageProps) {
  const { novelId, chapterId } = await params;

  const chapter = await getChapterById(novelId, chapterId);

  if (!chapter) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6 prose dark:prose-invert">
      <h1 className="text-3xl font-bold mb-4">{chapter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
    </div>
  );
}
