import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { loginUser, registerUser, refreshSession } from '../api/auth.js'

const AuthContext = createContext()

const TOKEN_STORAGE_KEY = 'domina_auth_token'

export function AuthProvider ({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!storedToken) {
      setLoading(false)
      return
    }

    refreshSession(storedToken)
      .then((session) => {
        const nextToken = session.token || storedToken
        setToken(nextToken)
        setUser(session.user)
        if (session.token) {
          window.localStorage.setItem(TOKEN_STORAGE_KEY, session.token)
        }
      })
      .catch(() => {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleAuthResult = useCallback((result) => {
    setToken(result.token)
    setUser(result.user)
    window.localStorage.setItem(TOKEN_STORAGE_KEY, result.token)
    setError(null)
  }, [])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const result = await loginUser(credentials)
      handleAuthResult(result)
      return result
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión')
      throw err
    } finally {
      setLoading(false)
    }
  }, [handleAuthResult])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      const result = await registerUser(payload)
      handleAuthResult(result)
      return result
    } catch (err) {
      setError(err.message || 'No se pudo crear el usuario')
      throw err
    } finally {
      setLoading(false)
    }
  }, [handleAuthResult])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const value = {
    token,
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: Boolean(token)
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth () {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider')
  }
  return context
}
