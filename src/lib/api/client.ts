const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('ds-auth')
    if (!stored) return null
    const parsed = JSON.parse(stored) as { state?: { accessToken?: string } }
    return parsed?.state?.accessToken ?? null
  } catch {
    return null
  }
}

async function request<T>(
  method: Method,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    localStorage.removeItem('ds-auth')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error((err as { message: string }).message ?? 'Request failed')
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
