'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getFeaturedNovels, getUserBookmarks } from '@/lib/firebase'
import { useAuth } from '@/lib/auth'
import { Novel } from '@/types'

export default function HomePage() {
  const [novels, setNovels] = useState<Novel[]>([])
  const [bookmarked, setBookmarked] = useState<Novel[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      const allNovels = await getFeaturedNovels()
      setNovels(allNovels)
      setLoading(false)

      if (user) {
        const bookmarks = await getUserBookmarks(user.uid)
        setBookmarked(bookmarks)
      }
    }

    fetchData()
  }, [user])

  const filtered = novels.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📚 Featured Novels</h1>

      {/* 🔍 Search Bar */}
      <div className="relative max-w-xl mb-6">
        <svg
          className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
        </svg>
        <input
          type="text"
          placeholder="Search novels..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
      </div>

      {/* 💾 Continue Reading */}
      {user && bookmarked.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Continue Reading</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bookmarked.map(novel => (
              <Link key={novel.id} href={`/novels/${novel.id}`}>
                <div className="rounded-lg shadow p-4 bg-white dark:bg-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <p className="text-sm font-medium">{novel.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 🖼 Featured Novels Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map(novel => (
          <Link key={novel.id} href={`/novels/${novel.id}`}>
            <div className="rounded-lg overflow-hidden shadow bg-white dark:bg-gray-900 hover:shadow-md transition">
              {novel.cover && (
                <img
                  src={novel.cover}
                  alt={novel.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-3">
                <h3 className="font-semibold">{novel.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{novel.description?.slice(0, 60)}...</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ❌ No Results */}
      {!loading && filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No novels found for “{searchTerm}”</p>
      )}
    </div>
  )
}
