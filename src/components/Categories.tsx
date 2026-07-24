import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

type Category = {
  name: string
  items: { name: string; desc: string; path: string }[]
}

const iconByName: Record<string, string> = {
  'Text To Speech': 'fa-volume-high',
  'Artificial Intelligence': 'fa-brain',
  AI: 'fa-brain',
  Downloader: 'fa-download',
  Download: 'fa-download',
  'Image Creator': 'fa-image',
  Image: 'fa-image',
  Search: 'fa-search',
  'Web Scraper': 'globe',
  Tools: 'fa-screwdriver-wrench',
  Music: 'fa-music',
  Anime: 'fa-film',
  Islamic: 'fa-book-quran',
  Game: 'fa-gamepad',
  'Social Media': 'fa-share-nodes',
  Stalker: 'fa-user-secret',
  'Random Image': 'fa-shuffle',
  Stalk: 'fa-user-secret',
  Religion: 'fa-book-quran',
  News: 'fa-newspaper',
}

const colorByName: Record<string, string> = {
  'Text To Speech': 'from-pink-500 to-rose-500',
  'Artificial Intelligence': 'from-blue-500 to-cyan-500',
  AI: 'from-blue-500 to-cyan-500',
  Downloader: 'from-purple-500 to-pink-500',
  Download: 'from-purple-500 to-pink-500',
  'Image Creator': 'from-pink-500 to-fuchsia-500',
  Image: 'from-pink-500 to-fuchsia-500',
  Search: 'from-green-500 to-emerald-500',
  'Web Scraper': 'from-amber-500 to-orange-500',
  Tools: 'from-cyan-500 to-blue-500',
  Music: 'from-violet-500 to-purple-500',
  Anime: 'from-red-500 to-pink-500',
  Islamic: 'from-emerald-500 to-teal-500',
  Game: 'from-yellow-500 to-orange-500',
  'Social Media': 'from-blue-500 to-indigo-500',
  Stalker: 'from-slate-500 to-gray-500',
  'Random Image': 'from-fuchsia-500 to-purple-500',
  Stalk: 'from-slate-500 to-gray-500',
  Religion: 'from-emerald-500 to-teal-500',
  News: 'from-sky-500 to-blue-500',
}

function pickIcon(name: string) {
  for (const key of Object.keys(iconByName)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return iconByName[key]
  }
  return 'fa-server'
}

function pickColor(name: string) {
  for (const key of Object.keys(colorByName)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return colorByName[key]
  }
  return 'from-blue-500 to-cyan-500'
}

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [totalEndpoints, setTotalEndpoints] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = () => {
      fetch('/endpoints')
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return
          if (Array.isArray(data.endpoints)) {
            setCategories(data.endpoints)
          }
          if (typeof data.totalfitur === 'number') {
            setTotalEndpoints(data.totalfitur)
          }
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
    load()
    const t = setInterval(load, 60_000)
    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [])

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Browse by Category
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            <span className="font-semibold text-gray-900 dark:text-white">
              {categories.length}
            </span>{' '}
            categories,{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalEndpoints ?? '…'}
            </span>{' '}
            endpoints — all free, no key required.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-gray-200/60 dark:bg-gray-800/60 animate-pulse"
              />
            ))}

          {!loading &&
            categories.map((cat) => (
              <Link
                key={cat.name}
                to="/docs"
                state={{ category: cat.name }}
                className="group relative overflow-hidden rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 hover:border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${pickColor(
                    cat.name
                  )} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="relative z-10 flex flex-col gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${pickColor(
                      cat.name
                    )} text-white shadow-sm`}
                  >
                    <i className={`fas ${pickIcon(cat.name)} text-base`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-white transition-colors line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-white/80 transition-colors">
                      {cat.items.length} endpoints
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  )
}
