import axios from 'axios'
import type {
  BlogOutlineRequest,
  BlogOutlineResponse,
  EmailRewriteRequest,
  EmailRewriteResponse,
  SocialPostRequest,
  SocialPostResponse,
} from '../types'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
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

export async function healthCheck(): Promise<{ status: string }> {
  const res = await api.get('/health')
  return res.data
}
