export interface ContentScores {
  words: number
  characters: number
  sentences: number
  readingTimeMin: number
  flesch: number
  readabilityLabel: string
  seoScore: number
  tips: string[]
}

function countSyllables(word: string): number {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!cleaned) return 0
  if (cleaned.length <= 3) return 1

  const matches = cleaned
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    .replace(/^y/, '')
    .match(/[aeiouy]{1,2}/g)

  return matches ? matches.length : 1
}

export function analyzeContent(text: string): ContentScores {
  const trimmed = text.trim()
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : []
  const wordCount = words.length
  const characters = trimmed.length
  const sentences = Math.max(
    1,
    (trimmed.match(/[.!?]+(\s|$)/g) || []).length || (trimmed ? 1 : 0)
  )
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0)

  const flesch =
    wordCount === 0
      ? 0
      : Math.max(
          0,
          Math.min(
            100,
            Math.round(
              206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllables / wordCount)
            )
          )
        )

  let readabilityLabel = 'Difficult'
  if (flesch >= 70) readabilityLabel = 'Easy'
  else if (flesch >= 50) readabilityLabel = 'Moderate'

  const tips: string[] = []
  let seoScore = 40

  if (wordCount >= 120) seoScore += 15
  else tips.push('Aim for at least 120 words for stronger SEO depth.')

  if (/^#\s+/m.test(trimmed) || /^##\s+/m.test(trimmed)) seoScore += 15
  else tips.push('Add clear headings to improve structure and scanability.')

  if (/\b(seo|keyword|cta|call to action)\b/i.test(trimmed)) seoScore += 10

  if ((trimmed.match(/[-*]\s+/g) || []).length >= 3) seoScore += 10
  else tips.push('Use bullet points to make key ideas easier to scan.')

  if (sentences > 0 && wordCount / sentences < 25) seoScore += 10
  else tips.push('Shorten a few long sentences for better readability.')

  if (flesch >= 50) seoScore += 10
  else tips.push('Simplify wording to improve readability score.')

  seoScore = Math.max(0, Math.min(100, seoScore))
  if (tips.length === 0) tips.push('Looks solid — ready to publish with light edits.')

  return {
    words: wordCount,
    characters,
    sentences,
    readingTimeMin: Math.max(1, Math.ceil(wordCount / 200)),
    flesch,
    readabilityLabel,
    seoScore,
    tips: tips.slice(0, 3),
  }
}
