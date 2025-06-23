import Link from 'next/link'
import { Novel } from '@/types'

export default function NovelCard({ novel }: { novel: Novel }) {
  return (
    <Link href={`/novels/${novel.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
        {novel.cover && (
          <img
            src={novel.cover}
            alt={novel.title}
            className="h-48 w-full object-cover"
          />
        )}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-1 dark:text-white">
            {novel.title}
          </h2>
          <p className="text-gray-600 text-sm line-clamp-3 dark:text-gray-400">
            {novel.description}
          </p>

          {/* Optional: Tags or Star Ratings */}
          <div className="mt-2 flex gap-2 flex-wrap">
            {novel.tags?.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
