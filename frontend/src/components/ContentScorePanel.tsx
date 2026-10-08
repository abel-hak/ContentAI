import { analyzeContent } from '../utils/contentScore'
import { Gauge, Clock3, Type, Sparkles } from 'lucide-react'

interface Props {
  content: string
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className="font-semibold text-gray-200">{value}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default function ContentScorePanel({ content }: Props) {
  if (!content.trim()) return null

  const scores = analyzeContent(content)

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-4 flex items-center gap-2">
        <Gauge size={14} className="text-accent-400" />
        <h4 className="text-sm font-semibold text-gray-200">Content score</h4>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg bg-white/5 px-3 py-2">
          <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-gray-500">
            <Type size={11} /> Words
          </div>
          <div className="mt-1 text-lg font-semibold text-gray-100">{scores.words}</div>
        </div>
        <div className="rounded-lg bg-white/5 px-3 py-2">
          <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-gray-500">
            <Clock3 size={11} /> Read time
          </div>
          <div className="mt-1 text-lg font-semibold text-gray-100">{scores.readingTimeMin}m</div>
        </div>
        <div className="rounded-lg bg-white/5 px-3 py-2">
          <div className="text-[11px] uppercase tracking-wide text-gray-500">Readability</div>
          <div className="mt-1 text-lg font-semibold text-gray-100">{scores.readabilityLabel}</div>
        </div>
        <div className="rounded-lg bg-white/5 px-3 py-2">
          <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-gray-500">
            <Sparkles size={11} /> Flesch
          </div>
          <div className="mt-1 text-lg font-semibold text-gray-100">{scores.flesch}</div>
        </div>
      </div>

      <div className="space-y-3">
        <ScoreBar label="SEO score" value={scores.seoScore} color="bg-gradient-to-r from-primary-500 to-accent-400" />
        <ScoreBar label="Readability score" value={scores.flesch} color="bg-emerald-500" />
      </div>

      <ul className="mt-4 space-y-1.5">
        {scores.tips.map((tip) => (
          <li key={tip} className="text-xs leading-relaxed text-gray-500">
            • {tip}
          </li>
        ))}
      </ul>
    </div>
  )
}
