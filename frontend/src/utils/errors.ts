import axios from 'axios'

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && !axios.isAxiosError(error) && error.message) {
    const lower = error.message.toLowerCase()
    if (lower.includes('rate limit') || lower.includes('429') || lower.includes('quota')) {
      return 'Rate limit reached. Please wait a moment and try again.'
    }
    if (lower.includes('api key') || lower.includes('unauthorized') || lower.includes('401')) {
      return 'API key is missing or invalid. Check your backend .env file.'
    }
    if (lower.includes('failed to fetch') || lower.includes('networkerror')) {
      return 'Cannot reach the backend. Make sure the API server is running.'
    }
    return error.message.length > 160 ? `${error.message.slice(0, 160)}…` : error.message
  }

  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string' && detail.trim()) {
      const lower = detail.toLowerCase()
      if (lower.includes('rate limit') || lower.includes('429') || lower.includes('quota')) {
        return 'Rate limit reached. Please wait a moment and try again.'
      }
      if (lower.includes('api key') || lower.includes('unauthorized') || lower.includes('401')) {
        return 'API key is missing or invalid. Check your backend .env file.'
      }
      return detail.length > 160 ? `${detail.slice(0, 160)}…` : detail
    }

    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. The AI service took too long to respond.'
    }

    if (!error.response) {
      return 'Cannot reach the backend. Make sure the API server is running.'
    }

    if (error.response.status >= 500) {
      return 'Server error while generating content. Please try again.'
    }
  }

  return fallback
}
