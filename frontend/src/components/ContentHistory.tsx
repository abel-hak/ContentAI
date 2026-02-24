import { Clock, Trash2, FileText, Mail, Share2, X, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import type { HistoryItem, ToolType } from '../types'

interface Props {
  history: HistoryItem[]
  onClear: () => void
  onRemove: (id: string) => void
}

const toolIcons: Record<ToolType, React.ReactNode> = {
  'blog-outline': <FileText size={14} />,
  'email-rewrite': <Mail size={14} />,
  'social-post': <Share2 size={14} />,
}

const toolLabels: Record<ToolType, string> = {
  'blog-outline': 'Blog Outline',
  'email-rewrite': 'Email Rewrite',
  'social-post': 'Social Post',
}

const toolColors: Record<ToolType, string> = {
  'blog-outline': 'text-blue-400 bg-blue-500/10',
  'email-rewrite': 'text-emerald-400 bg-emerald-500/10',
  'social-post': 'text-purple-400 bg-purple-500/10',
}

function HistoryCard({ item, onRemove }: { item: HistoryItem; onRemove: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(item.output)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const inputSummary = Object.entries(item.input)
    .map(([k, v]) => `${k}: ${v}`)
    .join(' | ')

  const timeAgo = getTimeAgo(item.timestamp)

  return (
    <div className="glass-hover rounded-lg border border-white/5 transition-all duration-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-3 text-left cursor-pointer"
      >
        <span className={`mt-0.5 p-1.5 rounded-md ${toolColors[item.tool]}`}>
          {toolIcons[item.tool]}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-300">{toolLabels[item.tool]}</span>
            <span className="text-xs text-gray-600">{timeAgo}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{inputSummary}</p>
        </div>
        <div className="flex gap-1">
          <span
            role="button"
            onClick={handleCopy}
            className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-gray-300 transition-colors"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </span>
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove(item.id)
            }}
            className="p-1 rounded hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
          >
            <X size={12} />
          </span>
        </div>
      </button>
      {expanded && (
        <div className="px-3 pb-3 animate-fade-in">
          <div className="p-3 rounded-lg bg-white/5 text-xs text-gray-400 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {item.output}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ContentHistory({ history, onClear, onRemove }: Props) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock size={32} className="mx-auto text-gray-700 mb-3" />
        <p className="text-sm text-gray-600">No history yet</p>
        <p className="text-xs text-gray-700 mt-1">Generated content will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{history.length} items</span>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
        >
          <Trash2 size={12} />
          Clear all
        </button>
      </div>
      <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
        {history.map((item) => (
          <HistoryCard key={item.id} item={item} onRemove={onRemove} />
        ))}
      </div>
    </div>
  )
}

function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
