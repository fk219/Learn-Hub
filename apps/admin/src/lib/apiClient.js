const API_URL = import.meta.env.VITE_API_URL

export function getAdminAccessToken() {
  return localStorage.getItem('adminAccessToken')
}

export function setAdminAccessToken(token) {
  localStorage.setItem('adminAccessToken', token)
}

export function clearAdminAccessToken() {
  localStorage.removeItem('adminAccessToken')
}

export async function apiFetch(path, options = {}) {
  const token = getAdminAccessToken()
  const headers = { ...(options.headers || {}) }

  if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error?.message || 'Request failed')
  return data
}

