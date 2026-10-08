import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Tone, Platform } from '../types'
import { generateSocialPost } from '../services/api'
import { getApiErrorMessage } from '../utils/errors'
import ToneSelector from './ToneSelector'
import OutputCard from './OutputCard'
import LoadingSpinner from './LoadingSpinner'

interface Props {
  onGenerated: (input: Record<string, string>, output: string) => void
}

const platforms: { value: Platform; label: string; icon: string }[] = [
  { value: 'twitter', label: 'Twitter / X', icon: '𝕏' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'instagram', label: 'Instagram', icon: '📸' },
  { value: 'facebook', label: 'Facebook', icon: '👤' },
  { value: 'threads', label: 'Threads', icon: '🧵' },
]

export default function SocialPostGenerator({ onGenerated }: Props) {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState<Platform>('twitter')
  const [tone, setTone] = useState<Tone>('casual')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
    }
    setLoading(true)
    setOutput('')
    try {
      const res = await generateSocialPost({ topic: topic.trim(), platform, tone })
      setOutput(res.posts)
      onGenerated({ topic, platform, tone }, res.posts)
      toast.success('Social posts generated!')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to generate posts.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Post Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Launch of our new AI product"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100
              placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-1
              focus:ring-primary-500/30 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {platforms.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPlatform(p.value)}
                className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border cursor-pointer ${
                  platform === p.value
                    ? 'bg-primary-600/30 border-primary-500/50 text-primary-300 shadow-lg shadow-primary-500/10'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-300'
                }`}
              >
                <span className="text-lg">{p.icon}</span>
                <span className="text-xs">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        <ToneSelector value={tone} onChange={setTone} />

        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
            bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold
            hover:from-primary-500 hover:to-primary-400
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300 shadow-lg shadow-primary-500/25
            hover:shadow-primary-500/40 cursor-pointer"
        >
          <Sparkles size={18} />
          {loading ? 'Generating...' : 'Generate Posts'}
        </button>
      </form>

      {loading && <LoadingSpinner message="Creating social media posts..." />}
      <OutputCard content={output} onRegenerate={handleSubmit} isLoading={loading} />
    </div>
  )
}
