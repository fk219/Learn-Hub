import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiFetch, clearAccessToken, getAccessToken, setAccessToken } from '../lib/apiClient'

export const AuthContext = createContext(null)

const USER_KEY = 'learnhub_user'

function readStoredUser() {
  try {
    const value = localStorage.getItem(USER_KEY)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [loading, setLoading] = useState(Boolean(getAccessToken()))

  const persist = useCallback((nextUser) => {
    setUser(nextUser)
    if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    else localStorage.removeItem(USER_KEY)
  }, [])

  useEffect(() => {
    let active = true
    const token = getAccessToken()
    if (!token) {
      setLoading(false)
      return () => {
        active = false
      }
    }

    apiFetch('/api/auth/me')
      .then((result) => {
        if (active) persist(result.user)
      })
      .catch(() => {
        if (!active) return
        clearAccessToken()
        persist(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [persist])

  const login = useCallback(async (email, password) => {
    const result = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setAccessToken(result.accessToken)
    persist(result.user)
    return result.user
  }, [persist])

  const register = useCallback(async (name, email, password) => {
    const result = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
    setAccessToken(result.accessToken)
    persist(result.user)
    return result.user
  }, [persist])

  const logout = useCallback(() => {
    clearAccessToken()
    persist(null)
  }, [persist])

  const value = useMemo(
    () => ({ user, loading, login, register, logout, isAuthenticated: Boolean(user) }),
    [user, loading, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
