import { useState } from 'react'
import { Copy, Check, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'

interface OutputCardProps {
  content: string
  onRegenerate?: () => void
  isLoading?: boolean
}

export default function OutputCard({ content, onRegenerate, isLoading }: OutputCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  if (!content) return null

  return (
    <div className="glass rounded-xl p-4 sm:p-6 glow animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider">
          Generated Content
        </h3>
        <div className="flex gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                bg-white/5 border border-white/10 text-gray-400
                hover:bg-white/10 hover:text-gray-300 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <RotateCcw size={13} />
              Regenerate
            </button>
          )}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
              copied
                ? 'bg-green-500/20 border-green-500/30 text-green-400'
                : 'bg-primary-500/10 border-primary-500/20 text-primary-400 hover:bg-primary-500/20'
            } border`}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed
        [&_h1]:text-gray-100 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mb-3
        [&_h2]:text-gray-200 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-2 [&_h2]:mt-4
        [&_h3]:text-gray-200 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-2
        [&_p]:mb-2 [&_ul]:mb-2 [&_ol]:mb-2
        [&_li]:mb-1
        [&_strong]:text-gray-200
        [&_a]:text-primary-400 [&_a]:no-underline hover:[&_a]:underline">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  )
}
