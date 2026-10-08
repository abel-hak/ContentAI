import { useState } from 'react'
import { Columns2, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Tone, Platform } from '../types'
import { compareTones, streamSocialPost } from '../services/api'
import { getApiErrorMessage } from '../utils/errors'
import { pickCompareTones } from '../utils/compareTones'
import ToneSelector from './ToneSelector'
import OutputCard from './OutputCard'
import LoadingSpinner from './LoadingSpinner'
import CompareResults, { type CompareVariant } from './CompareResults'

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
  const [streaming, setStreaming] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [variants, setVariants] = useState<CompareVariant[]>([])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    setLoading(true)
    setOutput('')
    setVariants([])
    setStreaming(!compareMode)

    try {
      if (compareMode) {
        const tones = pickCompareTones(tone)
        const results = await compareTones({
          tool: 'social-post',
          tones,
          topic: topic.trim(),
          platform,
        })
        setVariants(results)
        const combined = results.map((item) => `## ${item.tone}\n\n${item.content}`).join('\n\n---\n\n')
        onGenerated({ topic, platform, tone: tones.join(', '), mode: 'compare' }, combined)
        toast.success('Tone comparison ready!')
      } else {
        const text = await streamSocialPost(
          { topic: topic.trim(), platform, tone },
          (token) => setOutput((prev) => prev + token)
        )
        setOutput(text)
        onGenerated({ topic, platform, tone }, text)
        toast.success('Social posts generated!')
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to generate posts.'))
    } finally {
      setLoading(false)
      setStreaming(false)
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

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <input
            type="checkbox"
            checked={compareMode}
            onChange={(e) => setCompareMode(e.target.checked)}
            className="h-4 w-4 accent-primary-500"
          />
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <Columns2 size={15} className="text-primary-400" />
              Compare 3 tones side by side
            </div>
            <p className="text-xs text-gray-500">
              Create the same campaign angle in 3 tones at once
            </p>
          </div>
        </label>

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
          {loading
            ? compareMode
              ? 'Comparing tones...'
              : 'Streaming...'
            : compareMode
              ? 'Compare Posts'
              : 'Generate Posts'}
        </button>
      </form>

      {loading && !output && variants.length === 0 && (
        <LoadingSpinner
          message={
            compareMode
              ? 'Generating 3 tone variants in parallel...'
              : 'Streaming social media posts...'
          }
        />
      )}

      {variants.length > 0 ? (
        <CompareResults variants={variants} />
      ) : (
        <OutputCard
          content={output}
          variant="social-post"
          onRegenerate={handleSubmit}
          isLoading={loading}
          isStreaming={streaming}
        />
      )}
    </div>
  )
}
