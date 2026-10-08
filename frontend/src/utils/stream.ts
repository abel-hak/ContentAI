const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function streamGenerate(
  path: string,
  body: Record<string, unknown>,
  onToken: (token: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })

  if (!response.ok) {
    let detail = `Request failed (${response.status})`
    try {
      const data = await response.json()
      if (typeof data.detail === 'string') detail = data.detail
    } catch {
      // ignore parse errors
    }
    throw new Error(detail)
  }

  if (!response.body) {
    throw new Error('Streaming is not supported in this browser.')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split('\n\n')
    buffer = parts.pop() || ''

    for (const part of parts) {
      const line = part
        .split('\n')
        .find((entry) => entry.startsWith('data: '))
      if (!line) continue

      const payload = JSON.parse(line.slice(6)) as {
        type: string
        content?: string
        detail?: string
      }

      if (payload.type === 'token' && payload.content) {
        fullText += payload.content
        onToken(payload.content)
      } else if (payload.type === 'error') {
        throw new Error(payload.detail || 'Streaming failed')
      }
    }
  }

  return fullText
}
