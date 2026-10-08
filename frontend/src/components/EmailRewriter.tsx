import { useState } from 'react'
import { Columns2, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Tone } from '../types'
import { compareTones, streamEmailRewrite } from '../services/api'
import { getApiErrorMessage } from '../utils/errors'
import { pickCompareTones } from '../utils/compareTones'
import ToneSelector from './ToneSelector'
import OutputCard from './OutputCard'
import LoadingSpinner from './LoadingSpinner'
import CompareResults, { type CompareVariant } from './CompareResults'

interface Props {
  onGenerated: (input: Record<string, string>, output: string) => void
}

export default function EmailRewriter({ onGenerated }: Props) {
  const [draftEmail, setDraftEmail] = useState('')
  const [tone, setTone] = useState<Tone>('professional')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [variants, setVariants] = useState<CompareVariant[]>([])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!draftEmail.trim() || draftEmail.trim().length < 10) {
      toast.error('Please enter an email draft (at least 10 characters)')
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
          tool: 'email-rewrite',
          tones,
          draft_email: draftEmail.trim(),
        })
        setVariants(results)
        const combined = results.map((item) => `## ${item.tone}\n\n${item.content}`).join('\n\n---\n\n')
        onGenerated(
          { draft_email: draftEmail.substring(0, 60) + '...', tone: tones.join(', '), mode: 'compare' },
          combined
        )
        toast.success('Tone comparison ready!')
      } else {
        const text = await streamEmailRewrite(
          { draft_email: draftEmail.trim(), tone },
          (token) => setOutput((prev) => prev + token)
        )
        setOutput(text)
        onGenerated({ draft_email: draftEmail.substring(0, 60) + '...', tone }, text)
        toast.success('Email rewritten!')
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to rewrite email.'))
    } finally {
      setLoading(false)
      setStreaming(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Draft Email</label>
          <textarea
            value={draftEmail}
            onChange={(e) => setDraftEmail(e.target.value)}
            placeholder="Paste your draft email here..."
            rows={8}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100
              placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-1
              focus:ring-primary-500/30 transition-all duration-200 resize-y min-h-[120px]"
          />
          <p className="text-xs text-gray-500 mt-1">{draftEmail.length} / 5000 characters</p>
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
              Rewrite the same email in 3 tones at once
            </p>
          </div>
        </label>

        <button
          type="submit"
          disabled={loading || draftEmail.trim().length < 10}
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
              ? 'Compare Rewrites'
              : 'Rewrite Email'}
        </button>
      </form>

      {loading && !output && variants.length === 0 && (
        <LoadingSpinner
          message={
            compareMode
              ? 'Rewriting in 3 tones in parallel...'
              : 'Streaming your rewritten email...'
          }
        />
      )}

      {variants.length > 0 ? (
        <CompareResults variants={variants} />
      ) : (
        <OutputCard
          content={output}
          variant="email-rewrite"
          onRegenerate={handleSubmit}
          isLoading={loading}
          isStreaming={streaming}
        />
      )}
    </div>
  )
}
