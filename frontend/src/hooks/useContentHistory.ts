import { useState, useCallback, useEffect } from 'react'
import type { HistoryItem, ToolType } from '../types'

const MAX_HISTORY = 50
const STORAGE_KEY = 'contentai-history'

function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as HistoryItem[]
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY) : []
  } catch {
    return []
  }
}

export function useContentHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(() => loadHistory())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [history])

  const addToHistory = useCallback(
    (tool: ToolType, input: Record<string, string>, output: string) => {
      const item: HistoryItem = {
        id: crypto.randomUUID(),
        tool,
        input,
        output,
        timestamp: Date.now(),
      }
      setHistory((prev) => [item, ...prev].slice(0, MAX_HISTORY))
    },
    []
  )

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }, [])

  return { history, addToHistory, clearHistory, removeFromHistory }
}
