export type Plan = 'free' | 'pro' | 'pro_cancelling' | 'one_time'

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  plan: Plan
  planExpiresAt?: string
  documentsUsedThisMonth: number
  oneTimeCredits: number
  aiUsageToday: number
  language: 'en' | 'fr'
  createdAt: string
  isEmailVerified: boolean
  username?: string
  bio?: string
  profilePublic?: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  language: 'en' | 'fr'
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}
