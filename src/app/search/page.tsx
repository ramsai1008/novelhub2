"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getFeaturedNovels } from "../../lib/firebase";
import { Novel } from "../../types";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      const allNovels = await getFeaturedNovels();
      // Only match if at least one word in the query matches a word in the title
      const words = query.toLowerCase().split(/\s+/).filter(Boolean);
      const filtered = allNovels.filter((novel: Novel) => {
        const titleWords = novel.title.toLowerCase().split(/\s+/);
        return words.some(word => titleWords.includes(word));
      });
      setResults(filtered);
      setLoading(false);
    }
    if (query.trim().length > 0) fetchResults();
    else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
      {loading ? (
        <div>Loading...</div>
      ) : results.length === 0 ? (
        <div className="text-gray-500 text-center text-lg">No results found for "{query}"</div>
      ) : (
        <ul className="space-y-4">
          {results.map(novel => (
            <li key={novel.id} className="bg-white dark:bg-gray-800 rounded shadow p-4">
              <Link href={`/novels/${novel.id}`} className="text-lg font-semibold text-blue-700 dark:text-blue-400 hover:underline">{novel.title}</Link>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{novel.description?.slice(0, 120)}...</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
