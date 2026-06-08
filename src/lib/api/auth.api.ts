import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../../types/auth'

// ─── Mock user store ──────────────────────────────────────────────────────────
// Persists users in localStorage under ds-mock-users.
// Replace these implementations with real API calls once a backend exists.

type MockUser = {
  id: string
  email: string
  name: string
  password: string
  language: 'en' | 'fr'
  createdAt: string
  username?: string
  bio?: string
  profilePublic?: boolean
}

const MOCK_USERS_KEY = 'ds-mock-users'

function getMockUsers(): MockUser[] {
  try {
    return JSON.parse(localStorage.getItem(MOCK_USERS_KEY) ?? '[]') as MockUser[]
  } catch {
    return []
  }
}

function saveMockUsers(users: MockUser[]): void {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
}

function getCurrentUserId(): string | null {
  try {
    const stored = localStorage.getItem('ds-auth')
    if (!stored) return null
    const parsed = JSON.parse(stored) as { state?: { user?: { id?: string } } }
    return parsed?.state?.user?.id ?? null
  } catch {
    return null
  }
}

function buildAuthResponse(user: MockUser): AuthResponse {
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      language: user.language,
      plan: 'free',
      documentsUsedThisMonth: 0,
      oneTimeCredits: 0,
      aiUsageToday: 0,
      createdAt: user.createdAt,
      isEmailVerified: true,
    },
    tokens: {
      accessToken: `mock-token-${user.id}`,
      refreshToken: `mock-refresh-${user.id}`,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    },
  }
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: RegisterCredentials): Promise<AuthResponse> => {
    const users = getMockUsers()
    if (users.find((u) => u.email === data.email)) {
      return Promise.reject(new Error('An account with this email already exists'))
    }
    const newUser: MockUser = {
      id: `mock-${Date.now()}`,
      email: data.email,
      name: data.name,
      password: data.password,
      language: data.language,
      createdAt: new Date().toISOString(),
    }
    saveMockUsers([...users, newUser])
    return Promise.resolve(buildAuthResponse(newUser))
  },

  login: (data: LoginCredentials): Promise<AuthResponse> => {
    const users = getMockUsers()
    const user = users.find((u) => u.email === data.email)
    if (!user || user.password !== data.password) {
      return Promise.reject(new Error('Invalid email or password'))
    }
    return Promise.resolve(buildAuthResponse(user))
  },

  logout: (): Promise<void> => Promise.resolve(),

  verifyEmail: (_token: string): Promise<AuthResponse> =>
    Promise.reject(new Error('Email verification not available in mock mode')),

  resendVerification: (_email: string): Promise<void> => Promise.resolve(),

  forgotPassword: (_email: string): Promise<void> => Promise.resolve(),

  resetPassword: (_token: string, _password: string): Promise<void> => Promise.resolve(),

  me: (): Promise<AuthResponse['user']> => {
    const id = getCurrentUserId()
    const user = getMockUsers().find((u) => u.id === id)
    if (!user) return Promise.reject(new Error('Not authenticated'))
    return Promise.resolve(buildAuthResponse(user).user)
  },

  updateProfile: (data: { name?: string; username?: string; bio?: string; profilePublic?: boolean }): Promise<void> => {
    const id = getCurrentUserId()
    const users = getMockUsers()
    const idx = users.findIndex((u) => u.id === id)
    if (idx === -1) return Promise.reject(new Error('Not authenticated'))
    if (data.name !== undefined) users[idx]!.name = data.name
    if (data.username !== undefined) users[idx]!.username = data.username
    if (data.bio !== undefined) users[idx]!.bio = data.bio
    if (data.profilePublic !== undefined) users[idx]!.profilePublic = data.profilePublic
    saveMockUsers(users)
    return Promise.resolve()
  },

  getUserByUsername: (username: string): Promise<{ id: string; name: string; email: string; username?: string; avatarUrl?: string; bio?: string; profilePublic?: boolean } | null> => {
    const users = getMockUsers()
    const user = users.find((u) => u.username === username)
    if (!user) return Promise.resolve(null)
    return Promise.resolve({ id: user.id, name: user.name, email: user.email, username: user.username, bio: user.bio, profilePublic: user.profilePublic })
  },

  changePassword: (currentPassword: string, newPassword: string): Promise<void> => {
    const id = getCurrentUserId()
    const users = getMockUsers()
    const idx = users.findIndex((u) => u.id === id)
    if (idx === -1) return Promise.reject(new Error('Not authenticated'))
    if (users[idx]!.password !== currentPassword) {
      return Promise.reject(new Error('Current password is incorrect'))
    }
    users[idx]!.password = newPassword
    saveMockUsers(users)
    return Promise.resolve()
  },

  deleteAccount: (): Promise<void> => {
    const id = getCurrentUserId()
    saveMockUsers(getMockUsers().filter((u) => u.id !== id))
    return Promise.resolve()
  },

  loginWithGoogle: () => {
    window.alert('Google login is not available without a backend.')
  },
}
