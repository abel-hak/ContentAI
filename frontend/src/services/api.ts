import axios from 'axios'
import type {
  BlogOutlineRequest,
  BlogOutlineResponse,
  EmailRewriteRequest,
  EmailRewriteResponse,
  Platform,
  SocialPostRequest,
  SocialPostResponse,
  Tone,
  ToolType,
} from '../types'
import { streamGenerate } from '../utils/stream'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 90000,
})

export async function generateBlogOutline(data: BlogOutlineRequest): Promise<BlogOutlineResponse> {
  const res = await api.post<BlogOutlineResponse>('/generate/blog-outline', data)
  return res.data
}

export async function rewriteEmail(data: EmailRewriteRequest): Promise<EmailRewriteResponse> {
  const res = await api.post<EmailRewriteResponse>('/generate/email-rewrite', data)
  return res.data
}

export async function generateSocialPost(data: SocialPostRequest): Promise<SocialPostResponse> {
  const res = await api.post<SocialPostResponse>('/generate/social-post', data)
  return res.data
}

export async function streamBlogOutline(
  data: BlogOutlineRequest,
  onToken: (token: string) => void,
  signal?: AbortSignal
) {
  return streamGenerate('/generate/blog-outline/stream', data, onToken, signal)
}

export async function streamEmailRewrite(
  data: EmailRewriteRequest,
  onToken: (token: string) => void,
  signal?: AbortSignal
) {
  return streamGenerate('/generate/email-rewrite/stream', data, onToken, signal)
}

export async function streamSocialPost(
  data: SocialPostRequest,
  onToken: (token: string) => void,
  signal?: AbortSignal
) {
  return streamGenerate('/generate/social-post/stream', data, onToken, signal)
}

export interface CompareVariant {
  tone: string
  content: string
}

export async function compareTones(payload: {
  tool: ToolType
  tones: Tone[]
  topic?: string
  length?: string
  draft_email?: string
  platform?: Platform
}): Promise<CompareVariant[]> {
  const res = await api.post<{ variants: CompareVariant[] }>('/generate/compare', payload)
  return res.data.variants
}

export async function healthCheck(): Promise<{ status: string }> {
  const res = await api.get('/health')
  return res.data
}
