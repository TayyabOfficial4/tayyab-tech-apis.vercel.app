import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
            <i className="fas fa-code text-white text-sm" />
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Tayyab Tech APIs
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Tayyab Tech APIs. Free developer APIs for
          everyone.
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/docs" className="hover:text-blue-500 transition-colors">
            Docs
          </Link>
          <a
            href="https://t.me/TayyabTech"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            Telegram
          </a>
        </div>
      </div>
    </footer>
  )
}
