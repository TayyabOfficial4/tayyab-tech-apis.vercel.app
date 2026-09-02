import { useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { Features } from '../components/Features'
import { Categories } from '../components/Categories'
import { CodeExample } from '../components/CodeExample'
import { CTA } from '../components/CTA'
import { Footer } from '../components/Footer'

export function LandingPage() {
  // Default to dark theme on first visit
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.documentElement.classList.contains('dark')) {
      try {
        const saved = localStorage.getItem('tayyabtech-theme')
        if (!saved) {
          document.documentElement.classList.add('dark')
        }
      } catch {}
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Features />
        <Categories />
        <CodeExample />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
