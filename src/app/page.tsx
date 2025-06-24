"use client"

import { useEffect, useState } from "react"
import { getAllNovels } from "@/lib/queries"
import { Novel } from "@/types"
import NovelCard from "@/components/NovelCard"
export default function HomePage() {
  const [novels, setNovels] = useState<Novel[]>([])
  const [filteredNovels, setFilteredNovels] = useState<Novel[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllNovels()
      setNovels(data)
      setFilteredNovels(data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const term = searchTerm.toLowerCase()
    const filtered = novels.filter((novel) =>
      novel.title.toLowerCase().includes(term)
    )
    setFilteredNovels(filtered)
  }, [searchTerm, novels])

  return (
    <main className="p-4">
      <div className="max-w-xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search novels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {filteredNovels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredNovels.map((novel) => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-300">
          No results found.
        </p>
      )}
    </main>
  )
}
