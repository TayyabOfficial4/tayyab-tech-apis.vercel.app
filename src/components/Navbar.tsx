import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../lib/useTheme'

export function Navbar() {
  const [theme, toggle] = useTheme()
  const location = useLocation()
  const isDocs = location.pathname === '/docs'

  return (
    <nav aria-label="Main navigation" className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3" aria-label="Tayyab Tech APIs — Home">
          <div
            className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center shadow-sm"
            aria-hidden="true"
          >
            <i className="fas fa-code text-white text-sm" aria-hidden="true" />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            Tayyab Tech APIs
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot" aria-hidden="true" />
            Online
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={theme === 'dark'}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <i className="fas fa-moon text-gray-600 dark:hidden" aria-hidden="true" />
            <i className="fas fa-sun text-yellow-400 hidden dark:block" aria-hidden="true" />
          </button>
          <a
            href="#stats"
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <i className="fas fa-chart-line text-blue-500" aria-hidden="true" /> Stats
          </a>
          {isDocs ? (
            <Link
              to="/"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
            >
              <i className="fas fa-home text-xs" aria-hidden="true" /> Home
            </Link>
          ) : (
            <Link
              to="/docs"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white gradient-bg rounded-lg hover:opacity-90 transition-opacity"
            >
              <i className="fas fa-book" aria-hidden="true" /> Docs
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
