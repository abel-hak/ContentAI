import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Tone } from '../types'
import { rewriteEmail } from '../services/api'
import ToneSelector from './ToneSelector'
import OutputCard from './OutputCard'
import LoadingSpinner from './LoadingSpinner'

interface Props {
  onGenerated: (input: Record<string, string>, output: string) => void
}

export default function EmailRewriter({ onGenerated }: Props) {
  const [draftEmail, setDraftEmail] = useState('')
  const [tone, setTone] = useState<Tone>('professional')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!draftEmail.trim() || draftEmail.trim().length < 10) {
      toast.error('Please enter an email draft (at least 10 characters)')
      return
    }
    setLoading(true)
    setOutput('')
    try {
      const res = await rewriteEmail({ draft_email: draftEmail.trim(), tone })
      setOutput(res.rewritten_email)
      onGenerated({ draft_email: draftEmail.substring(0, 60) + '...', tone }, res.rewritten_email)
      toast.success('Email rewritten!')
    } catch {
      toast.error('Failed to rewrite email. Check your API key.')
    } finally {
      setLoading(false)
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
          {loading ? 'Rewriting...' : 'Rewrite Email'}
        </button>
      </form>

      {loading && <LoadingSpinner message="Rewriting your email..." />}
      <OutputCard content={output} onRegenerate={handleSubmit} isLoading={loading} />
    </div>
  )
}
