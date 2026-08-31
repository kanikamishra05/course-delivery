import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, check if a token exists and fetch the current user
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api
        .get('/auth/me')
        .then((res) => {
          setUser(res.data.data.user)
        })
        .catch(() => {
          // Token is invalid or expired — clear it
          localStorage.removeItem('token')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (name, email, password, role) => {
    const res = await api.post('/auth/register', { name, email, password, role })
    const { user: userData, token } = res.data.data
    localStorage.setItem('token', token)
    setUser(userData)
    return userData
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { user: userData, token } = res.data.data
    localStorage.setItem('token', token)
    setUser(userData)
    return userData
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Logout endpoint may fail — still clear local state
    }
    localStorage.removeItem('token')
    setUser(null)
  }, [])

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
