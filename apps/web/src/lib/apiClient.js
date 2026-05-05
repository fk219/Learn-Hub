const API_URL = import.meta.env.VITE_API_URL

export function getAccessToken() {
  return localStorage.getItem('accessToken')
}

export function setAccessToken(token) {
  localStorage.setItem('accessToken', token)
}

export function clearAccessToken() {
  localStorage.removeItem('accessToken')
}

export async function apiFetch(path, options = {}) {
  const token = getAccessToken()
  const headers = { ...(options.headers || {}) }

  if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error?.message || 'Request failed')
  return data
}

