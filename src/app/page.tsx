import Link from "next/link";
import { getFeaturedNovels } from "@/lib/firebase";

export default async function HomePage() {
  const featuredNovels = await getFeaturedNovels();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Featured Novels</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {featuredNovels.map((novel) => (
          <div
            key={novel.id}
            className="border p-4 rounded shadow hover:shadow-md transition bg-white"
          >
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
    </main>
  );
}
