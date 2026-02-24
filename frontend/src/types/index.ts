export type Tone = 'formal' | 'casual' | 'persuasive' | 'professional' | 'friendly' | 'witty'

export type Platform = 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'threads'

export type BlogLength = 'short' | 'medium' | 'long'

export type ToolType = 'blog-outline' | 'email-rewrite' | 'social-post'

export interface BlogOutlineRequest {
  topic: string
  tone: Tone
  length: BlogLength
}

export interface BlogOutlineResponse {
  outline: string
  topic: string
  tone: string
  length: string
}

export interface EmailRewriteRequest {
  draft_email: string
  tone: Tone
}

export interface EmailRewriteResponse {
  rewritten_email: string
  original_tone: string
  applied_tone: string
}

export interface SocialPostRequest {
  topic: string
  platform: Platform
  tone: Tone
}

export interface SocialPostResponse {
  posts: string
  topic: string
  platform: string
  tone: string
}

export interface HistoryItem {
  id: string
  tool: ToolType
  input: Record<string, string>
  output: string
  timestamp: number
}
