import { getAuthSession } from "@/lib/auth";
import { getLatestBookmarkForUser, getFeaturedNovels } from "@/lib/firebase";
import Link from "next/link";

export default async function Home() {
  const session = await getAuthSession();
  const latestBookmark = session?.user
    ? await getLatestBookmarkForUser(session.user.id)
    : null;

  const featuredNovels = await getFeaturedNovels();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">📖 Welcome to NovelHub</h1>
      <p className="text-gray-700">Read, bookmark, and continue your favorite novels!</p>

      {latestBookmark && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
          <h2 className="text-xl font-semibold">👉 Continue Reading</h2>
          <Link
            href={`/novels/${latestBookmark.novelId}/chapter/${latestBookmark.chapterId}`}
            className="text-blue-600 underline"
          >
            {latestBookmark.novelTitle} — Chapter {latestBookmark.chapterTitle}
          </Link>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">🌟 Featured Novels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredNovels.map((novel) => (
  <div key={novel.id} className="border p-4 rounded shadow hover:shadow-md transition bg-white">
    {novel.cover && (
      <img
        src={novel.cover}
        alt={novel.title}
        className="w-full h-48 object-cover rounded mb-3"
      />
    )}
    <h3 className="text-xl font-semibold">{novel.title}</h3>
    <p className="text-sm text-gray-600 mb-2">{novel.description}</p>
    <Link
      href={`/novels/${novel.id}`}
      className="text-blue-600 underline"
    >
      Read Now →
    </Link>
  </div>
))}

        </div>
      </div>
    </div>
  );
}
