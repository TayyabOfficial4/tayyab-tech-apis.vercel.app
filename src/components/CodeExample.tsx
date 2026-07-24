export function CodeExample() {
  return (
    <section className="py-20 px-6 bg-white/50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Simple to Integrate
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Just make a GET request. That's it. No SDKs, no tokens, no complex setup.
            </p>
            <ul className="space-y-3">
              {[
                'RESTful JSON responses',
                'Works with any language or framework',
                'Test directly in your browser',
                'Comprehensive error handling',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-check text-green-600 dark:text-green-400 text-xs" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-xs text-gray-400 font-mono">example.js</span>
            </div>
            <pre className="text-sm font-mono text-gray-300 overflow-x-auto leading-relaxed">
              <code>
                <span className="text-blue-400">const</span> response ={' '}
                <span className="text-blue-400">await</span>{' '}
                <span className="text-cyan-400">fetch</span>(
                {'\n  '}
                <span className="text-green-400">
                  '{`{window.location.origin}`}/api/ai/chatgpt?q=hello'
                </span>
                {'\n'});
                {'\n\n'}
                <span className="text-blue-400">const</span> data ={' '}
                <span className="text-blue-400">await</span> response.
                <span className="text-cyan-400">json</span>();
                {'\n'}console.<span className="text-cyan-400">log</span>(data.result);
                {'\n'}
                <span className="text-gray-500">
                  // "Hello! How can I help you today?"
                </span>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
