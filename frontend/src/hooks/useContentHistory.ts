import { useState, useCallback } from 'react'
import type { HistoryItem, ToolType } from '../types'

const MAX_HISTORY = 50

export function useContentHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])

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
