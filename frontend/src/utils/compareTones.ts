import type { Tone } from '../types'

const ALL_TONES: Tone[] = [
  'formal',
  'casual',
  'persuasive',
  'professional',
  'friendly',
  'witty',
]

/** Primary tone + 2 alternating contrasts for side-by-side compare. */
export function pickCompareTones(primary: Tone): Tone[] {
  const contrasts = ALL_TONES.filter((tone) => tone !== primary)
  return [primary, contrasts[0], contrasts[Math.min(2, contrasts.length - 1)]]
}
