import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { loginUser, registerUser, verifyUser } from '../api/auth.js'

const AuthContext = createContext()

const TOKEN_STORAGE_KEY = 'domina_basic_token'

const createBasicToken = ({ email, password }) => {
  if (!email || !password) {
    throw new Error('El correo y la contraseña son obligatorios')
  }
  return window.btoa(`${email}:${password}`)
}

async function fetchUserWithToken (token) {
  if (!token) return null
  return verifyUser(token)
}

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

    fetchUserWithToken(storedToken)
      .then((userData) => {
        setToken(storedToken)
        setUser(userData)
      })
      .catch(() => {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY)
      })
      .finally(() => setLoading(false))
  }, [])

  const persistSession = useCallback((basicToken, userData) => {
    setToken(basicToken)
    setUser(userData)
    window.localStorage.setItem(TOKEN_STORAGE_KEY, basicToken)
    setError(null)
  }, [])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const basicToken = createBasicToken(credentials)
      await loginUser(basicToken)
      const userData = await fetchUserWithToken(basicToken)
      persistSession(basicToken, userData)
      return { token: basicToken, user: userData }
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión')
      throw err
    } finally {
      setLoading(false)
    }
  }, [persistSession])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      await registerUser(payload)
      const basicToken = createBasicToken(payload)
      const userData = await fetchUserWithToken(basicToken)
      persistSession(basicToken, userData)
      return { token: basicToken, user: userData }
    } catch (err) {
      setError(err.message || 'No se pudo crear el usuario')
      throw err
    } finally {
      setLoading(false)
    }
  }, [persistSession])

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
