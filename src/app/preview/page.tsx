export default function LivePreview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🕌 Al-Quran Digital - Live Preview
            </h1>
            <p className="text-lg text-gray-600">
              AI-Powered Quran Learning App for Malaysia & Indonesia
            </p>
          </div>
        </div>
      </div>

      {/* Main Preview */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Preview Bar */}
          <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm font-mono">
                https://al-quran-z-ai.vercel.app
              </span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => window.open('https://al-quran-z-ai.vercel.app', '_blank')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium transition-colors"
              >
                🌐 Open in New Tab
              </button>
            </div>
          </div>

          {/* iframe Preview */}
          <div className="relative">
            <div className="aspect-[16/10] bg-gray-100">
              <iframe 
                src="https://al-quran-z-ai.vercel.app"
                className="w-full h-full border-0"
                title="Al-Quran Digital Live Preview"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Ustaz Assistant</h3>
            <p className="text-gray-600">24/7 Islamic guidance with JAKIM compliant AI scholar</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Search</h3>
            <p className="text-gray-600">6 types of Quran search with root word analysis</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">SRS Learning</h3>
            <p className="text-gray-600">Scientific memory retention with SM-2 algorithm</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Achievement System</h3>
            <p className="text-gray-600">30+ gamification badges to track progress</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quote Sharing</h3>
            <p className="text-gray-600">AI-generated Islamic quotes with beautiful templates</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Audio Recitation</h3>
            <p className="text-gray-600">6 famous Quran reciters with high-quality audio</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 text-center">
          <div className="inline-flex gap-4">
            <button 
              onClick={() => window.open('https://al-quran-z-ai.vercel.app', '_blank')}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              🚀 Launch Live App
            </button>
            <button 
              onClick={() => window.open('https://github.com/thisisniagahub/al-quran-z-ai', '_blank')}
              className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              📂 View Source Code
            </button>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">🛠 Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl mb-2">⚛️</div>
              <h4 className="font-semibold">Next.js 15</h4>
              <p className="text-sm text-gray-600">App Router</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📘</div>
              <h4 className="font-semibold">TypeScript</h4>
              <p className="text-sm text-gray-600">Type Safety</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🎨</div>
              <h4 className="font-semibold">Tailwind CSS</h4>
              <p className="text-sm text-gray-600">Modern Styling</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🚀</div>
              <h4 className="font-semibold">Vercel</h4>
              <p className="text-sm text-gray-600">Deployment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
