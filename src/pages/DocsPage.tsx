import { useEffect, useMemo, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../lib/useTheme'
import type { Category, EndpointItem, RawCategory } from '../types'

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : ''
const BRAND = 'Tayyab Tech'

// Sanitize any upstream identifiers from response payloads
const UPSTREAM_HOST_RE = /https?:\/\/(?:[a-z0-9-]+\.)?prexzyapis\.com/gi
const UPSTREAM_NAME_RE = /Prexzy APIs/g
const UPSTREAM_TAG_RE = /prexzyapis/g
const UPSTREAM_USER_RE = /prexzy/g

function sanitizeResponse<T>(data: T): T {
  let s = JSON.stringify(data)
  s = s.replace(UPSTREAM_HOST_RE, `${BASE_URL}/api`)
  s = s.replace(UPSTREAM_NAME_RE, 'Tayyab Tech')
  s = s.replace(UPSTREAM_TAG_RE, 'tayyabtech')
  s = s.replace(UPSTREAM_USER_RE, 'tayyab')
  try {
    return JSON.parse(s) as T
  } catch {
    return data
  }
}

const iconByCategory: Record<string, string> = {
  'Text To Speech': 'fa-volume-high',
  'Artificial Intelligence': 'fa-brain',
  AI: 'fa-brain',
  Downloader: 'fa-download',
  Download: 'fa-download',
  'Image Creator': 'fa-image',
  Image: 'fa-image',
  Search: 'fa-search',
  'Web Scraper': 'fa-globe',
  Tools: 'fa-screwdriver-wrench',
  Music: 'fa-music',
  Anime: 'fa-film',
  Islamic: 'fa-book-quran',
  Game: 'fa-gamepad',
  'Social Media': 'fa-share-nodes',
  Stalker: 'fa-user-secret',
  Stalk: 'fa-user-secret',
  'Random Image': 'fa-shuffle',
  Religion: 'fa-book-quran',
  News: 'fa-newspaper',
}

const colorByCategory: Record<string, string> = {
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
  Stalk: 'from-slate-500 to-gray-500',
  'Random Image': 'from-fuchsia-500 to-purple-500',
  Religion: 'from-emerald-500 to-teal-500',
  News: 'from-sky-500 to-blue-500',
}

function pickIcon(name: string) {
  for (const key of Object.keys(iconByCategory)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return iconByCategory[key]
  }
  return 'fa-server'
}

function pickColor(name: string) {
  for (const key of Object.keys(colorByCategory)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return colorByCategory[key]
  }
  return 'from-blue-500 to-cyan-500'
}

function parseEndpoints(raw: RawCategory[]): Category[] {
  return raw.map((cat) => ({
    name: cat.name,
    items: cat.items.map((itemObj) => {
      const key = Object.keys(itemObj)[0]
      const val = (itemObj as any)[key]
      return { name: key, desc: val.desc, path: val.path }
    }),
  }))
}

function parsePathParams(path: string): {
  basePath: string
  params: { name: string; required: boolean }[]
} {
  const qIndex = path.indexOf('?')
  if (qIndex === -1) return { basePath: path, params: [] }
  const basePath = path.substring(0, qIndex)
  const queryStr = path.substring(qIndex + 1)
  const parts = queryStr.split('&').filter(Boolean)
  const params = parts.map((p) => {
    const isOptional = p.endsWith('?=') || p.endsWith('?')
    const name = p.replace(/\??=?$/, '').replace(/\?$/, '')
    return { name, required: !isOptional }
  })
  return { basePath, params }
}

// ───────────────────────────── API Tester Modal ─────────────────────────────
function ApiTestModal({
  endpoint,
  onClose,
}: {
  endpoint: EndpointItem
  onClose: () => void
}) {
  const { basePath, params } = parsePathParams(endpoint.path)
  const [paramValues, setParamValues] = useState<Record<string, string>>({})
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [method, setMethod] = useState<'GET' | 'POST'>('GET')
  const [bodyText, setBodyText] = useState('{\n  \n}')
  const [responseType, setResponseType] = useState<'json' | 'text' | 'image' | 'audio' | 'video' | 'other'>('json')
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const blobUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
    }
  }, [])

  const fullUrl = useMemo(() => {
    let url = BASE_URL + '/api' + basePath
    const queryParts: string[] = []
    params.forEach((p) => {
      const val = paramValues[p.name]
      if (val) queryParts.push(`${p.name}=${encodeURIComponent(val)}`)
    })
    if (queryParts.length > 0) url += '?' + queryParts.join('&')
    return url
  }, [basePath, params, paramValues])

  const handleTest = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)
    setBlobUrl(null)
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    setResponseTime(null)
    const start = Date.now()

    try {
      const fetchOpts: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
      }
      if (method === 'POST' && bodyText.trim()) {
        fetchOpts.body = bodyText
      }
      const res = await fetch(fullUrl, fetchOpts)
      const elapsed = Date.now() - start
      setResponseTime(elapsed)

      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        setResponseType('json')
        const data = await res.json()
        const clean = sanitizeResponse(data)
        setResponse(JSON.stringify(clean, null, 2))
      } else if (contentType.startsWith('image/')) {
        setResponseType('image')
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        blobUrlRef.current = url
        setBlobUrl(url)
        setResponse(`[Binary image (${contentType}) — preview below]`)
      } else if (contentType.startsWith('audio/')) {
        setResponseType('audio')
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        blobUrlRef.current = url
        setBlobUrl(url)
        setResponse(`[Binary audio (${contentType}) — player below]`)
      } else if (contentType.startsWith('video/')) {
        setResponseType('video')
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        blobUrlRef.current = url
        setBlobUrl(url)
        setResponse(`[Binary video (${contentType}) — player below]`)
      } else {
        setResponseType('text')
        const text = await res.text()
        setResponse(text || '(empty response)')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch')
      setResponseTime(Date.now() - start)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold truncate text-gray-900 dark:text-white">
              {endpoint.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {endpoint.desc}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
          >
            <i className="fas fa-times text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Method + URL */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
              Request
            </label>
            <div className="flex items-stretch gap-2">
              <div className="method-toggle flex-shrink-0">
                <button
                  type="button"
                  className={method === 'GET' ? 'active' : ''}
                  onClick={() => setMethod('GET')}
                >
                  GET
                </button>
                <button
                  type="button"
                  className={method === 'POST' ? 'active' : ''}
                  onClick={() => setMethod('POST')}
                >
                  POST
                </button>
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 font-mono text-xs overflow-x-auto">
                <span className="text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {fullUrl}
                </span>
              </div>
            </div>
          </div>

          {/* Parameters */}
          {params.length > 0 && (
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                Parameters
              </label>
              <div className="space-y-2">
                {params.map((p) => (
                  <div
                    key={p.name}
                    className="flex flex-col sm:flex-row sm:items-center gap-2"
                  >
                    <div className="flex items-center gap-2 sm:w-40 flex-shrink-0">
                      <span className="font-mono text-xs text-gray-900 dark:text-white">
                        {p.name}
                      </span>
                      {p.required ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-medium">
                          required
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-500 font-medium">
                          optional
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder={`Enter ${p.name}...`}
                      value={paramValues[p.name] || ''}
                      onChange={(e) =>
                        setParamValues((prev) => ({ ...prev, [p.name]: e.target.value }))
                      }
                      className="flex-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-transparent text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Body for POST */}
          {method === 'POST' && (
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                Request Body (JSON)
              </label>
              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-transparent text-xs font-mono text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Send button */}
          <button
            onClick={handleTest}
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg gradient-bg text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {loading ? (
              <>
                <span className="loader-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                Sending...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane" /> Send Request
              </>
            )}
          </button>

          {/* Response */}
          {(response || error) && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Response
                </label>
                <div className="flex items-center gap-2">
                  {responseTime !== null && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {responseTime}ms
                    </span>
                  )}
                  {error ? (
                    <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                      Error
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      200 OK
                    </span>
                  )}
                  {response && (
                    <button
                      onClick={handleCopy}
                      className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                    >
                      {copied ? (
                        <i className="fas fa-check text-green-500" />
                      ) : (
                        <i className="fas fa-copy" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              {responseType === 'image' && blobUrl && (
                <div className="mb-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <img
                    src={blobUrl}
                    alt="Response"
                    className="max-w-full max-h-80 mx-auto"
                  />
                </div>
              )}
              {responseType === 'audio' && blobUrl && (
                <div className="mb-2">
                  <audio controls src={blobUrl} className="w-full" />
                </div>
              )}
              {responseType === 'video' && blobUrl && (
                <div className="mb-2">
                  <video controls src={blobUrl} className="w-full max-h-80 rounded-lg" />
                </div>
              )}
              {response && (
                <pre className="p-3 rounded-lg bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto max-h-72 overflow-y-auto">
                  {error ? (
                    <span className="text-red-400">{error}</span>
                  ) : (
                    <code className="whitespace-pre-wrap break-words">{response}</code>
                  )}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────── Main Page ────────────────────────────────
export function DocsPage() {
  const [theme, toggleTheme] = useTheme()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointItem | null>(null)
  const [totalEndpoints, setTotalEndpoints] = useState<number | null>(null)

  // Initial load + auto-refresh every 60s so endpoint count and listings
  // stay in sync with whatever the upstream currently serves.
  useEffect(() => {
    let cancelled = false
    const load = () => {
      fetch(BASE_URL + '/endpoints')
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return
          const parsed = parseEndpoints(data.endpoints || [])
          setCategories(parsed)
          if (typeof data.totalfitur === 'number') {
            setTotalEndpoints(data.totalfitur)
          } else {
            setTotalEndpoints(parsed.reduce((acc, c) => acc + c.items.length, 0))
          }
          setLoading(false)
        })
        .catch((err) => {
          if (cancelled) return
          setError(err.message)
          setLoading(false)
        })
    }
    load()
    const t = setInterval(load, 60_000)
    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [])

  // Global Ctrl/Cmd + K to focus search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        const el = document.getElementById('api-search') as HTMLInputElement | null
        el?.focus()
      }
      if (e.key === 'Escape') {
        setSelectedEndpoint(null)
        setSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const q = searchQuery.toLowerCase()
    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.desc.toLowerCase().includes(q) ||
            item.path.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0)
  }, [categories, searchQuery])

  // If a category scroll is requested, scroll into view
  useEffect(() => {
    if (!activeCategory) return
    const el = document.getElementById(`cat-${activeCategory.replace(/\s+/g, '-')}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveCategory(null)
    }
  }, [activeCategory])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a] text-gray-900 dark:text-white flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="loader-spinner" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading API docs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a] text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-circle-exclamation text-5xl text-red-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">Failed to load API data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg gradient-bg text-white text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-40 bg-white/80 dark:bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 md:px-6 h-16">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="fas fa-bars text-gray-600 dark:text-gray-400" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <i className="fas fa-code text-white text-sm" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {BRAND} APIs
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                Docs
              </span>
            </Link>
          </div>

          {/* Desktop search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                id="api-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-all"
                placeholder="Search APIs... (Ctrl+K)"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              <i className="fas fa-moon text-gray-600 dark:hidden" />
              <i className="fas fa-sun text-yellow-400 hidden dark:block" />
            </button>
            <a
              href="https://t.me/TayyabTech"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Telegram"
            >
              <i className="fab fa-telegram text-gray-600 dark:text-gray-400" />
            </a>
            <Link
              to="/"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium gradient-bg text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <i className="fas fa-home text-xs" /> Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar Overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-[#0f0f23] border-r border-gray-200 dark:border-gray-800 overflow-y-auto scrollbar-thin transform transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4">
            {/* Mobile search */}
            <div className="lg:hidden mb-4">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  placeholder="Search APIs..."
                />
              </div>
            </div>

            {/* Stats */}
            <div className="mb-6 p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-700 dark:text-green-400">
                  All Systems Operational
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-bold text-gray-900 dark:text-white">
                  {totalEndpoints ?? categories.reduce((a, c) => a + c.items.length, 0)}
                </span>{' '}
                endpoints available
              </p>
            </div>

            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">
              Categories
            </p>
            <nav className="space-y-1">
              {filteredCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    setActiveCategory(cat.name)
                    setSidebarOpen(false)
                  }}
                  className="w-full flex items-center gap-2.5 px-2 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <span
                    className={`w-7 h-7 rounded-md bg-gradient-to-br ${pickColor(
                      cat.name
                    )} flex items-center justify-center text-white flex-shrink-0`}
                  >
                    <i className={`fas ${pickIcon(cat.name)} text-xs`} />
                  </span>
                  <span className="flex-1 truncate font-medium">{cat.name}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-600">
                    {cat.items.length}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="p-6 md:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 p-6 md:p-8 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                    {BRAND} APIs Documentation
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Browse, test, and integrate powerful APIs into your projects.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online
                  </span>
                  <span className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg">
                    REST API
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50 flex flex-wrap items-center gap-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono flex items-center gap-2">
                  Base URL:
                  <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-blue-600 dark:text-blue-400">
                    {BASE_URL}/api
                  </code>
                </p>
                <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                  <i className="fas fa-bolt text-amber-500" /> Every endpoint supports{' '}
                  <code className="px-1 bg-gray-100 dark:bg-gray-700 rounded">GET</code> &{' '}
                  <code className="px-1 bg-gray-100 dark:bg-gray-700 rounded">POST</code> · no
                  key required
                </span>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-10">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.name}
                  id={`cat-${cat.name.replace(/\s+/g, '-')}`}
                  className="scroll-mt-24"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${pickColor(
                        cat.name
                      )} flex items-center justify-center text-white shadow-sm`}
                    >
                      <i className={`fas ${pickIcon(cat.name)}`} />
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {cat.name}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {cat.items.length} endpoints
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {cat.items.map((item, idx) => {
                      const { basePath } = parsePathParams(item.path)
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedEndpoint(item)}
                          className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {item.name}
                            </h3>
                            <span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                              GET
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                            {item.desc}
                          </p>
                          <div className="flex items-center justify-between">
                            <code className="text-[11px] text-gray-400 dark:text-gray-500 font-mono truncate max-w-[70%]">
                              /api{basePath}
                            </code>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedEndpoint(item)
                                }}
                                className="p-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                title="Test endpoint"
                              >
                                <i className="fas fa-play text-[10px]" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigator.clipboard.writeText(BASE_URL + '/api' + basePath)
                                }}
                                className="p-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                title="Copy URL"
                              >
                                <i className="fas fa-copy text-[10px]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

              {filteredCategories.length === 0 && (
                <div className="text-center py-20">
                  <i className="fas fa-search text-5xl text-gray-300 dark:text-gray-700 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No endpoints found for "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="p-6 md:p-8 border-t border-gray-200 dark:border-gray-800 mt-12">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} {BRAND} APIs. Made with{' '}
                <i className="fas fa-heart text-red-500" /> by {BRAND}.
              </span>
              <Link
                to="/"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Back to Home
              </Link>
            </div>
          </footer>
        </main>
      </div>

      {selectedEndpoint && (
        <ApiTestModal
          endpoint={selectedEndpoint}
          onClose={() => setSelectedEndpoint(null)}
        />
      )}
    </div>
  )
}
