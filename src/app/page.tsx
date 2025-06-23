import Image from "next/image";
import Link from "next/link";
import Card from "@/components/Card";
import { getFeaturedNovels } from "@/lib/firebase";

export default async function HomePage() {
  const featuredNovels = await getFeaturedNovels();

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Featured Novels</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredNovels.map((novel) => (
          <Card
            key={novel.id}
            title={novel.title}
            description={novel.description || "No description available."}
          >
            <Image
              src={novel.cover || "/placeholder.jpg"}
              alt={novel.title}
              width={400}
              height={250}
              className="rounded-md mb-3 object-cover w-full h-48"
            />
            <Link href={`/novels/${novel.id}`}>
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white py-2 px-4 rounded">
                Read Now
              </button>
            </Link>
          </Card>
        ))}
      </div>
    </main>
  );
}
