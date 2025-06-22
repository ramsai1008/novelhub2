import { getAllNovels } from "@/lib/firebase";
import Link from "next/link";

export default async function NovelsPage() {
  const novels = await getAllNovels();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">📚 All Novels</h1>

      <ul className="space-y-4">
        {novels.map((novel) => (
          <li key={novel.id} className="border p-4 rounded shadow-sm">
            <h2 className="text-xl font-semibold">{novel.title}</h2>
            <p className="text-sm text-gray-600">{novel.description}</p>
            <Link
              className="text-blue-600 underline"
              href={`/novels/${novel.id}`}
            >
              Read Now →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
