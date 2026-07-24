import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export function Hero() {
  const [totalEndpoints, setTotalEndpoints] = useState<number | null>(null)
  const [totalCategories, setTotalCategories] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = () => {
      fetch('/endpoints')
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return
          if (typeof data.totalfitur === 'number') setTotalEndpoints(data.totalfitur)
          if (Array.isArray(data.endpoints)) setTotalCategories(data.endpoints.length)
        })
        .catch(() => {})
    }
    load()
    const t = setInterval(load, 60_000)
    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
      {/* Background Glows */}
      <div className="hero-glow bg-blue-500 top-20 -left-40" />
      <div className="hero-glow bg-cyan-400 bottom-20 -right-40" />

      {/* Floating elements */}
      <div className="absolute top-32 left-10 w-16 h-16 rounded-2xl gradient-bg opacity-20 animate-float hidden md:block" />
      <div
        className="absolute bottom-32 right-20 w-12 h-12 rounded-xl bg-blue-400 opacity-20 animate-float hidden md:block"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute top-1/2 right-10 w-8 h-8 rounded-lg bg-cyan-400 opacity-20 animate-float hidden md:block"
        style={{ animationDelay: '4s' }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            v2.0 — Free developer APIs, no key required
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6 text-gray-900 dark:text-white animate-fade-up delay-100">
          Build Faster with<br />
          <span className="gradient-text">Tayyab Tech APIs</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 animate-fade-up delay-200">
          Powerful, reliable APIs for AI, media downloads, search, and more.
          Currently serving{' '}
          <span className="font-bold text-gray-900 dark:text-white">
            {totalEndpoints ?? '—'}
          </span>{' '}
          active endpoints across{' '}
          <span className="font-bold text-gray-900 dark:text-white">
            {totalCategories ?? '—'}
          </span>{' '}
          categories.
        </p>

        <div className="flex flex-wrap justify-center gap-4 animate-fade-up delay-300">
          <Link
            to="/docs"
            className="group px-8 py-3.5 gradient-bg text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <i className="fas fa-rocket" /> Explore APIs
            <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="https://t.me/TayyabTech"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 shadow-sm"
          >
            <i className="fab fa-telegram" /> Contact Dev
          </a>
        </div>

        {/* Quick Stats Row */}
        <div
          id="stats"
          className="flex flex-wrap justify-center gap-8 mt-12 animate-fade-up delay-400"
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalEndpoints ?? '…'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Endpoints</p>
          </div>
          <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 hidden sm:block" />
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">Free</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Forever</p>
          </div>
          <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 hidden sm:block" />
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Uptime</p>
          </div>
          <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 hidden sm:block" />
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">No Key</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Instant Use</p>
          </div>
        </div>
      </div>
    </section>
  )
}
