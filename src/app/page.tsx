'use client'

import { useEffect, useState } from 'react'
import { Novel } from '@/types'
import { getAllNovels } from '@/lib/firebase'
import NovelCard from '@/components/NovelCard'

export default function HomePage() {
  const [novels, setNovels] = useState<Novel[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNovels = async () => {
      const data = await getAllNovels()
      setNovels(data)
      setLoading(false)
    }

    fetchNovels()
  }, [])

  const filteredNovels = novels.filter((novel) =>
    novel.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">All Novels</h1>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search novels..."
        className="w-full p-2 mb-6 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      ) : filteredNovels.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
          No results found for "<strong>{searchQuery}</strong>"
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredNovels.map((novel) => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      )}
    </div>
  )
}
