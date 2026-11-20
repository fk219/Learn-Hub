import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import Learners from './pages/Learners'
import Orders from './pages/Orders'
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
      .then((result) => {
        if (result.user?.role === 'admin') {
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
      .finally(() => setIsReady(true))
  }, [])

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-chalk">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cobalt" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Opening the ledger</span>
        </div>
      </div>
    )
  }

  if (!isAuthed) return <Login onSuccess={() => window.location.reload()} />

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/learners" element={<Learners />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Layout>
  )
}

export default App
