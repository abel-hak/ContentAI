import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Tone, BlogLength } from '../types'
import { generateBlogOutline } from '../services/api'
import { getApiErrorMessage } from '../utils/errors'
import ToneSelector from './ToneSelector'
import OutputCard from './OutputCard'
import LoadingSpinner from './LoadingSpinner'

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

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
    }
    setLoading(true)
    setOutput('')
    try {
      const res = await generateBlogOutline({ topic: topic.trim(), tone, length })
      setOutput(res.outline)
      onGenerated({ topic, tone, length }, res.outline)
      toast.success('Blog outline generated!')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to generate outline.'))
    } finally {
      setLoading(false)
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
          {loading ? 'Generating...' : 'Generate Outline'}
        </button>
      </form>

      {loading && <LoadingSpinner message="Crafting your blog outline..." />}
      <OutputCard content={output} onRegenerate={handleSubmit} isLoading={loading} />
    </div>
  )
}
