import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import Users from './pages/Users'
import Payments from './pages/Payments'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Login from './pages/Login'
import { apiFetch, clearAdminAccessToken, getAdminAccessToken } from './lib/apiClient'

function App() {
  const [isReady, setIsReady] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const token = getAdminAccessToken()
    if (!token) {
      setIsAuthed(false)
      setIsReady(true)
      return
    }

    apiFetch('/api/auth/me')
      .then((r) => {
        if (r.user?.role === 'admin') {
          setIsAuthed(true)
        } else {
          clearAdminAccessToken()
          setIsAuthed(false)
        }
      })
      .catch(() => {
        clearAdminAccessToken()
        setIsAuthed(false)
      })
      .finally(() => {
        setIsReady(true)
      })
  }, [])

  if (!isReady) return null
  if (!isAuthed) return <Login onSuccess={() => window.location.reload()} />

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/users" element={<Users />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App
