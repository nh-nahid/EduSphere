'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '@/lib/axios'

type User = {
  _id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'teacher' | 'student'
  schoolId?: string | { _id: string; name: string; slug: string; logo?: string }
  avatar?: string
  phone?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/auth/me')
      .then(r => setUser(r.data.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const logout = async () => {
    try {
      
      
      
      await api.post('/auth/logout')
    } catch {
      
    } finally {
      setUser(null)
      window.location.href = '/login'
    }
  }

  return <AuthContext.Provider value={{ user, loading, setUser, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
