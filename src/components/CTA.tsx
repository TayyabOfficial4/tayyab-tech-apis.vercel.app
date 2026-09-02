import { Link } from 'react-router-dom'

export function CTA() {
  return (
    <section aria-labelledby="cta-heading" className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="gradient-bg rounded-3xl p-12 relative overflow-hidden shadow-2xl shadow-blue-500/20">
          <div
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Building?
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Jump into our documentation and start integrating powerful APIs into your
              project in minutes.
            </p>
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              <i className="fas fa-book-open" aria-hidden="true" /> View Documentation
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
