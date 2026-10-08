import { useState } from 'react'
import { Columns2, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Tone, BlogLength } from '../types'
import { compareTones, streamBlogOutline } from '../services/api'
import { getApiErrorMessage } from '../utils/errors'
import { pickCompareTones } from '../utils/compareTones'
import ToneSelector from './ToneSelector'
import OutputCard from './OutputCard'
import LoadingSpinner from './LoadingSpinner'
import CompareResults, { type CompareVariant } from './CompareResults'

interface Props {
  onGenerated: (input: Record<string, string>, output: string) => void
}

const lengths: { value: BlogLength; label: string; desc: string }[] = [
  { value: 'short', label: 'Short', desc: '3-5 sections' },
  { value: 'medium', label: 'Medium', desc: '5-7 sections' },
  { value: 'long', label: 'Long', desc: '8-10 sections' },
]

export default function BlogOutlineGenerator({ onGenerated }: Props) {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState<Tone>('professional')
  const [length, setLength] = useState<BlogLength>('medium')
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
          tool: 'blog-outline',
          tones,
          topic: topic.trim(),
          length,
        })
        setVariants(results)
        const combined = results.map((item) => `## ${item.tone}\n\n${item.content}`).join('\n\n---\n\n')
        onGenerated({ topic, tone: tones.join(', '), length, mode: 'compare' }, combined)
        toast.success('Tone comparison ready!')
      } else {
        const text = await streamBlogOutline(
          { topic: topic.trim(), tone, length },
          (token) => setOutput((prev) => prev + token)
        )
        setOutput(text)
        onGenerated({ topic, tone, length }, text)
        toast.success('Blog outline generated!')
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to generate outline.'))
    } finally {
      setLoading(false)
      setStreaming(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Blog Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. The Future of AI in Healthcare"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100
              placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-1
              focus:ring-primary-500/30 transition-all duration-200"
          />
        </div>

        <ToneSelector value={tone} onChange={setTone} />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Outline Length</label>
          <div className="grid grid-cols-3 gap-2">
            {lengths.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setLength(l.value)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border cursor-pointer ${
                  length === l.value
                    ? 'bg-primary-600/30 border-primary-500/50 text-primary-300 shadow-lg shadow-primary-500/10'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-300'
                }`}
              >
                <div>{l.label}</div>
                <div className="text-xs opacity-70 mt-0.5">{l.desc}</div>
              </button>
            ))}
          </div>
        </div>

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
              Generates your selected tone plus 2 contrasts in parallel
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
              ? 'Compare Outlines'
              : 'Generate Outline'}
        </button>
      </form>

      {loading && !output && variants.length === 0 && (
        <LoadingSpinner
          message={
            compareMode
              ? 'Generating 3 tone variants in parallel...'
              : 'Streaming your blog outline...'
          }
        />
      )}

      {variants.length > 0 ? (
        <CompareResults variants={variants} />
      ) : (
        <OutputCard
          content={output}
          variant="blog-outline"
          onRegenerate={handleSubmit}
          isLoading={loading}
          isStreaming={streaming}
        />
      )}
    </div>
  )
}
