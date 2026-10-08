import ReactMarkdown from 'react-markdown'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import ContentScorePanel from './ContentScorePanel'

export interface CompareVariant {
  tone: string
  content: string
}

interface Props {
  variants: CompareVariant[]
}

function VariantCard({ tone, content }: CompareVariant) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success(`${tone} version copied`)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <div className="glass flex min-h-[280px] flex-col rounded-xl border border-white/10 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="rounded-full bg-primary-500/15 px-3 py-1 text-xs font-semibold capitalize text-primary-300">
          {tone}
        </span>
        <button
          onClick={handleCopy}
          className="flex cursor-pointer items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-gray-400 hover:text-gray-200"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto text-sm leading-7 text-gray-300">
        <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap [&_h1]:text-base [&_h2]:text-sm">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
      <ContentScorePanel content={content} />
    </div>
  )
}

export default function CompareResults({ variants }: Props) {
  if (!variants.length) return null

  return (
    <div className="animate-fade-in space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-400">
        Tone comparison
      </h3>
      <div className="grid gap-4 lg:grid-cols-3">
        {variants.map((variant) => (
          <VariantCard key={variant.tone} {...variant} />
        ))}
      </div>
    </div>
  )
}
