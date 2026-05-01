import React, { createContext, useContext, useState, useCallback } from 'react'
import { post } from '../api/client.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('tdms_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  /**
   * Authenticate against the backend.
   *
   * Accepts either:
   *   - A pre-built user object (legacy path, used internally after a
   *     successful API response so callers don't have to duplicate storage
   *     logic), OR
   *   - An object with { email, password, role } which triggers a real POST
   *     to /api/auth/login and returns the server response.
   *
   * Returns the stored user object on success, or throws on failure.
   */
  const login = useCallback(async (credentials) => {
    // If the caller already has a resolved user object (e.g. from a direct
    // API call in the page component), just persist it.
    if (credentials.token) {
      const userRecord = {
        ...credentials,
        role: credentials.role || 'driver',
        loginTime: new Date().toISOString(),
      }
      setUser(userRecord)
      localStorage.setItem('tdms_user', JSON.stringify(userRecord))
      return userRecord
    }

    // Otherwise hit the backend.
    const { email, password, role = 'driver' } = credentials
    const data = await post('/api/auth/login', { email, password, role })

    const userRecord = {
      // Normalise across different backend response shapes.
      id: data.user?.id ?? data.id,
      name: data.user?.name ?? data.name ?? email,
      email: data.user?.email ?? data.email ?? email,
      role: data.user?.role ?? data.role ?? role,
      token: data.token ?? data.accessToken,
      loginTime: new Date().toISOString(),
    }

    setUser(userRecord)
    localStorage.setItem('tdms_user', JSON.stringify(userRecord))
    return userRecord
  }, [])

  /**
   * Sign the current user out.
   * Notifies the backend (best-effort) then clears local state.
   */
  const logout = useCallback(async () => {
    try {
      await post('/api/auth/logout', {})
    } catch {
      // Ignore — we always clear the local session.
    } finally {
      setUser(null)
      localStorage.removeItem('tdms_user')
    }
  }, [])

  const isAdmin = user?.role === 'admin'
  const isDriver = user?.role === 'driver'
  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAdmin,
      isDriver,
      isAuthenticated,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
