const features = [
  {
    icon: 'fa-brain',
    color: 'blue',
    title: 'AI & Machine Learning',
    desc: 'ChatGPT, image generation, text-to-speech, and 20+ AI models ready to use.',
  },
  {
    icon: 'fa-download',
    color: 'purple',
    title: 'Media Downloads',
    desc: 'Download from TikTok, Instagram, YouTube, Spotify, and 15+ platforms.',
  },
  {
    icon: 'fa-search',
    color: 'green',
    title: 'Search & Discovery',
    desc: 'Pinterest, GitHub, lyrics, weather, and more — all through simple endpoints.',
  },
  {
    icon: 'fa-bolt',
    color: 'orange',
    title: 'Lightning Fast',
    desc: 'Optimized infrastructure with sub-200ms average response times globally.',
  },
  {
    icon: 'fa-palette',
    color: 'pink',
    title: 'Image Creator',
    desc: 'Generate memes, text images, AI art, and creative visuals on-demand.',
  },
  {
    icon: 'fa-shield-halved',
    color: 'cyan',
    title: 'No Auth Required',
    desc: 'Start using immediately — no API keys, no sign-up, no rate limits.',
  },
] as const

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
  cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
}

export function Features() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Why Developers Love Us
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Everything you need to supercharge your projects, all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bento-card bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50"
            >
              <div className={`feature-icon ${colorMap[f.color]} mb-4`}>
                <i className={`fas ${f.icon} text-xl`} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                {f.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
