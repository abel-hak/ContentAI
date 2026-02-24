import type { Tone } from '../types'

const tones: { value: Tone; label: string; icon: string }[] = [
  { value: 'formal', label: 'Formal', icon: '🎩' },
  { value: 'casual', label: 'Casual', icon: '😊' },
  { value: 'persuasive', label: 'Persuasive', icon: '💪' },
  { value: 'professional', label: 'Professional', icon: '💼' },
  { value: 'friendly', label: 'Friendly', icon: '👋' },
  { value: 'witty', label: 'Witty', icon: '✨' },
]

interface ToneSelectorProps {
  value: Tone
  onChange: (tone: Tone) => void
}

export default function ToneSelector({ value, onChange }: ToneSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Tone & Style</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {tones.map((tone) => (
          <button
            key={tone.value}
            type="button"
            onClick={() => onChange(tone.value)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              value === tone.value
                ? 'bg-primary-600/30 border-primary-500/50 text-primary-300 shadow-lg shadow-primary-500/10'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-300'
            } border`}
          >
            <span>{tone.icon}</span>
            <span>{tone.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
