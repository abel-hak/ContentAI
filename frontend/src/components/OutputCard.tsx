import { useState } from 'react'
import {
  Copy,
  Check,
  RotateCcw,
  FileText,
  Mail,
  Share2,
  Download,
  FileDown,
} from 'lucide-react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import type { ToolType } from '../types'
import { downloadMarkdown, exportPdf } from '../utils/export'
import ContentScorePanel from './ContentScorePanel'

interface OutputCardProps {
  content: string
  variant?: ToolType
  onRegenerate?: () => void
  isLoading?: boolean
  isStreaming?: boolean
}

function splitSocialPosts(content: string): string[] {
  const chunks = content
    .split(/(?=^\s*(?:\*{0,2})Post\s*\d+(?:\*{0,2})[:.\s-])/im)
    .map((chunk) => chunk.trim())
    .filter(Boolean)

  if (chunks.length > 1) return chunks

  const byDivider = content
    .split(/\n\s*(?:---+|===+|\*{3,})\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)

  return byDivider.length > 1 ? byDivider : [content.trim()]
}

function CopyButton({ text, compact = false }: { text: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border ${
        compact ? 'px-2.5 py-1' : 'px-3 py-1.5'
      } ${
        copied
          ? 'bg-green-500/20 border-green-500/30 text-green-400'
          : 'bg-primary-500/10 border-primary-500/20 text-primary-400 hover:bg-primary-500/20'
      }`}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function ContentBody({ content, variant }: { content: string; variant?: ToolType }) {
  if (variant === 'email-rewrite') {
    return (
      <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-emerald-400/80">
          <span className="h-px w-6 bg-emerald-400/40" />
          Rewritten email
          <span className="h-px flex-1 bg-emerald-400/20" />
        </div>
        <div className="whitespace-pre-wrap font-sans text-[15px] leading-8 text-gray-200">
          {content}
        </div>
      </div>
    )
  }

  if (variant === 'social-post') {
    const posts = splitSocialPosts(content)

    return (
      <div className="space-y-4">
        {posts.map((post, index) => (
          <div
            key={index}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 transition-colors hover:border-primary-500/25"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20 text-[11px]">
                  {index + 1}
                </span>
                Post idea
              </span>
              <CopyButton text={post} compact />
            </div>
            <div className="whitespace-pre-wrap text-[14px] leading-7 text-gray-200">
              {post.replace(/^\s*(?:\*{0,2})Post\s*\d+(?:\*{0,2})[:.\s-]*/i, '').trim() || post}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div
        className="output-prose max-w-none text-[14.5px] leading-7 text-gray-300
          [&_h1]:mb-4 [&_h1]:border-b [&_h1]:border-primary-500/20 [&_h1]:pb-3
          [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-white
          [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:flex [&_h2]:items-center [&_h2]:gap-2
          [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-primary-200
          [&_h2]:before:h-4 [&_h2]:before:w-1 [&_h2]:before:rounded-full [&_h2]:before:bg-primary-500 [&_h2]:before:content-['']
          [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-cyan-300/90
          [&_p]:mb-3 [&_p]:text-gray-300
          [&_ul]:my-3 [&_ul]:space-y-2 [&_ul]:pl-1
          [&_ol]:my-3 [&_ol]:space-y-2 [&_ol]:pl-1
          [&_li]:relative [&_li]:pl-4 [&_li]:text-gray-300
          [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.7em]
          [&_li]:before:h-1.5 [&_li]:before:w-1.5 [&_li]:before:rounded-full
          [&_li]:before:bg-primary-400/70 [&_li]:before:content-['']
          [&_strong]:font-semibold [&_strong]:text-white
          [&_em]:text-gray-400
          [&_hr]:my-5 [&_hr]:border-white/10
          [&_blockquote]:my-4 [&_blockquote]:rounded-r-lg [&_blockquote]:border-l-2
          [&_blockquote]:border-accent-500/50 [&_blockquote]:bg-accent-500/5
          [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:text-gray-300
          [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5
          [&_code]:text-[13px] [&_code]:text-cyan-300"
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  )
}

const variantMeta: Record<
  ToolType,
  { label: string; icon: React.ReactNode; accent: string; fileBase: string }
> = {
  'blog-outline': {
    label: 'Blog outline',
    icon: <FileText size={14} />,
    accent: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
    fileBase: 'blog-outline',
  },
  'email-rewrite': {
    label: 'Rewritten email',
    icon: <Mail size={14} />,
    accent: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    fileBase: 'email-rewrite',
  },
  'social-post': {
    label: 'Social posts',
    icon: <Share2 size={14} />,
    accent: 'text-purple-300 bg-purple-500/10 border-purple-500/20',
    fileBase: 'social-posts',
  },
}

export default function OutputCard({
  content,
  variant = 'blog-outline',
  onRegenerate,
  isLoading,
  isStreaming = false,
}: OutputCardProps) {
  if (!content) return null

  const meta = variantMeta[variant]
  const words = content.trim().split(/\s+/).filter(Boolean).length
  const chars = content.length

  const handleMarkdown = () => {
    downloadMarkdown(content, `${meta.fileBase}-${Date.now()}.md`)
    toast.success('Markdown downloaded')
  }

  const handlePdf = () => {
    try {
      exportPdf(content, meta.label)
      toast.success('Opening print dialog for PDF')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'PDF export failed')
    }
  }

  return (
    <section className="glass glow animate-fade-in overflow-hidden rounded-2xl">
      <div className="flex flex-col gap-3 border-b border-white/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${meta.accent}`}
          >
            {meta.icon}
            {meta.label}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{words} words</span>
            <span className="text-white/20">•</span>
            <span>{chars} chars</span>
            {isStreaming && (
              <>
                <span className="text-white/20">•</span>
                <span className="animate-pulse text-primary-400">Streaming…</span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isLoading}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-400 transition-all duration-200 hover:bg-white/10 hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw size={13} />
              Regenerate
            </button>
          )}
          <button
            onClick={handleMarkdown}
            disabled={isStreaming}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-400 transition-all hover:bg-white/10 hover:text-gray-200 disabled:opacity-50"
          >
            <Download size={13} />
            MD
          </button>
          <button
            onClick={handlePdf}
            disabled={isStreaming}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-400 transition-all hover:bg-white/10 hover:text-gray-200 disabled:opacity-50"
          >
            <FileDown size={13} />
            PDF
          </button>
          <CopyButton text={content} />
        </div>
      </div>

      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <ContentBody content={content} variant={variant} />
        {!isStreaming && <ContentScorePanel content={content} />}
      </div>
    </section>
  )
}
