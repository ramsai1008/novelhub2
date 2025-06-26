import Link from "next/link";
import { getChapters } from "@/lib/firebase";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    novelId: string;
  }>;
};

export default async function ChaptersPage({ params }: PageProps) {
  const { novelId } = await params;

  const chapters = await getChapters(novelId);

  if (!chapters) return notFound();

  return (
    <div className="max-w-2xl w-full mx-auto p-3 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Chapters</h1>
      <ul className="space-y-2">
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <Link
              href={`/novels/${novelId}/chapters/${chapter.id}`}
              className="text-blue-600 hover:underline text-sm sm:text-base"
            >
              {chapter.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

