import { useState, useEffect } from 'react'
import { Sparkles, History, ChevronRight, Zap, PanelRightClose, PanelRightOpen } from 'lucide-react'
import type { ToolType } from './types'
import { useContentHistory } from './hooks/useContentHistory'
import TabNavigation from './components/TabNavigation'
import BlogOutlineGenerator from './components/BlogOutlineGenerator'
import EmailRewriter from './components/EmailRewriter'
import SocialPostGenerator from './components/SocialPostGenerator'
import ContentHistory from './components/ContentHistory'

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return isDesktop
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ToolType>('blog-outline')
  const isDesktop = useIsDesktop()
  const [showHistory, setShowHistory] = useState(isDesktop)
  const { history, addToHistory, clearHistory, removeFromHistory } = useContentHistory()

  const handleGenerated = (tool: ToolType) => (input: Record<string, string>, output: string) => {
    addToHistory(tool, input, output)
    if (isDesktop) setShowHistory(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">ContentAI</h1>
                <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase -mt-0.5">
                  AI Content Assistant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Zap size={12} className="text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">Groq + Llama 3.3</span>
              </div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                  text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all duration-200 cursor-pointer"
              >
                {isDesktop ? (
                  showHistory ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />
                ) : (
                  <History size={16} />
                )}
                <span className="hidden sm:inline">History</span>
                {history.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 text-xs flex items-center justify-center font-semibold">
                    {history.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Left: Tools Area */}
          <div className="flex-1 min-w-0">
            {/* Tab Navigation */}
            <div className="mb-6 overflow-x-auto">
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* Tool Content */}
            <div className="glass rounded-2xl p-6 sm:p-8 glow">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-100">
                  {activeTab === 'blog-outline' && 'Blog Outline Generator'}
                  {activeTab === 'email-rewrite' && 'Email Rewriter'}
                  {activeTab === 'social-post' && 'Social Post Generator'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {activeTab === 'blog-outline' &&
                    'Generate a structured, SEO-friendly blog outline from any topic.'}
                  {activeTab === 'email-rewrite' &&
                    'Transform your draft email with a new tone and improved clarity.'}
                  {activeTab === 'social-post' &&
                    'Create engaging, platform-optimized social media posts.'}
                </p>
              </div>

              {activeTab === 'blog-outline' && (
                <BlogOutlineGenerator onGenerated={handleGenerated('blog-outline')} />
              )}
              {activeTab === 'email-rewrite' && (
                <EmailRewriter onGenerated={handleGenerated('email-rewrite')} />
              )}
              {activeTab === 'social-post' && (
                <SocialPostGenerator onGenerated={handleGenerated('social-post')} />
              )}
            </div>
          </div>

          {/* Right: History Sidebar (Desktop) */}
          {showHistory && isDesktop && (
            <aside className="w-80 xl:w-96 shrink-0 animate-fade-in">
              <div className="glass rounded-2xl p-5 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <History size={16} className="text-primary-400" />
                  <h3 className="text-sm font-semibold text-gray-200">Content History</h3>
                </div>
                <ContentHistory history={history} onClear={clearHistory} onRemove={removeFromHistory} />
              </div>
            </aside>
          )}
        </div>
      </main>

      {/* Mobile History Panel */}
      {showHistory && !isDesktop && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[min(320px,85vw)] glass border-l border-white/10 p-5 overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History size={16} className="text-primary-400" />
                <h3 className="text-sm font-semibold text-gray-200">Content History</h3>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 rounded hover:bg-white/10 text-gray-400 cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <ContentHistory history={history} onClear={clearHistory} onRemove={removeFromHistory} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 mt-auto">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-600">
            Built with FastAPI + React + Groq &mdash; ContentAI &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}
