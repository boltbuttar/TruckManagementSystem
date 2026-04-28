import React, { createContext, useContext, useState, useCallback } from 'react'

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

  const login = useCallback((userData) => {
    const userWithDefaults = {
      ...userData,
      role: userData.role || 'driver',
      token: userData.token || `token_${Date.now()}`, // Mock token
      loginTime: new Date().toISOString(),
    }
    setUser(userWithDefaults)
    localStorage.setItem('tdms_user', JSON.stringify(userWithDefaults))
    return userWithDefaults
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('tdms_user')
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
      isAuthenticated 
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
