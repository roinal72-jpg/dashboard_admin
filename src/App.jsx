import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom"
import { useEffect, useState } from "react"

import Sidebar from "./components/Sidebar"
import Header from "./components/Header"

import Dashboard from "./pages/Dashboard"
import Users from "./pages/Users"
import Agents from "./pages/Agents"
import Tasks from "./pages/Tasks"
import Analytics from "./pages/Analytics"
import Logs from "./pages/Logs"
import Settings from "./pages/Settings"
import Login from "./pages/Login/Login"

import { refreshAccessToken } from "./lib/auth"

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("admin_access_token")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AdminLayout() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main-content ml-60 w-[calc(100%-15rem)]">
        <Header />

        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function AppContent() {
  const location = useLocation()

  const [checkingSession, setCheckingSession] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const accessToken = localStorage.getItem("admin_access_token")
      const refreshToken = localStorage.getItem("admin_refresh_token")

      if (accessToken) {
        setAuthenticated(true)
        setCheckingSession(false)
        return
      }

      if (refreshToken) {
        const refreshed = await refreshAccessToken()

        if (refreshed) {
          setAuthenticated(true)
          setCheckingSession(false)
          return
        }
      }

      setAuthenticated(false)
      setCheckingSession(false)
    }

    checkSession()
  }, [])

  if (location.pathname === "/login") {
    return <Login />
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-500">
          Checking session...
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App